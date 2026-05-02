"use server";
import { Query, ID, Client, Account } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite";
import { appwriteConfig } from "../appwrite/config";
import { parseStringify } from "../utils";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const getUserByEmail = async (email: string) => {
    const { databases } = await createAdminClient();

    const result = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.userTableId,
        [Query.equal("email", [email])]
    )

    return result.total > 0 ? result.documents[0] : null;
}

const handleError = (error: unknown, message: string) => {
    console.log(error, message);
    throw new Error(message);
}

export const sendEmailOTP = async (email: string) => {
    const { account } = await createAdminClient();

    try {
        const session = await account.createEmailToken(ID.unique(), email)

        if (!session?.userId) {
            throw new Error("Failed to generate OTP session");
        }

        return session.userId;
    } catch (error) {
        handleError(error, "Failed to send email OTP");
    }
}

export const createAccount = async ({
  fullName,
  email,
}: {
  fullName?: string;
  email: string;
}) => {
  try {
    const { databases } = await createAdminClient();

    const existingUser = await getUserByEmail(email);

    const accountId = await sendEmailOTP(email);
    if (!accountId) throw new Error("Failed to send OTP");

    const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
      fullName || email
    )}&background=2563eb&color=fff`;

    if (!existingUser) {
      await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.userTableId,
        ID.unique(),
        {
          fullName: fullName || "",
          email,
          avatar,
          accountId,
        }
      );
    } else {
      await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.userTableId,
        existingUser.$id,
        { accountId }
      );
    }

    return parseStringify({
      success: true,
      accountId,
      isNewUser: !existingUser,
    });

  } catch (error: any) {
    console.error("Create Account Error:", error);

    return {
      success: false,
      message: error.message || "Something went wrong",
    };
  }
};

export const verifySecret = async ({
  accountId, 
  otp,
} : {
  accountId: string;
  otp: string;
}) => {
  try{
    const {account} = await createAdminClient();

    const session = await account.createSession(accountId, otp);

    (await cookies()).set("appwrite-session", session.secret, {
      path: '/',
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return parseStringify({
      success: true,
      sessionId: session.$id,
    });

  } catch (error: any) {
    console.error("Verify OTP Error:", error);

    return {
      success: false,
      message: error.message || "Invalid or expired code",
    };
  }
}

export const getCurrentUser = async () => {
  try {
    const { databases, account } = await createSessionClient();

    const currentAccount = await account.get();

    const userResult = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userTableId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (userResult.total <= 0) return null;

    return parseStringify(userResult.documents[0]);

  } catch (error) {
    console.error("Get Current User Error:", error);
    return null;
  }
};

export const signOutUser = async () => {
  
  try{
    const {account} = await createSessionClient();

    await account.deleteSession('current');

  } catch (error){
    console.error("Failed to sign out user", error);
  } 

  const cookieStore = await cookies();
  cookieStore.delete("appwrite-session");
  
  redirect('/sign-in')
  
}
"use server";
import { Query, ID, Client, Account } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite";
import { appwriteConfig } from "../appwrite/config";
import { parseStringify } from "../utils";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

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
          avatarFileId: "",
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
    const { databases, account, hasSession } = await createSessionClient();

    if (!hasSession) {
      return null;
    }

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

export const signInUser = async ({ email }: { email: string }) => {
  try {
    const existingUser = await getUserByEmail(email);

    if (!existingUser) {
      return {
        success: false,
        message: "User not found. Please sign up.",
      };
    }

    const accountId = await sendEmailOTP(email);
    
    if (!accountId) throw new Error("Failed to send OTP");

    return parseStringify({ 
      success: true, 
      accountId: existingUser.accountId 
    });

  } catch (error: any) {
    console.error("Sign-in Error:", error);
    
    return {
      success: false,
      message: error.message || "Failed to sign in. Please try again.",
    };
  }
};

export const deleteUserAccount = async () => {
  try {
    const sessionCookie = (await cookies()).get("appwrite-session");

    if (!sessionCookie?.value) {
      throw new Error("No active session found");
    }

    const { account } = await createSessionClient();

    const { databases, storage, users } = await createAdminClient();

    const currentUser = await account.get();

    const existingUser = await getUserByEmail(currentUser.email);

    const files = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.filesTableId,
      [Query.equal("owner", currentUser.$id)]
    );

    await Promise.all(
      files.documents.map(async (file: any) => {
        try {
          if (file.bucketFileId) {
            await storage.deleteFile(
              appwriteConfig.bucketId,
              file.bucketFileId
            );
          }

          await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.filesTableId,
            file.$id,
          );
        } catch (error) {
          console.error("Failed to delete file:", file.$id, error);
        }
      })
    );

    if (existingUser) {
      await databases.deleteDocument(
        appwriteConfig.databaseId,
        appwriteConfig.userTableId,
        existingUser.$id
      );
    }


    (await cookies()).delete("appwrite-session");

  } catch (error) {
    console.error("Delete account error:", error);
    throw error;
  }

  redirect("/sign-in");
};

import { AppwriteException } from "appwrite";
import { getAvatarUrl } from "../getAvatar";

export const updateUserFullName = async (fullName: string) => {
  try {
    const { account, databases } = await createSessionClient();

    const sanitizedName = fullName.trim();

    if (!sanitizedName) {
      throw new Error("Full name is required");
    }

    if (sanitizedName.length < 3) {
      throw new Error("Full name must be at least 3 characters");
    }

    const currentUser = await account.get();

    if (currentUser.name === sanitizedName) {
      throw new Error("The new name is the same as your current name.");
    }

    await account.updateName(sanitizedName);

    const existingUser = await getUserByEmail(currentUser.email);

    if (!existingUser) {
      throw new Error("User document not found");
    }

    const updatedUser = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userTableId,
      existingUser.$id,
      {
        fullName: sanitizedName,
      }
    );

    return parseStringify({
      success: true,
      data: updatedUser,
    });

  } catch (error: unknown) {

    if (error instanceof AppwriteException) {
      console.error(
        "Appwrite specific error:",
        error.message,
        error.code
      );

      return {
        success: false,
        message: `Appwrite Error (${error.code}): ${error.message}`,
      };
    }

    if (error instanceof Error) {
      console.error("Update full name error:", error.message);

      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: false,
      message: "An unexpected error occurred",
    };
  }
};

export const updateUserAvatar = async (file: File) => {
  try {
    const { account, databases, storage } = await createSessionClient();

    const currentUser = await account.get();

    const existingUser = await getUserByEmail(currentUser.email);

    if (!existingUser) {
      throw new Error("User document not found");
    }

    if (!file.type.startsWith("image/")) {
      throw new Error("Please upload a valid image");
    }

    const uploadedFile = await storage.createFile(
      appwriteConfig.bucketId,
      ID.unique(),
      file
    );

    const avatarUrl = `${appwriteConfig.endpointUrl}/storage/buckets/${appwriteConfig.bucketId}/files/${uploadedFile.$id}/view?project=${appwriteConfig.projectId}`;

    if (existingUser.avatarFileId) {
      try {
        await storage.deleteFile(
          appwriteConfig.bucketId,
          existingUser.avatarFileId
        );
      } catch (error) {
        console.warn("Old avatar could not be deleted");
      }
    }

    const updatedUser = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userTableId,
      existingUser.$id,
      {
        avatar: avatarUrl,
        avatarFileId: uploadedFile.$id,
      }
    );

    revalidatePath("/", "layout");

    return parseStringify({
      success: true,
      data: updatedUser,
      avatar: avatarUrl,
    });

  } catch (error: unknown) {
    if (error instanceof AppwriteException) {
      console.error("Appwrite specific error:", error.message, error.code);
      return { success: false, message: `Appwrite Error (${error.code}): ${error.message}` };
    }

    if (error instanceof Error) {
      console.error("Avatar upload error:", error.message);
      return { success: false, message: error.message };
    }

    return { success: false, message: "An unexpected error occurred" };
  }
};

export const deleteUserAvatar = async () => {
  try {
    const { account, databases, storage } = await createSessionClient();

    const currentUser = await account.get();

    const existingUser = await getUserByEmail(currentUser.email);

    if (!existingUser) {
      throw new Error("User document not found");
    }

    // Delete uploaded avatar from storage if it exists
    if (existingUser.avatarFileId) {
      try {
        await storage.deleteFile(
          appwriteConfig.bucketId,
          existingUser.avatarFileId
        );
      } catch (error) {
        console.warn(
          "Avatar file could not be deleted or no longer exists."
        );
      }
    }

    // Clear avatar fields in database
    const updatedUser = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userTableId,
      existingUser.$id,
      {
        avatar: "",
        avatarFileId: "",
      }
    );

    const fallbackAvatar = getAvatarUrl({
      avatar: "",
      fullName: existingUser.fullName,
      email: existingUser.email,
    });

    revalidatePath("/", "layout");

    return parseStringify({
      success: true,
      data: updatedUser,
      avatar: fallbackAvatar,
    });
  } catch (error: unknown) {
    if (error instanceof AppwriteException) {
      console.error(
        "Appwrite specific error:",
        error.message,
        error.code
      );

      return {
        success: false,
        message: `Appwrite Error (${error.code}): ${error.message}`,
      };
    }

    if (error instanceof Error) {
      console.error("Delete avatar error:", error.message);

      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: false,
      message: "An unexpected error occurred",
    };
  }
};
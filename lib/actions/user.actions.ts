"use server";
import { Query, ID } from "node-appwrite";
import { createAdminClient } from "../appwrite";
import { appwriteConfig } from "../appwrite/config";
import { parseStringify } from "../utils";

const getUserByEmail = async (email: string) => {
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

const sendEmailOTP = async (email: string) => {
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
    fullName: string;
    email: string;
}) => {
    let createdUserId: string | null = null;

    try {
        const existingUser = await getUserByEmail(email);

        if (existingUser) {
        return {
            success: false,
            message: "An account with this email already exists. Please sign in.",
        };
        }

        const { databases } = await createAdminClient();

        const generatedAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
            fullName
        )}&background=2563eb&color=fff`;

        const uploadedAvatar: string | null = null;

        const avatar = uploadedAvatar ?? generatedAvatar;

        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userTableId,
            ID.unique(),
            {
                fullName,
                email,
                avatar,
            }
        );

        createdUserId = newUser.$id;

        
        const accountId = await sendEmailOTP(email);
        if (!accountId) throw new Error("Failed to send OTP");

        await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userTableId,
            newUser.$id,
            { accountId }
        );

        return parseStringify({
            success: true,
            accountId,
        });

    } catch (error: any) {
        console.error("Account Creation Error:", error);

        if (createdUserId) {
            try {
                const { databases } = await createAdminClient();

                await databases.deleteDocument(
                appwriteConfig.databaseId,
                appwriteConfig.userTableId,
                createdUserId
                );
            } catch (cleanupError) {
                console.error("Rollback failed:", cleanupError);
            }
        }

        return {
            success: false,
            message: error.message || "An unexpected error occurred. Please try again.",
        };
    }
};
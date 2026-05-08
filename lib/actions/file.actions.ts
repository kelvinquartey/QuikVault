"use server"

import { createAdminClient } from "../appwrite";
import { InputFile } from "node-appwrite/file";
import { appwriteConfig } from "../appwrite/config";
import { ID, Models, Query } from "node-appwrite";
import { constructFileUrl, getFileType, parseStringify } from "../utils";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "./user.actions";


const handleError = (error: unknown, message: string) => {
    console.log(error, message);
    throw new Error(message);
}

export const uploadFile = async ({
    file,
    ownerId,
    accountId,
    path,
}: UploadFileProps) => {
    const { storage, databases } = await createAdminClient();

    let bucketFile = null;

    try {
        const inputFile = InputFile.fromBuffer(file, file.name);

        bucketFile = await storage.createFile(
            appwriteConfig.bucketId,
            ID.unique(),
            inputFile
        );

        const fileDocument = {
            type: getFileType(bucketFile.name).type,
            name: bucketFile.name,
            url: constructFileUrl(bucketFile.$id),
            extension: getFileType(bucketFile.name).extension,
            size: bucketFile.sizeOriginal,
            owner: ownerId,
            accountId,
            users: [],
            bucketFileId: bucketFile.$id,
        };

        const newFile = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.filesTableId,
            ID.unique(),
            fileDocument
        )

        revalidatePath(path);

        return {
            success: true,
            data: parseStringify(newFile),
        };

    } catch (error) {
        console.error("Upload error:", error);

        if (bucketFile) {
            try {
                await storage.deleteFile(appwriteConfig.bucketId, bucketFile.$id);
            } catch (cleanupError) {
                console.error("Rollback failed:", cleanupError);
            }
        }

        return {
            success: false,
            message: "Failed to upload file",
        };
    }
};

const createQueries = (currentUser: UserDocument) => {
    const queries = [
        Query.or([
            Query.equal("owner", [currentUser.$id]),
            Query.contains("users", [currentUser.email]),
        ]),

        Query.select([
            "*",
            "owner.fullName",
            "owner.email",
            "owner.avatar",
        ]),
    ];

    //ADD: search, sort, limits later

    return queries;
}

export const getFiles = async () => {
    const { databases } = await createAdminClient();

    try {
        const currentUser: UserDocument | null = await getCurrentUser();

        if (!currentUser) throw new Error("User not found");

        const queries = createQueries(currentUser);

        const files = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.filesTableId,
            queries,
        );

        // console.log({ files });

        return parseStringify(files);
        
    } catch (error) {
        handleError(error, "Failed to get files");
    }
};
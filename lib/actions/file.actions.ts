"use server"

import { createAdminClient } from "../appwrite";
import { InputFile } from "node-appwrite/file";
import { appwriteConfig } from "../appwrite/config";
import { ID } from "node-appwrite";
import { constructFileUrl, getFileType, parseStringify } from "../utils";
import { revalidatePath } from "next/cache";

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
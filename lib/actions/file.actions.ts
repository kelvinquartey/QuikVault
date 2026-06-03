"use server"

import { createAdminClient, createSessionClient } from "../appwrite";
import { InputFile } from "node-appwrite/file";
import { appwriteConfig } from "../appwrite/config";
import { ID, Models, Query } from "node-appwrite";
import { constructFileUrl, getFileType, parseStringify } from "../utils";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "./user.actions";
import { success } from "zod";


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

const createQueries = (
    currentUser: UserDocument,
    types: string[],
    searchText: string,
    sort: string,
    limit?: number,
    fileId?: string,
) => {
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

    if (types.length > 0) queries.push(Query.equal("type", types));

    if (fileId) {
        queries.push(Query.equal("$id", fileId));
    } else if (searchText) {
        queries.push(Query.contains("name", searchText));
    }

    if (limit) queries.push(Query.limit(limit));


    if (sort) {
        const lastHyphenIndex = sort.lastIndexOf("-");

        const sortBy = sort.slice(0, lastHyphenIndex);
        const orderBy = sort.slice(lastHyphenIndex + 1);

        const allowedSortFields = ["name", "size", "$createdAt"];
        const allowedOrders = ["asc", "desc"];

        if (
            allowedSortFields.includes(sortBy) &&
            allowedOrders.includes(orderBy)
        ) {
            queries.push(
                orderBy === "asc"
                    ? Query.orderAsc(sortBy)
                    : Query.orderDesc(sortBy),
            );
        }
    }

    return queries;
}

export const getFiles = async ({ 
    types = [],
    searchText = "",
    sort = "$createdAt-desc",
    limit,
    fileId,
}: GetFilesProps) => {
    const { databases } = await createAdminClient();

    try {
        const currentUser: UserDocument | null = await getCurrentUser();

        if (!currentUser) throw new Error("User not found");

        const queries = createQueries(currentUser, types, searchText, sort, limit, fileId,);

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

export const renameFile = async ({
    fileId,
    name,
    extension,
    path,
}: RenameFileProps) => {
    const { databases } = await createAdminClient();

    try {
        const trimmedName = name.trim();

        if (!trimmedName) {
            return { success: false, message: "File name cannot be empty" };
        }

        const baseName = trimmedName.endsWith(`.${extension}`)
            ? trimmedName.slice(0, -(extension.length + 1))
            : trimmedName;
            
        const newName = `${baseName}.${extension}`;
        const updatedFile = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.filesTableId,
            fileId,
            {
                name: newName,
            },
        );

        revalidatePath(path);
        return parseStringify({ 
            success: true, 
            ...updatedFile, 
        });
    } catch (error) {
        console.error("Rename error:", error);
        return { 
            success: false, 
            message: "Failed to rename file" 
        };
    }
};

export const updateFileUsers = async ({
    fileId,
    emails,
    path,
}: UpdateFileUsersProps) => {
  const { databases } = await createAdminClient();

  try {
    const file = await databases.getDocument(
        appwriteConfig.databaseId,
        appwriteConfig.filesTableId,
        fileId
    );

    const currentUsers = file.users || [];

    const sanitizedEmails = [
        ...new Set(
            emails.map((email) => email.trim().toLowerCase())
        ),
    ];

    const hasChanges =
        sanitizedEmails.length !== currentUsers.length ||
        sanitizedEmails.some(
            (email: string) => !currentUsers.includes(email)
        )
    ;

    if (!hasChanges) {
      return {
        success: false,
        message: "No changes made",
      };
    }

    const updatedFile = await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.filesTableId,
        fileId,
        {
        users: sanitizedEmails,
        }
    );

    revalidatePath(path);

    return parseStringify({
        success: true,
        ...updatedFile,
    });
  } catch (error) {
    console.error("Update users error:", error);

    return {
      success: false,
      message: "Failed to update users",
    };
  }
};

export const deleteFile = async ({
    fileId,
    bucketFileId,
    path,
}: DeleteFileProps) => {
    const { databases, storage } = await createAdminClient();

    try {
        await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.filesTableId,
            fileId
        );

        try {
            await storage.deleteFile(
                appwriteConfig.bucketId,
                bucketFileId
            );
        } catch (storageError) {
            console.error(
                "Storage deletion failed (orphan file):",
                storageError
            );
        }

        revalidatePath(path);

        return parseStringify({
            success: true,
            message: "File deleted successfully",
        });
    } catch (error) {
        console.error("Main deletion error:", error);

        return {
            success: false,
            message: "Failed to delete file",
        };
    }
};

export async function getTotalSpaceUsed() {
  try {
    const { databases } = await createSessionClient();

    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return null;
    }

    const files = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.filesTableId,
        [
            Query.equal("owner", [currentUser.$id]),
            Query.limit(1000),
        ]
    );

    const totalSpace = {
        image: { size: 0, latestDate: "" },
        document: { size: 0, latestDate: "" },
        video: { size: 0, latestDate: "" },
        audio: { size: 0, latestDate: "" },
        other: { size: 0, latestDate: "" },

        used: 0,

        all: 2 * 1024 * 1024 * 1024, // 2GB
    };

    files.documents.forEach((file) => {
        const fileType = file.type as FileType;

        const category =
        ["image", "document", "video", "audio", "other"].includes(fileType)
            ? fileType
            : "other";

        totalSpace[category].size += file.size;
        totalSpace.used += file.size;

        if (
            !totalSpace[category].latestDate ||
            new Date(file.$updatedAt) >
            new Date(totalSpace[category].latestDate)
        ) {
            totalSpace[category].latestDate = file.$updatedAt;
        }
    });

    return parseStringify(totalSpace);

  } catch (error) {
    console.error("Error calculating total space used:", error);

    return null;
  }
}
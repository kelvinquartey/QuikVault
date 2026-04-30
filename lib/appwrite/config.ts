export const appwriteConfig = {
    endpointUrl: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!,
    projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!,
    databaseId: process.env.APPWRITE_DATABASE!,
    filesTableId: process.env.APPWRITE_FILES_TABLE!,
    userTableId: process.env.APPWRITE_USERS_TABLE!,
    bucketId :process.env.APPWRITE_BUCKET!,
    secretKey: process.env.APPWRITE_SECRET!,
}
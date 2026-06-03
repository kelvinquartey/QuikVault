"use server";

import { Client, Account, Databases, Storage, Avatars, Users } from "node-appwrite"
import { appwriteConfig } from "./config";
import { cookies } from "next/headers";

export const createSessionClient = async () => {
    const client = new Client()
        .setEndpoint(appwriteConfig.endpointUrl)
        .setProject(appwriteConfig.projectId);

    const sessionCookie = (await cookies()).get("appwrite-session");

    const hasSession = !!sessionCookie?.value;

    if (hasSession) {
        client.setSession(
            sessionCookie.value
        );
    }

    return {
        get account() { 
            return new Account(client); 
        },
        get databases() { 
            return new Databases(client); 
        },
        get storage() {
            return new Storage(client);
        },
        hasSession,
    };
}

export const createAdminClient = async () => {
    const client = new Client()
        .setEndpoint(appwriteConfig.endpointUrl)
        .setProject(appwriteConfig.projectId)
        .setKey(appwriteConfig.secretKey);

    return {
        get account() { 
            return new Account(client); 
        },
        get databases() { 
            return new Databases(client); 
        },
        get storage() { 
            return new Storage(client); 
        },
        get avatars() { 
            return new Avatars(client); 
        },
        get users() {
            return new Users(client);
        }
    };
}
import { appwriteConfig } from "@/lib/appwrite/config";

interface GetAvatarUrlProps {
    avatar?: unknown;
    fullName?: string;
    email?: string;
}

export const getAvatarUrl = ({
    avatar,
    fullName,
    email,
}: GetAvatarUrlProps) => {

    if (
        typeof avatar === "string" &&
        (
        avatar.startsWith("http://") ||
        avatar.startsWith("https://")
        )
    ) {
        return avatar;
    }

    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
        fullName || email || "User"
    )}&background=2563eb&color=fff`;
};
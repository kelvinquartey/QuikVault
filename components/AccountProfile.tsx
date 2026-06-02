"use client"

import { signOutUser, updateUserFullName, updateUserAvatar, deleteUserAvatar } from "@/lib/actions/user.actions";
import { getAvatarUrl } from "@/lib/getAvatar";
import Image from "next/image";
import { useState, useTransition, ChangeEvent, useRef  } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";


interface AccountProfileProps {
    fullName: string;
    email: string;
    avatar: string;
}

const AccountProfile = ({
    fullName,
    email,
    avatar,
}: AccountProfileProps) => {
    const router = useRouter();

    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(fullName);
    const [error, setError] = useState("");

    const [isPending, startTransition] = useTransition();

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const safeInitialAvatarValue =
        typeof avatar === "string" &&
        (avatar.startsWith("http://") || avatar.startsWith("https://"))
            ? avatar
            : "";

    const [hasCustomAvatar, setHasCustomAvatar] = useState(safeInitialAvatarValue !== "");

    const initialAvatar = getAvatarUrl({
        avatar: safeInitialAvatarValue,
        fullName,
        email,
    });

    const [avatarUrl, setAvatarUrl] = useState(initialAvatar);
    const [isUploadingAvatar, startAvatarUpload] = useTransition();

    const handleSave = () => {
        setError("");

        startTransition(async () => {
            const response = await updateUserFullName(name);

            if (!response.success) {
                setError(response.message);
                return;
            }

            toast.success(
                <p className="body-2 flex items-center gap-2">
                    Full name updated successfully.
                </p>
            )
            setIsEditing(false);
        });
    };

    const handleAvatarChange = async (
        e: ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];

        if (!file) return;

        startAvatarUpload(async () => {
            const response = await updateUserAvatar(file);

            if (!response.success) {
                toast.error(
                    <p className="body-2">
                        {response.message || "Failed to update avatar"}
                    </p>
                );
                return;
            }

            const incomingAvatar = response.avatar;
            const safeUploadedAvatarValue =
                typeof incomingAvatar === "string" &&
                (incomingAvatar.startsWith("http://") || incomingAvatar.startsWith("https://"))
                    ? incomingAvatar
                    : "";

            const updatedAvatarUrl = getAvatarUrl({
                avatar: safeUploadedAvatarValue,
                fullName,
                email,
            });

            setAvatarUrl(updatedAvatarUrl);
            setHasCustomAvatar(true);

            toast.success(
                <p className="body-2 flex items-center gap-2">
                    Avatar updated successfully.
                </p>
            );

            
            setTimeout(() => {
                router.refresh();
            }, 500);

            e.target.value = "";
        });
    };

    const handleDeleteAvatar = () => {
        startAvatarUpload(async () => {
            const response = await deleteUserAvatar();

            if (!response.success) {
                toast.error(
                    <p className="body-2">
                        {response.message || "Failed to delete avatar"}
                    </p>
                );
                return;
            }

            const fallbackAvatar = getAvatarUrl({
                avatar: "",
                fullName,
                email,
            });

            setAvatarUrl(fallbackAvatar);
            setHasCustomAvatar(false);

            toast.success(
                <p className="body-2 flex items-center gap-2">
                    Profile picture removed successfully.
                </p>
            );

            setTimeout(() => {
                router.refresh();
            }, 500);
        });
    };



    return(
        <>
            <div className="avatar-info">
                <div className="flex items-center gap-5">
                    <div className="relative">
                        <Dialog>
                            <DialogTrigger asChild>
                                <button
                                    type="button"
                                    className="cursor-pointer"
                                >
                                    <Image
                                        src={avatarUrl}
                                        alt={fullName}
                                        width={120}
                                        height={120}
                                        className="
                                            size-24 rounded-full object-cover
                                            border-4 border-white shadow-xl
                                            dark:border-[var(--card)]
                                            transition hover:scale-105
                                        "
                                    />
                                </button>
                            </DialogTrigger>

                            <DialogContent className="max-w-xl border-none bg-transparent shadow-none">
                                <div className="flex justify-center">
                                    <Image
                                        src={avatarUrl}
                                        alt={fullName}
                                        width={500}
                                        height={500}
                                        className="
                                            max-h-[80vh]
                                            w-auto
                                            rounded-xl
                                            object-contain
                                        "
                                    />
                                </div>
                            </DialogContent>
                        </Dialog>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button
                                    type="button"
                                    disabled={isUploadingAvatar}
                                    className="
                                        absolute bottom-0 right-0
                                        flex size-9 items-center justify-center
                                        rounded-full border-4 border-white
                                        bg-[var(--color-primary)]
                                        shadow-lg transition
                                        hover:scale-105
                                        disabled:cursor-not-allowed
                                        disabled:opacity-70
                                        dark:border-[var(--card)]
                                        cursor-pointer
                                    "
                                >
                                    {isUploadingAvatar ? (
                                        <Image
                                            src="/assets/icons/loader.svg"
                                            alt="Uploading"
                                            width={18}
                                            height={18}
                                            className="animate-spin invert"
                                        />
                                    ) : (
                                        <>
                                            <Image
                                                src="/assets/icons/camera.svg"
                                                alt="Avatar actions"
                                                width={18}
                                                height={18}
                                                className="invert block dark:hidden"
                                            />

                                            <Image
                                                src="/assets/icons/camera-dark.svg"
                                                alt="Avatar actions"
                                                width={18}
                                                height={18}
                                                className="invert hidden dark:block"
                                            />
                                        </>
                                    )}
                                </button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent
                                align="end"
                                className="
                                    w-48 rounded-xl border border-black/5
                                    bg-white p-1 shadow-xl
                                    dark:border-white/10
                                    dark:bg-[var(--card)]
                                "
                            >
                                <DropdownMenuItem
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={isUploadingAvatar}
                                    className="cursor-pointer hover:bg-[var(--color-primary)]/10 focus:bg-[var(--color-primary)]/10"
                                >
                                    Upload New Picture
                                </DropdownMenuItem>
                                
                                {hasCustomAvatar && (
                                    <>
                                        <DropdownMenuSeparator className="summary-separator" />
                                        <DropdownMenuItem
                                            onClick={handleDeleteAvatar}
                                            disabled={isUploadingAvatar}
                                            className="cursor-pointer hover:bg-[var(--color-primary)]/10 focus:bg-[var(--color-primary)]/10 text-red-500 focus:text-red-500"
                                        >
                                            Delete Profile Picture
                                        </DropdownMenuItem>
                                    </>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>



                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleAvatarChange}
                        />
                    </div>

                    <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        {name}
                    </h1>

                    <p className="mt-2 text-base text-[var(--color-light-100)] dark:text-[var(--color-light-200)]">
                        {email}
                    </p>
                    </div>
                </div>

                <form action={signOutUser}>
                    <button
                    type="submit"
                    className="account-signout"
                    >
                    <Image
                        src="/assets/icons/logout.svg"
                        alt="logout"
                        width={20}
                        height={20}
                    />

                    <span>Sign Out</span>
                    </button>
                </form>
            </div>

            <section className="account-information">
                <h2 className="mb-6 text-xl font-semibold">
                    Account Information
                </h2>

                <div className="space-y-5">
                    <div className="full-name">
                        <div className="mt-6">
                            <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">
                            Full Name
                            </label>

                            <input
                                type="text"
                                value={name}
                                disabled={!isEditing}
                                onChange={(e) => setName(e.target.value)}
                                className={`
                                    account-information-input 
                                    ${isEditing
                                        ? `
                                        border-[var(--color-primary)]
                                        bg-white
                                        dark:border-[var(--color-primary)]
                                        `
                                        : `
                                        border-black/5 bg-white opacity-80
                                        dark:border-white/10
                                        `
                                    }
                                `}
                            />
                            {error && (
                                <p className="mt-2 text-sm text-red-500">
                                {error}
                                </p>
                            )}

                        </div>

                        <div className="mt-5 flex justify-end gap-3">
                            {!isEditing ? (
                                <button 
                                    type="button"
                                    onClick={() => {
                                        setError("");
                                        setIsEditing(true);                                        
                                    }}
                                    className="account-information-edit" 
                                >
                                    Edit
                                </button>

                            ): (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setName(fullName);
                                            setIsEditing(false);
                                        }}
                                        className="account-information-edit"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleSave}
                                        disabled={
                                            isPending ||
                                            name.trim() === fullName.trim()
                                        }
                                        className="account-information-save"
                                    >
                                        {isPending ? 
                                            <Image
                                                src="/assets/icons/loader.svg"
                                                alt="Uploading"
                                                width={18}
                                                height={18}
                                                className="animate-spin invert"
                                            /> 
                                        : "Save"}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="email">
                            <label className="text-sm font-medium text-[var(--foreground)]">
                                Email Address
                            </label>

                            <input
                                type="email"
                                value={email}
                                disabled
                                className="account-information-input border-black/5 bg-white opacity-80 dark:border-white/10"
                            />
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default AccountProfile;
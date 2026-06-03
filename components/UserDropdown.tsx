"use client";

import Image from "next/image";
import Link from "next/link";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { signOutUser } from "@/lib/actions/user.actions";
import { getAvatarUrl } from "@/lib/getAvatar";

interface UserDropdownProps {
    fullName: string;
    email: string;
    avatar?: string;
}

const UserDropdown = ({
    fullName = "",
    email = "",
    avatar = "",
}: UserDropdownProps) => {

    const safeAvatarValue =
        typeof avatar === "string" &&
        (avatar.startsWith("http://") || avatar.startsWith("https://"))
            ? avatar
            : "";

    const safeAvatar = getAvatarUrl({
        avatar: safeAvatarValue,
        fullName,
        email,
    });
    
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    className="
                        flex items-center justify-center
                        rounded-full
                        outline-none
                        ring-0
                        cursor-pointer
                        transition
                        hover:scale-[1.03]
                    "
                >
                <Image
                    src={safeAvatar}
                    alt={fullName}
                    width={100}
                    height={100}
                    className="
                    size-10 sm:size-12 lg:size-13 
                    rounded-full object-cover
                    border border-black/70
                    dark:border-white/70
                    "
                />
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                className="
                w-64 rounded-2xl border border-black/5
                bg-white p-2 shadow-xl
                dark:border-white/10
                dark:bg-[var(--card)]
                "
            >
                <div className="px-3 py-2">
                    <p className="truncate text-sm font-semibold text-[var(--foreground)]">
                        {fullName}
                    </p>

                    <p className="truncate text-xs text-[var(--color-light-100)] dark:text-[var(--color-light-200)]">
                        {email}
                    </p>
                </div>

                <DropdownMenuSeparator className="summary-separator"  />

                <DropdownMenuItem asChild>
                    <Link
                        href="/account"
                        className="
                            cursor-pointer rounded-xl px-2 py-2
                            focus:bg-[var(--color-primary)]/10
                            hover:bg-[var(--color-primary)]/10
                            flex h-auto w-full justify-between rounded-xl
                        "
                    >
                        <span className="text-sm font-medium">Account</span>

                        <Image
                            src="/assets/icons/account.svg"
                            alt="logout"
                            width={20}
                            height={20}
                            className="block dark:hidden"
                        />
                        <Image
                            src="/assets/icons/account-dark.svg"
                            alt="logout"
                            width={20}
                            height={20}
                            className="hidden dark:block"
                        />
                    </Link>
                </DropdownMenuItem>

                
                    <form action={signOutUser} 
                        className="
                            w-full cursor-pointer rounded-xl px-2 py-2
                            focus:bg-[var(--color-primary)]/10
                            hover:bg-[var(--color-primary)]/10
                        "
                    >
                        <button
                            type="submit"
                            className="flex h-auto w-full justify-between rounded-xl text-red-500 cursor-pointer"
                        >
                            <span className="text-sm font-medium">
                                Sign Out
                            </span>

                            <Image
                                src="/assets/icons/logout.svg"
                                alt="logout"
                                width={20}
                                height={20}
                            />
                        </button>
                    </form>
                
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default UserDropdown;
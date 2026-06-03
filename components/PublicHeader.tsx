"use client";

import Link from "next/link";
import { SidebarLogo } from "@/components/SidebarLogo";
import { usePathname } from "next/navigation";

export default function PublicHeader({
    isLoggedIn,
}: {
    isLoggedIn: boolean;
}) {
    const pathname = usePathname();

    const homeLink = isLoggedIn ? "/" : "/sign-in";

    return (
        <header
            className="
                sticky top-0 z-50
                border-b border-black/5
                bg-[var(--background)]/80
                backdrop-blur-xl
                dark:border-white/10
            "
        >
            <div className="container flex h-[72px] items-center justify-between">
                <Link href={homeLink}>
                    <SidebarLogo />
                </Link>

                <nav className="flex items-center gap-6 mr-4">
                    {pathname !== "/about" && (
                        <Link
                            href="/about"
                            className="public-link"
                        >
                            About
                        </Link>
                    )}

                    {pathname !== "/terms" && (
                        <Link
                            href="/terms"
                            className="public-link"
                        >
                            Terms
                        </Link>
                    )}
                </nav>
            </div>
        </header>
    );
}
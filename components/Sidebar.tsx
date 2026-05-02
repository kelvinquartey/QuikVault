"use client"

import Link from "next/link"
import { SidebarLogo } from "./SidebarLogo"
import { navItems } from "@/constants"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { cn } from "@/lib/utils"


const Sidebar = ({ user }: { user: any }) => {
    const fullName = user?.fullName || "";
    const email = user?.email || "";
    const avatar = user?.avatar || "/assets/images/avatar.png";

    const pathname = usePathname();

    return (
        <aside className="sidebar remove-scrollbar">
            <Link href="/">
                <SidebarLogo />
            </Link>

            <nav className="sidebar-nav">
                <ul className="flex flex-1 flex-col gap-6">
                    {navItems.map(({url, name, icon}) => (
                        <Link href={url} key={name} className="lg:w-full">
                            <li 
                                className={cn(
                                    "sidebar-nav-item", 
                                    pathname === url &&'shad-active'
                                )}
                            >
                                <Image src={icon} alt={name} width={24} height={24} className={cn(
                                    "w-6 invert opacity-25 transition-all", 
                                    "dark:invert-0 dark:opacity-100",
                                    pathname === url && "invert-0 opacity-100"
                                )} />
                                <p className="hidden lg:block">{name}</p>
                            </li>
                        </Link>
                    ))}
                </ul>
            </nav>

            <Image 
                src="/assets/images/files.png" 
                alt="files"
                width={506} 
                height={418}
                className="w-full"
            />

            <div className="sidebar-user-info">
                <Image 
                    src={avatar}  
                    alt="files"
                    width={44} 
                    height={44}
                    className="sidebar-user-avatar"
                />  

                <div className="hidden lg:block">
                    <p className="subtitle-2 capitalize">{fullName}</p>
                    <p className="caption">{email}</p>
                </div>  
            </div>
        </aside>
  )
}

export default Sidebar
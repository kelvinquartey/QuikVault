"use client"

import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { MobileLogo } from "./MobileLogo"
import { useState } from "react"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { navItems } from "@/constants"
import Link from "next/link"
import { cn } from "@/lib/utils"
import FileUploader from "./FileUploader"
import { Button } from "./ui/button"
import { signOutUser } from "@/lib/actions/user.actions"
import UserDropdown from "./UserDropdown"
import { getAvatarUrl } from "@/lib/getAvatar"
import { SidebarLogo } from "./SidebarLogo"
import { Logo } from "./logo"

interface Props {
  $id: string,
  accountId: string,
  fullName: string,
  avatar: string,
  email: string,
}


const AccountHeader = () => {

    const [open, setOpen] = useState(false)
    const pathname = usePathname();

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
                <Link href="/">
                    <MobileLogo />
                </Link>


        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            className="sidebar-trigger"
          >
            <Image 
              src="/assets/icons/menu.svg" 
              alt="search"
              width={30}
              height={30}
              className="dark:invert"
            />
          </SheetTrigger>
          <SheetContent className="pt-0 h-screen overflow-y-auto px-3 pt-9 bg-[var(--card)]">
            <SheetTitle className="sr-only">
                Account Navigation Menu
            </SheetTitle>
            <nav className="mobile-nav h5">
              <ul className="mobile-nav-list">
                {navItems.map(({url, name, icon}) => (
                  <Link href={url} key={name} className="lg:w-full">
                    <li 
                      className={cn(
                        "h5 mobile-nav-item", 
                        pathname === url &&'shad-active'
                      )}
                    >
                      <Image src={icon} alt={name} width={24} height={24} className={cn(
                        "w-6 invert opacity-25 transition-all", 
                        "dark:invert-0 dark:opacity-100",
                        pathname === url && "invert-0 opacity-100"
                      )} />
                      <p>{name}</p>
                    </li>
                  </Link>
                ))}
              </ul>
            </nav>

            <Separator className="my-5 bg-[var(--color-light-200)]/20"/>

          </SheetContent>
        </Sheet>


            </div>
        </header>
    );
}

export default AccountHeader;
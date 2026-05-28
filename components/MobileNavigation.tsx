"use client"

import {
  Sheet,
  SheetClose,
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

interface Props {
  $id: string,
  accountId: string,
  fullName: string,
  avatar: string,
  email: string,
}


const MobileNavigation = ({
  $id: ownerId,
  accountId,
  fullName,
  avatar,
  email, 
}: Props) => {

  const [open, setOpen] = useState(false)
  const pathname = usePathname();

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await signOutUser();
  };


  return (
    <header className="mobile-header">
      <MobileLogo />
      <section className="flex gap-7">
        <UserDropdown 
          fullName={fullName}
          email={email}
          avatar={avatar}
        />
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger>
            <Image 
              src="/assets/icons/menu.svg" 
              alt="search"
              width={30}
              height={30}
              className=""
            />
          </SheetTrigger>
          <SheetContent className="pt-0 h-screen overflow-y-auto px-3 bg-[var(--card)]">
            <SheetTitle>
              <div className="header-user">
                <Image 
                  src={avatar} 
                  alt="avatar" 
                  width={44} 
                  height={44} 
                  className="header-user-avatar"
                />
                <div className="sm:hidden lg:block">
                  <p className="subtitle-2 capitalize">{fullName}</p>
                  <p className="caption">{email}</p>
                </div>
              </div>
            <Separator className="mb-4 bg-[var(--color-light-200)]/20"/>
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

            <div className="flex flex-col justify-between gap-5 pb-5">
              <FileUploader 
                ownerId={ownerId}
                accountId={accountId}
              />

              <Button 
                type="submit"
                className="h5 mobile-sign-out-button"
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                <Image 
                  src={isLoggingOut ? "/assets/icons/loader.svg" : "/assets/icons/logout.svg"}
                  alt="logout"
                  width={24}
                  height={24}
                  className={isLoggingOut ? "animate-spin" : ""}
                />
                <p>{isLoggingOut ? "Logging out..." : "Logout"}</p>
              </Button>
            </div>

          </SheetContent>
        </Sheet>
      </section>
    </header>
  )
}

export default MobileNavigation
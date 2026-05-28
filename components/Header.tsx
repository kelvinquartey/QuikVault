"use client"

import { Button } from './ui/button'
import Image from 'next/image'
import Search from './Search'
import FileUploader from './FileUploader'
import { signOutUser } from '@/lib/actions/user.actions'
import { useFormStatus } from "react-dom";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import UserDropdown from './UserDropdown'

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            type="submit"
            className="sign-out-button"
            disabled={pending}
          >
            <Image 
              src="/assets/icons/logout.svg" 
              alt="logout"
              width={24}
              height={24}
              className="w-6 ml-0.5"
            />

            {pending && (
              <Image 
                src="/assets/icons/loader.svg" 
                alt="loading"
                width={24}
                height={24}
                className="animate-spin mr-2"
              />
            )}
          </Button>
        </TooltipTrigger>

        <TooltipContent side="bottom" className="bg-[var(--card)] text-[var(--color-light-100)] border border-[var(--color-light-200)]">
          <p>{pending ? "Signing out..." : "Sign out"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

const Header = ({
  userId, 
  accountId,
  fullName,
  email,
  avatar
}: {
  userId: string;
  accountId: string;
  fullName: string;
  email: string;
  avatar?: string;
}) => {

  return (
    <header className="header">
        <Search />

        <div className="header-wrapper flex-center gap-3">
            <FileUploader 
              ownerId={userId}
              accountId={accountId}
            />

            <UserDropdown
              fullName={fullName}
              email={email}
              avatar={avatar}
            />
        </div>
    </header>
  )
}

export default Header
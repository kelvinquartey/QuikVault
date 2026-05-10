"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState } from "react"
import Image from "next/image"
import { actionsDropdownItems } from "@/constants"
import Link from "next/link"
import { constructDownloadUrl } from "@/lib/utils"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const ActionDropdown = ({file}: {file:FileDocument}) => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [action, setAction] = useState<ActionType | null>(null);
    const [name, setName] = useState(file.name);
    const [isLoading, setIsLoading] = useState(false);

    const closeAllModals = () => {
        setIsModalOpen(false);
        setIsDropdownOpen(false);
        setAction(null);

    }

    const handleAction = async () => {}

    const renderDialogContent = () => {
        if (!action) return null;

        const { value, label } = action;

        return (
            <DialogContent aria-describedby="" className="shad-dialog">
                <DialogHeader className="flex flex-col gap-3">
                <DialogTitle className="text-center text-[var(--color-light-100)]">
                    {label}
                </DialogTitle>
                {value === "rename" && (
                    <Input 
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        
                    />
                )}
                </DialogHeader>
                {["rename", "delete", "share"].includes(value) && (
                    <DialogFooter className="flex flex-col gap-3 md:flex-row">
                        <Button onClick={closeAllModals} className="modal-cancel-button">
                            Cancel
                        </Button>
                        <Button onClick={handleAction} className="primary-btn modal-submit-button">
                            <p className="capitalize">{value}</p>
                        </Button>
                        {isLoading && (
                            <Image 
                                src="/assets/icons/loader.svg"
                                alt="loader"
                                width={24}
                                height={24}
                                className="animate-spin"
                            />
                        )}
                    </DialogFooter>
                )}
            </DialogContent>
        )
    }


  return (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
                <DropdownMenuTrigger className="shad-no-focus rounded-full p-1 transition hover:bg-black/5 dark:hover:bg-white/5" asChild>
                    <Image 
                        src="/assets/icons/dots.svg"
                        alt="dots"
                        width={34}
                        height={34}
                    />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    className="bg-[var(--card)]"
                
                >
                    <DropdownMenuGroup>
                    <DropdownMenuLabel className="max-w-[200px] truncate text-[var(--foreground)]">
                        {file.name}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {actionsDropdownItems.map((actionItem) => (
                        <DropdownMenuItem 
                            key={actionItem.value}
                            className="shad-dropdown-item "
                            onClick={() => {
                                setAction(actionItem);

                                if (
                                    [   "rename",
                                        "share",
                                        "delete",
                                        "details"
                                    ].includes (
                                        actionItem.value
                                    )
                                ) {
                                    setIsModalOpen(true)
                                }
                            }}
                        >
                            {actionItem.value === "download" ? (
                                <Link 
                                    href={constructDownloadUrl(file.bucketFileId)}
                                    download={file.name}
                                    className="flex items-center gap-2"
                                >
                                    <Image 
                                        src={actionItem.icon}
                                        alt={actionItem.label}
                                        width={30}
                                        height={30}
                                    />
                                    {actionItem.label}
                                </Link>
                            ): (
                                <div className="flex items-center gap-2">
                                    <Image 
                                        src={actionItem.icon}
                                        alt={actionItem.label}
                                        width={30}
                                        height={30}
                                    />
                                    {actionItem.label}
                                </div>
                            )}
                        </DropdownMenuItem>
                    ))}
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>

            {renderDialogContent()}
        </Dialog>
  )
}

export default ActionDropdown
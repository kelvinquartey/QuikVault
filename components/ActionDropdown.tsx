"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { useEffect, useState } from "react"
import Image from "next/image"
import { actionsDropdownItems } from "@/constants"
import Link from "next/link"
import { constructDownloadUrl } from "@/lib/utils"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { deleteFile, renameFile, updateFileUsers } from "@/lib/actions/file.actions"
import { usePathname } from "next/navigation"
import { toast } from "sonner"
import { FileDetails, ShareInput } from "./ActionsModalContent"

const ActionDropdown = ({file}: {file:FileDocument}) => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [action, setAction] = useState<ActionType | null>(null);
    const [name, setName] = useState(file.name);
    const [isLoading, setIsLoading] = useState(false);
    const [emails, setEmails] = useState<string[]>([]);
    const [emailInput, setEmailInput] = useState("");

    const handleAddEmail = () => {
        const trimmedEmail = emailInput.trim().toLowerCase();

        if (!trimmedEmail) return;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(trimmedEmail)) {
            toast.error(
                <p className="body-2">
                    Please enter a valid email
                </p>
            );
            return;
        }

        const alreadyExists =
            emails.includes(trimmedEmail) ||
            file.users.includes(trimmedEmail);

        if (alreadyExists) {
            toast.error(
                <p className="body-2">
                    User already added
                </p>
            );
            return;
        }

        setEmails((prev) => [...prev, trimmedEmail]);
        setEmailInput("");
    };

    const handleRemovePendingEmail = (email: string) => {
        setEmails((prev) =>
            prev.filter((e) => e !== email)
        );
    };

    const path = usePathname();

    useEffect(() => {
        setName(file.name);
    }, [file.name]);

    const closeAllModals = () => {
        setIsModalOpen(false);
        setIsDropdownOpen(false);
        setAction(null);

    }

    const handleAction = async () => {
        if (!action) return;

        setIsLoading(true);

        try {
            const actions = {
                rename: () =>
                    renameFile({
                        fileId: file.$id,
                        name,
                        extension: file.extension,
                        path,
                    }),
                share: () => 
                    updateFileUsers({
                        fileId: file.$id,
                        emails: [...file.users, ...emails],
                        path,
                    }),
                delete: () => 
                    deleteFile({
                        fileId: file.$id,
                        bucketFileId: file.bucketFileId,
                        path,
                    })
            };

            const actionFunction =  actions[action.value as keyof typeof actions];

            if (!actionFunction) return;

            const res = await actionFunction();

            if (res?.success) {
                setEmails([]);
                setEmailInput("");
                closeAllModals();

                toast.success(
                    <p className="body-2 flex items-center gap-2">
                        {action.value === "delete" ? (
                            <span>
                                <strong>{file.name}</strong> successfully deleted
                            </span>
                        ) : (
                            <span>
                                <strong>{action.label}</strong> successful!
                            </span>
                        )}
                    </p>
                );
            } else {
                toast.error(
                    <p className="body-2">
                        {res?.message || (
                        <span className="font-semibold">
                            Failed to {action.value}
                        </span>
                        )}
                    </p>
                );
            }
        } catch (error) {
            console.error(error);

            toast.error(
                <p className="body-2">Something went wrong</p>
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemoveUser = async (email: string) => {
        const updatedUsers = file.users.filter(
            (userEmail: string) => userEmail !== email
        );

        try {
            const res = await updateFileUsers({
                fileId: file.$id,
                emails: updatedUsers,
                path,
            });

            if (res?.success) {
            toast.success(
                <p className="body-2">
                {email} removed successfully
                </p>
            );
            } else {
            toast.error(
                <p className="body-2">
                    {res?.message || "Could not remove user"}
                </p>
            );
            }
        } catch (error) {
            console.error("Remove user error:", error);

            toast.error(
                <p className="body-2">
                    An unexpected error occurred
                </p>
            );
        }
    };

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
                        className="text-[16px]"
                    />
                )}
                {value === "details" && <FileDetails file={file} />}
                {value === "share" && (
                    <ShareInput 
                        file={file}
                        emailInput={emailInput}
                        emails={emails}
                        onInputChange={setEmailInput}
                        onRemove={handleRemoveUser}
                        handleAddEmail={handleAddEmail}
                        handleRemovePendingEmail={handleRemovePendingEmail}
                    />
                )}
                {value === "delete" && (
                    <p className="delete-confirmation">
                        Are you sure you want to delete{` `}
                        <span className="delete-file-name">{file.name}</span>?
                    </p>
                )}
                </DialogHeader>
                {["rename", "delete", "share"].includes(value) && (
                    <DialogFooter className="flex flex-row justify-center gap-3">
                        <Button onClick={closeAllModals} className="modal-cancel-button">
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleAction} 
                            disabled={
                                isLoading ||
                                (value === "rename" && !name.trim()) ||
                                (value === "share" && emails.length === 0)
                            } 
                            className="primary-btn modal-submit-button"
                        >
                            <p className="capitalize">{value}</p>
                            {isLoading && (
                                <Image 
                                    src="/assets/icons/loader.svg"
                                    alt="loader"
                                    width={24}
                                    height={24}
                                    className="animate-spin"
                                />
                            )}
                        </Button>
                    </DialogFooter>
                )}
            </DialogContent>
        )
    }


  return (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
                <DropdownMenuTrigger asChild>
                    <button className="shad-no-focus rounded-full p-1 transition hover:bg-black/5 dark:hover:bg-white/5">
                        <Image
                        src="/assets/icons/dots.svg"
                        alt="dots"
                        width={34}
                        height={34}
                        />
                    </button>
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
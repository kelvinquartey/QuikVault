import Thumbnail from './Thumbnail';
import FormattedDateTime from './FormattedDateTime';
import { convertFileSize, formatDateTime } from '@/lib/utils';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const ImageThumbnail = ({ file }: { file: FileDocument }) => (
    <div className="file-details-thumbnail">
        <Thumbnail type={file.type} extension={file.extension} url={file.url} />
        <div className="flex flex-col">
            <p className="subtitle-2 mb-1">{file.name}</p>
            <FormattedDateTime date={file.$createdAt} className="caption" />
        </div>
    </div>
);

const DetailRow = ({ label, value }: { label: string; value: string }) => (
    <div className="flex">
        <p className="file-details-label text-left">{label}</p>
        <p className="file-details-value text-left">{value}</p>
    </div>
);

export const FileDetails = ({ file}: {file: FileDocument}) => {
  return (
    <>
        <ImageThumbnail file={file}/>
        <div className="space-y-4 px-2 pt-2">
            <DetailRow label="Format:" value={file.extension} />
            <DetailRow label="Size:" value={convertFileSize(file.size)} />
            <DetailRow label="Owner:" value={file.owner.fullName} />
            <DetailRow label="Last edit:" value={formatDateTime(file.$updatedAt)} />
        </div>
    </>
  )
}

interface Props {
  file: FileDocument;
  emailInput: string;
  emails: string[];
  onInputChange: (value: string) => void;
  onRemove: (email: string) => void;
  handleAddEmail: () => void;
  handleRemovePendingEmail: (email: string) => void;
}

export const ShareInput = ({ 
  file,
  emailInput,
  emails,
  onInputChange,
  onRemove,
  handleAddEmail,
  handleRemovePendingEmail,
}: Props) => {
  return (
    <>
        <ImageThumbnail file={file} />

        <div className="share-wrapper">
            <p className="subtitle-2 pl-1 text-[var(--color-light-100)]">
                Share file with other users
            </p>
            <div className="relative">
                <Input 
                    type="email"
                    placeholder="Enter email address"
                    value={emailInput}
                    onChange={(e) => onInputChange(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddEmail();
                        }
                    }}
                    className="body-2 shad-no-focus share-input-field"
                />
                <button
                    type="button"
                    onClick={handleAddEmail}
                    className="absolute right-3 top-1/2 -translate-y-1/2 block dark:hidden opacity-70 hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                >
                    <Image
                        src="/assets/icons/add.svg"
                        alt="add"
                        width={22}
                        height={22}
                    />
                </button>
                <button
                    type="button"
                    onClick={handleAddEmail}
                    className="absolute right-3 top-1/2 -translate-y-1/2 hidden dark:block opacity-70 hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                >
                    <Image
                        src="/assets/icons/add-dark.svg"
                        alt="add"
                        width={30}
                        height={30}
                    />
                </button>
            </div>

            {emails.length > 0 && (
                <div className="mt-4 space-y-2">
                    <p className="subtitle-2 text-[var(--color-light-100)]">
                    Share with:
                    </p>

                    <div className="flex flex-wrap gap-2">
                    {emails.map((email) => (
                        <div
                        key={email}
                        className="flex items-center gap-2 rounded-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-3 py-1"
                        >
                        <p className="caption">{email}</p>

                        <button
                            type="button"
                            onClick={() => handleRemovePendingEmail(email)}
                            className="opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
                        >
                            ✕
                        </button>
                        </div>
                    ))}
                    </div>
                </div>
            )}

            <div className="pt-4">
                <div className="flex justify-between">
                    <p className="subtitle-2 text-[var(--color-light-100)]">Shared with</p>
                    <p className="subtitle-2 text-[var(--color-light-200)]">
                        {file.users.length} users
                    </p>
                </div>

                <ul className="pt-2">
                    {file.users.map((email: string) => (
                        <li
                            key={email}
                            className="flex items-center justify-between gap-2"
                        >
                            <p className="subtitle-2">{email}</p>
                            <Button 
                                onClick={() => onRemove(email)}
                                className="share-remove-user"
                            >
                                <Image
                                src="/assets/icons/remove.svg"
                                alt="Remove"
                                width={24}
                                height={24}
                                className="remove-icon block dark:hidden cursor-pointer opacity-70 hover:opacity-100 transition-opacity duration-200"
                                />
                                <Image
                                src="/assets/icons/remove-dark.svg"
                                alt="Remove"
                                width={24}
                                height={24}
                                className="remove-icon hidden dark:block cursor-pointer opacity-70 hover:opacity-100 transition-opacity duration-200"
                                />
                            </Button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    </>
  )
}


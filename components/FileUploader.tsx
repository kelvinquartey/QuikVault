"use client"

import React, {useCallback, useState} from 'react'
import {useDropzone} from 'react-dropzone'
import { Button } from './ui/button'
import { cn, convertFileToUrl, getFileType } from '@/lib/utils'
import Image from 'next/image'
import Thumbnail from './Thumbnail'
import { MAX_FILE_SIZE } from '@/constants'
import { toast } from "sonner"
import { uploadFile } from '@/lib/actions/file.actions'
import { usePathname } from 'next/navigation'

interface Props {
  ownerId: string;
  accountId: string;
  className?: string;
}

const FileUploader = ({ownerId, accountId, className}: Props) => {
  const path = usePathname()
  const [files, setFiles] = useState<File[]>([]);

  const [progress, setProgress] = useState<Record<string, number>>({});

  const simulateProgress = (fileName: string) => {
    let value = 0;

    const interval = setInterval(() => {
      value += Math.random() * 15;

      setProgress((prev) => ({
        ...prev,
        [fileName]: Math.min(value, 95),
      }));

      if (value >= 95) clearInterval(interval);
    }, 200);
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setFiles((prev) => [...prev, ...acceptedFiles]);

    const uploadPromises = acceptedFiles.map(async (file) => {
      if(file.size > MAX_FILE_SIZE){
        setFiles((prevFiles) => prevFiles.filter((f) => f !== file))

        toast.error(
          <p className="body-2">
            <span className="font-semibold">
              {file.name}
            </span> is too large. Max file size is 50MB.
          </p>
        );
        
        return
      }

      simulateProgress(file.name);

      try {
        const response = await uploadFile({file, ownerId, accountId, path,});

        if (!response?.success) {
          throw new Error(response?.message || "Upload failed");
        }
       
        setProgress((prev) => ({
          ...prev,
          [file.name]: 100,
        }));

        setTimeout(() => {
          toast.success(
            <p className="body-2 flex items-center gap-2">
              <span>Uploaded <strong>{file.name}</strong></span>
            </p>
          );
        }, 200);
        
        setTimeout(() => {
          setFiles((prev) => prev.filter((f) => f !== file));

          setProgress((prev) => {
            const copy = { ...prev };
            delete copy[file.name];
            return copy;
          });
        }, 500);

      } catch (error) {
        console.error("Upload failed:", error);

        setFiles((prev) => prev.filter((f) => f !== file));

        toast.error(
          <p className="body-2">
            Failed to upload <span className="font-semibold">{file.name}</span>
          </p>
        );
      }
    });

    await Promise.all(uploadPromises)
  }, [ownerId, accountId, path])

  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  const handleRemoveFile = (e: React.MouseEvent<HTMLImageElement, MouseEvent>, filename: string) => {
    e.stopPropagation();
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== filename));

    setProgress((prev) => {
      const copy = { ...prev };
      delete copy[filename];
      return copy;
    });
  }

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <Button type="button" className={cn("uploader-button primary-btn", className)}>
        <Image 
          src="/assets/icons/upload.svg" 
          alt="upload"
          width={24}
          height={24}
        />
        <p>Upload</p>
      </Button>
      {files.length > 0 && <ul className="uploader-preview-list">
        <h4 className="h4 text-[var(--color-light-100)]">Uploading</h4>

        {files.map((file, index) => {
          const {type, extension} = getFileType(file.name);
          const fileProgress = progress[file.name] || 0;

          return(
            <li key={`${file.name}-${index}`} className="uploader-preview-item">
              <div className="flex items-center gap-3">
                <Thumbnail 
                  type={type}
                  extension={extension}
                  url={convertFileToUrl(file)}
                />

                <div className="preview-item-name">
                  {file.name}

                  <div className="w-full h-1.5 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden mt-1">
                    <div
                      className="h-full bg-[var(--color-primary)] transition-all duration-300 ease-out"
                      style={{ width: `${fileProgress}%` }}
                    />
                  </div>
                </div>
              </div>

              <Image
                src="/assets/icons/remove.svg"
                width={24}
                height={24}
                alt="remove"
                onClick={(e) => handleRemoveFile(e, file.name)}
                className="block dark:hidden cursor-pointer opacity-70 hover:opacity-100 transition-opacity duration-200"
              />
              <Image
                src="/assets/icons/remove-dark.svg"
                width={24}
                height={24}
                alt="remove"
                onClick={(e) => handleRemoveFile(e, file.name)}
                className="hidden dark:block cursor-pointer opacity-70 hover:opacity-100 transition-opacity duration-200"
              />
            </li>
          )
        })}
      </ul>}
    </div>
  )
}

export default FileUploader
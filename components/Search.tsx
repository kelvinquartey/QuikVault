"use client"

import Image from "next/image";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { getFiles } from "@/lib/actions/file.actions";
import { useDebounce } from "use-debounce";
import Thumbnail from "./Thumbnail";
import FormattedDateTime from "./FormattedDateTime";

const Search = () => {
  const [query, setQuery] = useState("");
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("query") || "";
  const [results, setResults] = useState<FileDocument[]>([]);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const path = usePathname();
  const [debouncedQuery] = useDebounce(query, 300);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current && 
        !searchRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchFiles = async () => {
      const trimmedQuery = debouncedQuery.trim();

      if (trimmedQuery.length === 0) {
        setResults([]);
        setOpen(false);
        
        if (searchQuery) {
          router.push(path);
        }

        return;
      }

      setIsLoading(true);
      try {
        const files = await getFiles({
          types: [],
          searchText: trimmedQuery,
        });

        setResults(files?.documents || []);
        setOpen(true);
      } catch (error) {
        console.error("Search error:", error);

        setResults([]);
        setOpen(false);
      }finally {
        setIsLoading(false);
      }
    };

    fetchFiles();
  }, [debouncedQuery, router, path, searchQuery]);

  useEffect(() => {
    if (!searchQuery) {
      setQuery("");
    }
  }, [searchQuery]);

  const handleClickItem = (file: FileDocument) => {
    setOpen(false);
    setResults([]);
    setQuery("");
    

    const activeElement = document.activeElement as HTMLElement;
    activeElement?.blur();
    

    const typeRoute =
      file.type === "video" || file.type === "audio"
        ? "media"
        : `${file.type}s`;

    router.push(`/${typeRoute}?fileId=${file.$id}`);
    
  };


  return (
    <div className="search" ref={searchRef}>
      <div className="search-input-wrapper">
        <Image 
          src="/assets/icons/search.svg"
          alt="Search"
          width={24}
          height={24}
        />

        <Input 
          value={query}
          placeholder="Search..."
          className="shad-no-focus search-input"
          onChange={(e) => setQuery(e.target.value)}
        />


        {open && (
          <ul className="search-result">
            {isLoading ? (
              <>
                {[1, 2, 3].map((item) => (
                  <li
                    key={item}
                    className="flex items-center justify-between animate-pulse"
                  >
                    <div className="flex items-center gap-4">
                      <div className="size-9 rounded-lg bg-black/10 dark:bg-white/10" />

                      <div className="space-y-2">
                        <div className="h-3 w-32 rounded bg-black/10 dark:bg-white/10" />
                        <div className="h-2 w-20 rounded bg-black/10 dark:bg-white/10" />
                      </div>
                    </div>

                    <div className="h-2 w-16 rounded bg-black/10 dark:bg-white/10" />
                  </li>
                ))}
              </>
            ) : results.length > 0 ? (
              results.map((file) => (
                <li
                  className="flex items-center justify-between"
                  key={file.$id}
                  onClick={() => handleClickItem(file)}
                >
                  <div className="flex cursor-pointer items-center gap-4">
                    <Thumbnail
                      type={file.type}
                      extension={file.extension}
                      url={file.url}
                      className="size-9 min-w-9"
                    />
                    <p className="subtitle-2 line-clamp-1 text-light-100">
                      {file.name}
                    </p>
                  </div>

                  <FormattedDateTime
                    date={file.$createdAt}
                    className="caption line-clamp-1 text-light-200"
                  />
                </li>
              ))
            ) : (
              <p className="empty-result">No files found</p>
            )}
          </ul>
        )}

      </div>
    </div>
  )
}

export default Search
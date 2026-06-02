import Card from "@/components/Card";
import Sort from "@/components/Sort";
import { getFiles, getTotalSpaceUsed } from "@/lib/actions/file.actions";
import { convertFileSize, getFileTypesParams, getUsageSummary } from "@/lib/utils";

const page =  async({ searchParams,params }: SearchParamProps) => {
    const type = ((await params)?.type as string) || "";

    const types = getFileTypesParams(type) as FileType[];
    const searchText = ((await searchParams)?.query as string) || "";
    const fileId = ((await searchParams)?.fileId as string) || "";
    const sort = ((await searchParams)?.sort as string) || "";

    const files = await getFiles({ types, searchText, sort, fileId });
    const totalSpace = await getTotalSpaceUsed();

    const usageSummary = totalSpace
        ? getUsageSummary(totalSpace)
        : [];

    const currentCategory = usageSummary.find(
        (item) => item.url === `/${type}`
    );

    const totalUsed = currentCategory
        ? convertFileSize(currentCategory.size)
        : "0 Bytes";

  return (
    <div className="page-container">
        <section className="w-full">
            <h1 className="h1 capitalize">{type}</h1>

            <div className="total-size-section">
                <p className="body-1">
                    Total: <span className="h5">{totalUsed}</span>
                </p>

                <div className="sort-container">
                    <p className="body-1 hidden text-[var(--color-light-200)] sm:block">Sort by:</p>

                    <Sort />
                </div>
            </div>
        </section>

        {files.total > 0 ? (
            <section  className="file-list">
                {files.documents.map((file: FileDocument) => (
                    <Card key={file.$id} file={file}/>
                ))}
            </section>
        ): <p className="empty-list">No files uploaded</p>}
    </div>
  )
}

export default page
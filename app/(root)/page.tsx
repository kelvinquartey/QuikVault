import FormattedDateTime from "@/components/FormattedDateTime";
import { getFiles, getTotalSpaceUsed } from "@/lib/actions/file.actions";
import { convertFileSize, getUsageSummary } from "@/lib/utils";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import Thumbnail from "@/components/Thumbnail";
import ActionDropdown from "@/components/ActionDropdown";
import { Chart } from "@/components/Chart";

const Dashboard = async () => {

  const [files, totalSpace] = await Promise.all([
    getFiles({ types: [], limit: 10 }),
    getTotalSpaceUsed(),
  ]);

  const usageSummary = getUsageSummary(totalSpace);

  return (
    <div className="dashboard-container">
      <section>
        <Chart used={totalSpace.used} available={totalSpace.all}/>
        <ul className="dashboard-summary-list">
          {usageSummary.map((summary) => (
            <Link
              href={summary.url}
              key={summary.title}
              className="dashboard-summary-card"
            >
              <div className="summary-card-content">
                
                <div className="summary-icon-wrapper">
                  <Image
                    src={summary.icon}
                    width={28}
                    height={28}
                    alt={summary.title}
                    className="summary-type-icon"
                  />
                </div>

                <div className="space-y-5 pt-6">
                  <div className="flex justify-end">
                    <h4 className="summary-type-size">
                      {convertFileSize(summary.size) || 0}
                    </h4>
                  </div>

                  <div className="space-y-3">
                    <h5 className="summary-type-title">
                      {summary.title}
                    </h5>

                    <Separator className="summary-separator" />

                    <p className="body-2 text-[var(--color-light-100)]">Last Update</p>

                    <FormattedDateTime
                      date={summary.latestDate}
                      className="summary-date"
                    />
                  </div>
                </div>

              </div>
            </Link>
          ))}
        </ul>
      </section>


      <section className="custom-scrollbar dashboard-recent-files">
        <h2 className="h3 xl:h2 text-light-100">Recently Uploaded Files</h2>
        {files.documents.length > 0 ? (
          <ul className="mt-5 flex flex-col gap-2">
            {files.documents.map((file: FileDocument) => (
              <Link
                href={file.url}
                target="_blank"
                className="flex items-center gap-3 dashboard-recent-files-list"
                key={file.$id}
              >
                <Thumbnail
                  type={file.type}
                  extension={file.extension}
                  url={file.url}
                />

                <div className="recent-file-details">
                  <div className="flex flex-col gap-1">
                    <p className="subtitle-2 recent-file-name">{file.name}</p>
                    <FormattedDateTime
                      date={file.$createdAt}
                      className="caption"
                    />
                  </div>
                  <ActionDropdown file={file} />
                </div>
              </Link>
            ))}
          </ul>
        ) : (
          <p className="empty-list">No files uploaded</p>
        )}
      </section>

    </div>
  );
}

export default Dashboard;
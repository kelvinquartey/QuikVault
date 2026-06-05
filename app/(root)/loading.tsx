const Loading = () => {
    return (
        <div className="dashboard-container">

        {/* LEFT */}
        <section>

            {/* Chart */}
            <div className="dashboard-loading-chart">
            <div className="dashboard-loading-chart-circle" />

            <div className="flex flex-1 flex-col justify-center gap-4">
                <div className="loading-line w-[180px]" />
                <div className="loading-line w-[140px]" />
            </div>
            </div>

            {/* Summary cards */}
            <ul className="dashboard-summary-list">
            {Array.from({ length: 4 }).map((_, index) => (
                <div
                key={index}
                className="dashboard-summary-card dashboard-loading-card"
                >
                <div className="summary-card-content">

                    <div className="summary-icon-wrapper">
                    <div className="dashboard-loading-icon" />
                    </div>

                    <div className="space-y-5 pt-6">

                    <div className="flex justify-end">
                        <div className="loading-line h-7 w-20" />
                    </div>

                    <div className="space-y-3">
                        <div className="loading-line h-5 w-[70%]" />

                        <div className="summary-separator" />

                        <div className="loading-line h-4 w-24" />

                        <div className="loading-line h-4 w-[60%]" />
                    </div>

                    </div>

                </div>
                </div>
            ))}
            </ul>

        </section>

        {/* RIGHT */}
        <section className="dashboard-recent-files">

            <div className="loading-line h-8 w-[240px]" />

            <ul className="mt-5 flex flex-col gap-2">
            {Array.from({ length: 7 }).map((_, index) => (
                <div
                key={index}
                className="flex items-center gap-3 dashboard-recent-files-list"
                >
                <div className="dashboard-loading-thumb" />

                <div className="recent-file-details">

                    <div className="flex flex-col gap-2 w-full">
                    <div className="loading-line h-5 w-[70%]" />
                    <div className="loading-line h-4 w-[40%]" />
                    </div>

                    <div className="dashboard-loading-action" />

                </div>
                </div>
            ))}
            </ul>

        </section>

        </div>
    );
};

export default Loading;
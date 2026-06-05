const Loading = () => {
    return (
        <div className="page-container">
        {/* Header */}
        <section className="w-full">
            <div className="loading-title" />

            <div className="total-size-section">
            <div className="loading-total" />

            <div className="sort-container">
                <div className="loading-sort-label" />
                <div className="loading-sort" />
            </div>
            </div>
        </section>

        {/* Cards */}
        <section className="file-list">
            {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="file-card loading-card">
                <div className="flex justify-between">
                <div className="loading-thumbnail" />

                <div className="flex flex-col items-end gap-3">
                    <div className="loading-action" />
                    <div className="loading-pill" />
                </div>
                </div>

                <div className="file-card-details">
                <div className="loading-line w-[80%]" />
                <div className="loading-line w-[55%]" />
                <div className="loading-line w-[65%]" />
                </div>
            </div>
            ))}
        </section>
        </div>
    );
};

export default Loading;
import Image from "next/image";

const Loading = () => {
    return (
        <main className="flex min-h-screen items-center justify-center bg-[var(--background)]">
            <div className="animate-[var(--animate-pulse-scale)] logo-loading">
                <Image
                    src="/assets/images/logo.png"
                    alt="Loading"
                    width={180}
                    height={180}
                    priority
                    className="select-none"
                />
            </div>
        </main>
    );
};

export default Loading;
export default function AboutPage() {
    return (
        <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
            <div className="mx-auto max-w-5xl px-6 py-10">

                <section className="text-center">
                    <div className="inline-flex items-center rounded-full bg-[var(--color-primary)]/10 px-4 py-2 h2 font-medium text-[var(--color-primary)]">
                        About QuikVault
                    </div>

                    <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
                        Secure file storage made simple.
                    </h1>

                    <p className="mx-auto mt-6 max-w-3xl text-lg text-[var(--color-light-100)] dark:text-[var(--color-light-200)]">
                        QuikVault is a modern cloud storage platform designed to help
                        individuals and teams upload, organize, manage, and access files
                        from anywhere. Built with simplicity, security, and speed in mind,
                        QuikVault provides a streamlined experience for storing your digital
                        content.
                    </p>
                </section>

                <section className="mt-20 rounded-3xl border border-black/5 bg-[var(--card)] p-8 shadow-sm dark:border-white/10">
                    <h2 className="h2 mb-4">Our Mission</h2>

                    <p className="body-1 text-[var(--color-light-100)] dark:text-[var(--color-light-200)]">
                        Managing files should not be complicated. Our goal is to provide a
                        clean, intuitive platform where users can safely store documents,
                        images, videos, audio files, and other digital assets while keeping
                        everything organized and easily accessible.
                    </p>
                </section>

                <section className="mt-20">
                    <h2 className="h2 text-center">What QuikVault Offers</h2>

                    <div className="mt-10 grid gap-6 md:grid-cols-2">
                        {[
                        {
                            title: "Secure Authentication",
                            description:
                            "Account verification and secure sign-in workflows help protect user data and provide a reliable experience.",
                        },
                        {
                            title: "File Upload & Management",
                            description:
                            "Upload, organize, view, sort, search, and manage files across multiple categories.",
                        },
                        {
                            title: "Smart Categorization",
                            description:
                            "Automatically organize content into Documents, Images, Media, and Other file types.",
                        },
                        {
                            title: "Storage Tracking",
                            description:
                            "Monitor storage usage with detailed insights and category-based space summaries.",
                        },
                        {
                            title: "File Sharing",
                            description:
                            "Collaborate with others by sharing files while maintaining control over access.",
                        },
                        {
                            title: "Personalized Profiles",
                            description:
                            "Customize your account with profile pictures and editable account information.",
                        },
                        ].map((feature) => (
                        <div
                            key={feature.title}
                            className="rounded-3xl border border-black/5 bg-[var(--card)] p-6 shadow-sm transition-all hover:shadow-lg dark:border-white/10"
                        >
                            <h3 className="h4 mb-3">{feature.title}</h3>

                            <p className="body-2 text-[var(--color-light-100)] dark:text-[var(--color-light-200)]">
                            {feature.description}
                            </p>
                        </div>
                        ))}
                    </div>
                </section>

                <section className="mt-20 rounded-3xl bg-[var(--color-primary)] p-10 text-white">
                    <h2 className="text-3xl font-bold">
                        Built for speed, simplicity, and accessibility.
                    </h2>

                    <p className="mt-4 max-w-3xl text-white/80">
                        QuikVault combines a clean user experience with modern web
                        technologies to deliver fast file management, responsive design, and
                        seamless performance across desktop and mobile devices.
                    </p>
                </section>

                <section className="mt-20">
                    <h2 className="h2 mb-8 text-center">Powered By Modern Technology</h2>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {[
                            "Next.js",
                            "TypeScript",
                            "Tailwind CSS",
                            "Appwrite",
                            ].map((tech) => (
                            <div
                                key={tech}
                                className="rounded-2xl border border-black/5 bg-[var(--card)] p-5 text-center font-semibold shadow-sm dark:border-white/10"
                            >
                                {tech}
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
}
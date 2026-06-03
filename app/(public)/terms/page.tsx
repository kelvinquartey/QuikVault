import Link from "next/link";

const TermsPage = () => {
  return (
    <main className="min-h-screen bg-[var(--background)] px-6 py-16 text-[var(--foreground)]">
        <div className="mx-auto max-w-4xl">
            <div className="mb-12 text-center">
                <div className="mb-4 inline-flex items-center rounded-full border border-[var(--color-primary)]/20 bg-[var(--color-primary)]/10 px-4 py-2">
                    <span className="h1 font-medium text-[var(--color-primary)] dark:text-white/90">
                        Terms & Conditions
                    </span>
                </div>

                <p className="mx-auto max-w-2xl text-base text-[var(--color-light-100)] dark:text-[var(--color-light-200)] sm:text-lg">
                    Please read these terms carefully before using this platform.
                </p>
            </div>

            <div className="space-y-8 rounded-[24px] border border-black/5 bg-white p-8 shadow-xl dark:border-white/10 dark:bg-[var(--card)]">
                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold">
                        1. Introduction
                    </h2>

                    <p className="leading-8 text-[var(--color-light-100)] dark:text-[var(--color-light-200)]">
                        This web application is a cloud storage and file management
                        platform created strictly for educational and portfolio purposes.
                        It is not a registered commercial product, company, or officially
                        licensed storage service.
                    </p>

                    <p className="leading-8 text-[var(--color-light-100)] dark:text-[var(--color-light-200)]">
                        By accessing or using this application, you agree to these Terms
                        & Conditions.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold">
                        2. Acceptable Use
                    </h2>

                    <p className="leading-8 text-[var(--color-light-100)] dark:text-[var(--color-light-200)]">
                        You agree not to use this platform for:
                    </p>

                    <ul className="space-y-3 pl-6 text-[var(--color-light-100)] dark:text-[var(--color-light-200)]">
                        <li className="list-disc">
                            Uploading illegal, harmful, or malicious content
                        </li>

                        <li className="list-disc">
                            Attempting unauthorized access to accounts or data
                        </li>

                        <li className="list-disc">
                            Distributing malware, spam, or harmful software
                        </li>

                        <li className="list-disc">
                            Violating intellectual property rights
                        </li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold">
                        3. Storage Disclaimer
                    </h2>

                    <p className="leading-8 text-[var(--color-light-100)] dark:text-[var(--color-light-200)]">
                        Although this application simulates a cloud storage platform,
                        uploaded files should not be considered permanently secure or
                        backed up.
                    </p>

                    <p className="leading-8 text-[var(--color-light-100)] dark:text-[var(--color-light-200)]">
                        Users are responsible for maintaining their own backups of any
                        important files.
                    </p>
                </section>

                <section className="space-y-4 rounded-2xl border border-[var(--color-primary)]/20 bg-[var(--color-primary)]/5 p-6">
                    <h2 className="text-2xl font-semibold text-[var(--color-primary)]">
                        4. Portfolio Project Notice
                    </h2>

                    <p className="leading-8 text-[var(--color-light-100)] dark:text-[var(--color-light-200)]">
                        This application was developed as a portfolio and learning project
                        to demonstrate full-stack development skills using modern web
                        technologies including Next.js, Appwrite, TypeScript, Tailwind
                        CSS, and related tools.
                    </p>

                    <p className="leading-8 text-[var(--color-light-100)] dark:text-[var(--color-light-200)]">
                        It is not an officially registered business, commercial SaaS
                        platform, or enterprise-grade storage solution.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold">
                        5. Privacy
                    </h2>

                    <p className="leading-8 text-[var(--color-light-100)] dark:text-[var(--color-light-200)]">
                        Basic account information and uploaded files may be stored for the
                        purpose of providing functionality within the application.
                    </p>

                    <p className="leading-8 text-[var(--color-light-100)] dark:text-[var(--color-light-200)]">
                        This project does not guarantee enterprise-level security,
                        compliance certifications, or long-term data retention.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold">
                        6. Limitation of Liability
                    </h2>

                    <p className="leading-8 text-[var(--color-light-100)] dark:text-[var(--color-light-200)]">
                        The creator of this application shall not be held responsible for
                        data loss, service interruptions, or damages resulting from the
                        use of this platform.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold">
                        7. Changes to These Terms
                    </h2>

                    <p className="leading-8 text-[var(--color-light-100)] dark:text-[var(--color-light-200)]">
                        These Terms & Conditions may be updated or modified at any time
                        without prior notice.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold">
                        8. Contact
                    </h2>

                    <p className="leading-8 text-[var(--color-light-100)] dark:text-[var(--color-light-200)]">
                        If you have questions regarding these terms, please contact the
                        project owner through the portfolio or repository associated with
                        this application.
                    </p>
                </section>

                <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-black/5 pt-6 text-sm dark:border-white/10 sm:flex-row">
                    <p className="text-[var(--color-light-100)] dark:text-[var(--color-light-200)]">
                        Last updated: May 2026
                    </p>
                </div>
            </div>
        </div>
    </main>
  );
};

export default TermsPage;
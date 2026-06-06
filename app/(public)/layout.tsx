import PublicHeader from "@/components/PublicHeader";
import { cookies } from "next/headers";

export default async function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const cookieStore = await cookies();

    const isLoggedIn =
    !!cookieStore.get("appwrite-session");

    return (
        <>
            <PublicHeader isLoggedIn={isLoggedIn} />

            <main>
                {children}
                <section className="mt-1 border-t border-black/10 py-5 text-center dark:border-white/10">
                    <h3 className="h4">&copy;2026 QuikVault</h3>

                    <p className="mt-3 text-[var(--color-light-100)] dark:text-[var(--color-light-200)]">
                        Store smarter. Access faster. Stay organized.
                    </p>
                </section>
            </main>
        </>
    );
}
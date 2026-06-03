import PublicHeader from "@/components/PublicHeader";
import { getCurrentUser } from "@/lib/actions/user.actions";

export default async function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getCurrentUser();

    return (
        <>
            <PublicHeader isLoggedIn={!!user} />

            <main>
                {children}
            </main>
        </>
    );
}
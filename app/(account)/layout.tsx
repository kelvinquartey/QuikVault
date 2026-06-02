import { getCurrentUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import { Toaster } from "sonner";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) redirect("/sign-in");

  return (
    <main className="min-h-screen bg-[var(--background)]">
      {children}
      <Toaster />
    </main>
  );
}
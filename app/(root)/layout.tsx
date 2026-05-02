import Header from '@/components/Header'
import MobileNavigation from '@/components/MobileNavigation'
import Sidebar from '@/components/Sidebar'
import { getCurrentUser } from '@/lib/actions/user.actions'
import { redirect } from "next/navigation";

export default async function Layout({
    children,
}: {
    children: React.ReactNode
}){
    const user = await getCurrentUser()

    if(!user) return redirect("/sign-in");

  return (
    <main className="flex min-h-screen bg-[var(--card)]">
        <Sidebar user={user}/>

        <section className="flex h-full flex-1 flex-col">
            <MobileNavigation {...user}/>
            <Header />

            <div className="main-content remove-scrollbar">{children}</div>
        </section>
    </main>
  )
}


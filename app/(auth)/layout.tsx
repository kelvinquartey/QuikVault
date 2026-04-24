import { Logo } from "@/components/logo"

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}){
    return(
        <div className="flex min-h-screen">
            <section className="flex flex-1 flex-col items-center bg-white p-4 py-10 lg:justify-center lg:p-10 lg:py-0">
                <div className="mb-16 lg:hidden flex justify-items-start">
                    <Logo variant="light"/>
                </div>
                {children}
            </section>
            <section className="hidden bg-[var(--color-primary)] p-7 w-1/2 items-center justify-center lg:flex xl:w-2/5 m-5 rounded-2xl">
                <div className="flex max-h-[800px] max-w-[430px] flex-col justify-center space-y-12 -mt-9">
                    <Logo  variant="auth"/>

                    <div className="-mt-7 space-y-5 text-white ">
                        <h1 className="h1">Manage your files effortlessly</h1>
                        <p className="body-1">
                            Store, organize, and access your files anytime
                        </p>
                    </div>

                    <div className="space-y-5 mt-8">
                        {[
                            {
                                title: "Secure file storage",
                                desc: "Your files are protected with reliable and secure cloud storage.",
                                icon: "🔒",
                                },
                                {
                                title: "Instant access anywhere",
                                desc: "Access your files anytime, from any device, without delays.",
                                icon: "⚡",
                                },
                                {
                                title: "Organized and easy to use",
                                desc: "Keep everything structured with a simple and intuitive interface.",
                                icon: "📁",
                            },
                        ].map((feature, i) => (
                            <div
                            key={i}
                            className="animate-fade-in bg-white/10 hover:bg-white/20 p-5 rounded-xl border border-white/20 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                            style={{ 
                                animationDelay: `${i * 0.2}s`,
                                animationFillMode: 'both' 
                            }}
                            >
                                <div className="flex items-start gap-4 ">
                                    <span className="text-2xl">
                                    {feature.icon}
                                    </span>

                                    <div>
                                        <h3 className="font-semibold text-white">
                                            {feature.title}
                                        </h3>
                                        <p className="text-sm text-white/70 mt-1">
                                            {feature.desc}
                                        </p>
                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}
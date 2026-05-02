import Image from "next/image";

export const SidebarLogo = () => {

  return (
    <>
        <div className="items-center gap-2 hidden lg:flex">
            <Image
                src="/assets/images/logo.png"
                alt="logo"
                width={120}
                height={40}
                className="h-auto w-[70px]"
            />

            <h2 className="sidebar-logo tracking-tight leading-none flex items-center">
                <span className="text-[var(--logo-main)]">
                Quik
                </span>
                <span className="text-[var(--logo-accent)]">
                Vault
                </span>
            </h2>
        </div>
        <div className="flex items-center lg:hidden">
            <Image
                src="/assets/images/logo.png"
                alt="logo"
                width={120}
                height={40}
                className="h-auto w-[75px] "
            />
        </div>
    </>
  );
};
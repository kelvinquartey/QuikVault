import Image from "next/image";

export const MobileLogo = () => {

  return (
    <div className="flex items-center justify-center gap-2">
      <Image
        src="/assets/images/logo.png"
        alt="logo"
        width={100}
        height={40}
        className="h-auto w-[65px]"
      />

      <h2 className="mobile-logo tracking-tight leading-none flex items-center">
        <span className="text-[var(--logo-main)]">
          Quik
        </span>
        <span className="text-[var(--logo-accent)]">
          Vault
        </span>
      </h2>
    </div>
  );
};
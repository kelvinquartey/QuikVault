import Image from "next/image";

export const Logo = () => {

  return (
    <div className="flex items-center justify-center gap-2">
      <Image
        src="/assets/images/logotest.png"
        alt="logo"
        width={120}
        height={40}
        className="h-auto w-[100px] sm:w-[120px]"
      />

      <h2 className="logo tracking-tight leading-none flex items-center">
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
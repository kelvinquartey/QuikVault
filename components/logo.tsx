import Image from "next/image";

type LogoVariant = "light" | "dark" | "auth";

interface LogoProps {
  variant?: LogoVariant;
}

export const Logo = ({ variant = "light" }: LogoProps) => {
  const textStyles = {
    light: {
      quik: "text-[var(--color-dark-100)]",
      vault: "text-[var(--color-primary)]",
    },
    dark: {
      quik: "text-white",
      vault: "text-[var(--color-primary)]",
    },
    auth: {
      quik: "text-white",
      vault: "text-white/80",
    },
  };

  return (
    <div className="flex items-center max-lg:-ml-22 max-lg:-mt-6">
      <Image
        src="/assets/images/logo2.png"
        alt="logo"
        width={200}
        height={60}
        className="h-auto max-md:w-[180px]"
      />

      <h2 className="-ml-13 h1 -mt-4 logo tracking-tight">
        <span className={`${textStyles[variant].quik}`}>
          Quik
        </span>
        <span className={`${textStyles[variant].vault}`}>
          Vault
        </span>
      </h2>
    </div>
  );
};
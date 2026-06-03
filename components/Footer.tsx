import Link from "next/link";

const Footer = () => {

    return (
        <footer
            className="footer"
        >
            <div
                className="footer-content"
            >
                <div className="text-center sm:text-left">
                    <p className="text-sm font-medium text-[var(--foreground)]">
                        © 2026 QuikVault
                    </p>

                    <p className="mt-1 text-sm text-[var(--color-light-200)]">
                        Secure cloud storage. Fast access. Simple sharing.
                    </p>
                </div>

                <nav className="flex items-center gap-3">
                    <Link
                        href="/about"
                        className="footer-link"
                    >
                        About
                    </Link>

                    <Link
                        href="/terms"
                        className="footer-link"
                    >
                        Terms
                    </Link>
                </nav>
            </div>
        </footer>
    );
};

export default Footer;
"use client";

import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import { Button } from "@/components/ui/button"
import { useState } from "react";
import Image from "next/image";
import { sendEmailOTP, verifySecret } from "@/lib/actions/user.actions";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const OtpModal = ({
    open,
    setOpen,
    accountId,
    email,
    initialCountdown = 0, 
    type,
}: {
    open: boolean;
    setOpen: (open: boolean) => void;
    accountId: string;
    email: string;
    initialCountdown?: number;
    type: "sign-in" | "sign-up";
}) => {
    
    const router = useRouter();
    const [otp, setOtp] = useState("");
    const [isLoading,setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [isResending, setIsResending] = useState(false);

    const [countdown, setCountdown] = useState(initialCountdown);

    useEffect(() => {
        if (!open) return;
        if (countdown <= 0) return;

        const timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [countdown, open]);

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (otp.length !== 6) return;
        setIsLoading(true);
        setErrorMessage("");

        try{
            const response = await verifySecret({ accountId, otp });

            if (response.success) {
                router.push("/");
                setOpen(false);
            } else {
                setErrorMessage(response.message || "Invalid or expired code");
            }

        } catch (error) {
            console.log("Failed to verify OTP:", error);
            setErrorMessage("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }

    }

    const handleResendOtp = async () => {
        if (countdown > 0) return;

        try {
            setIsResending(true);
            setErrorMessage("");

            await sendEmailOTP(email);

            setCountdown(30);

        } catch (error) {
            console.error("Failed to resend OTP:", error);
            setErrorMessage("Failed to resend code.");
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div>
            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogContent className="shad-alert-dialog">
                    <button
                        onClick={() => setOpen(false)}
                        aria-label="Close dialog"
                        className="absolute right-4 top-4 opacity-60 hover:opacity-100 transition cursor-pointer"
                    >
                        <Image 
                            src="/assets/icons/close-dark.svg" 
                            alt="close"
                            width={20}
                            height={20}
                            className="block dark:hidden"
                        />
                        <Image 
                            src="/assets/icons/close.svg" 
                            alt="close"
                            width={20}
                            height={20}
                            className="hidden dark:block"
                        />
                    </button>
                    <AlertDialogHeader className="flex flex-col items-center justify-center text-center space-y-2">
                        <AlertDialogTitle className="h2 text-center block mx-auto">
                            {type === "sign-in" ? "Enter your login code" : "Verify your email"}
                        </AlertDialogTitle>
                        <AlertDialogDescription className="subtitle-2 text-center block mx-auto text-[var(--color-light-100)]">
                            {type === "sign-in"
                            ? "Enter the 6-digit login code sent to your email."
                            : "Enter the 6-digit code sent to your email to verify your account."}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="flex justify-center mt-4">
                        <InputOTP 
                            autoFocus
                            maxLength={6}
                            value={otp}
                            onChange={setOtp}
                        >
                            <InputOTPGroup className="shad-otp gap-2">
                                <InputOTPSlot index={0} className="shad-otp-slot"/>
                                <InputOTPSlot index={1} className="shad-otp-slot"/>
                                <InputOTPSlot index={2} className="shad-otp-slot"/>
                                <InputOTPSlot index={3} className="shad-otp-slot"/>
                                <InputOTPSlot index={4} className="shad-otp-slot"/>
                                <InputOTPSlot index={5} className="shad-otp-slot"/>
                            </InputOTPGroup>
                        </InputOTP>
                    </div>

                    {errorMessage && (
                        <p className="text-sm text-red-500 text-center mt-2">
                            {errorMessage}
                        </p>
                    )}

                    <AlertDialogFooter className="border-none">
                        <div className="flex w-full flex-col gap-4">
                            <button 
                                type="button"
                                onClick={handleSubmit} 
                                className="shad-submit-btn h-12" 
                                disabled={otp.length !== 6 || isLoading}
                            >
                                Submit
                                {isLoading && <Image 
                                    src="/assets/icons/loader.svg" 
                                    alt="loading"
                                    width={24}
                                    height={24}
                                    className="ml-2 animate-spin"
                                />}
                            </button>

                            <div className="subtitle-2 mt-2 text-center text-[var(--color-light-100)]">
                                Didn&apos;t get a code?{" "}
                                {countdown > 0 ? (
                                    <span className="text-muted-foreground">
                                        Resend in {countdown}s
                                    </span>
                                ) :(
                                <Button 
                                    type="button" 
                                    variant="link" 
                                    className="pl-1 text-[var(--color-primary)] cursor-pointer"
                                    onClick={handleResendOtp}>
                                        {isResending ? "Sending..." : "Resend OTP"}
                                </Button>
                                )}
                            </div>
                        </div>
                    </AlertDialogFooter>

                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

export default OtpModal;
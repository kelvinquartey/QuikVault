"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image";
import Link from "next/link";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { useEffect, useState } from "react";
import { createAccount, signInUser } from "@/lib/actions/user.actions";
import OtpModal from "./OTPModal";


type FormType = 'sign-in' | 'sign-up';

const authFormSchema = (formType: FormType) => {
  return z.object({
    email:  z.string().min(1, "Required").email("Please enter a valid email address"),
    fullName: 
      formType === "sign-up"
        ? z.string()
          .min(1, "Required")
          .min(3, "Full name should be at least 3 characters")
          .max(50, "Full name should be at most 50 characters")
        : z.string().optional(),
    terms:
      formType === "sign-up"
        ? z.literal(true, {
              message: "You must accept the Terms & Conditions",
          })
        : z.boolean().optional(),
  })
}

export const AuthForm = ({type}: {type: FormType}) => {

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [accountId, setAccountId] = useState<string | null>(null);

  const [showOtpModal, setShowOtpModal] = useState(false);

  useEffect(() => {
    setShowOtpModal(false);
    setAccountId(null);
  }, [type]);

  const formSchema = authFormSchema(type)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      terms: false,
    }
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      setAccountId(null);
      setShowOtpModal(false);

      const response = type === "sign-up" 
        ? await createAccount({ fullName: values.fullName!, email: values.email })
        : await signInUser({ email: values.email });

      if (!response.success) {
        setErrorMessage(response.message || "Authentication failed");
        return;
      }

      setAccountId(response.accountId);
      setShowOtpModal(true);

    } catch (error) {
      console.error("Authentication error:", error);
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="auth-form"
        >
          <h1 className="form-title">
            {type === "sign-in" ? "Sign In": "Sign Up"}
          </h1>
          {type === "sign-up" &&
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <div className="shad-form-item">
                    <FormLabel className="shad-form-label">Full Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your full name"
                        className="shad-input"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          setErrorMessage("");
                        }}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                  </div>
                  <FormMessage className="shad-form-message"/>
                </FormItem>
              )}
            />
          }

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <div className="shad-form-item">
                  <FormLabel className="shad-form-label">Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your full email"
                      className="shad-input"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        setErrorMessage("");
                      }}
                    />
                  </FormControl>
                </div>
                <FormMessage className="shad-form-message"/>
              </FormItem>
            )}
          />

          {type === "sign-up" && (
            <FormField
              control={form.control}
              name="terms"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <div className="flex items-start gap-3 rounded-2xl border border-black/5 bg-black/[0.02] p-4 dark:border-white/10 dark:bg-white/[0.03]">
                    
                    <FormControl>
                      <input
                        id="terms"
                        type="checkbox"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                        className="
                          mt-1 size-4 rounded border border-[var(--color-light-200)]
                          accent-[var(--color-primary)]
                          cursor-pointer
                        "
                      />
                    </FormControl>

                    <div className="space-y-1">
                      <p className="text-sm leading-6 text-[var(--foreground)]">
                        I agree to the{" "}
                        <Link
                          href="/terms"
                          target="_blank"
                          className="
                            font-medium text-[var(--color-primary)]
                            hover:text-[var(--color-primary-hover)]
                            hover:underline
                          "
                        >
                          Terms & Conditions
                        </Link>
                      </p>

                      <p className="text-xs text-[var(--color-light-100)] dark:text-[var(--color-light-200)]">
                        This project is for portfolio and educational purposes only.
                      </p>
                    </div>
                  </div>

                  <FormMessage className="shad-form-message" />
                </FormItem>
              )}
            />
          )}

          <Button
            type="submit"
            className="shad-form-button-submit flex items-center justify-center gap-2 cursor-pointer"
            disabled={
              isLoading ||
              (type === "sign-up" && !form.watch("terms"))
            }
          >
           {isLoading
              ? type === "sign-in"
                ? "Signing In..."
                : "Signing Up..."
              : type === "sign-in"
                ? "Sign In"
                : "Sign Up"
            }
           {isLoading && (
            <Image 
              src="/assets/icons/loader.svg" 
              alt="loading"
              width={24}
              height={24}
              className="animate-spin"/>
           )}
          </Button>

          {errorMessage && (
            <p className="error-message">*{errorMessage}</p>
          )}
          <div className="body-2 flex justify-center">
            <p className="text-foreground opacity-70">
              {type === "sign-in"
                ? "Don't have an account?"
                : "Already have an account?"}
            </p>
            <Link 
              href={type === "sign-in" ? "/sign-up" : "/sign-in"}
              className="ml-1 font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] hover:font-bold">
                {type === "sign-in" ? "Sign Up": "Sign In"}
            </Link>
          </div>
        </form>
      </Form>

      {accountId && (
        <OtpModal
          open={showOtpModal}
          setOpen={setShowOtpModal}
          email={form.getValues("email")}
          accountId={accountId}
          initialCountdown={30}
          type={type}
        />
      )}

    </>
  )
}

export default AuthForm
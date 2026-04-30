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
import { useState } from "react";
import { createAccount } from "@/lib/actions/user.actions";
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
  })
}

export const AuthForm = ({type}: {type: FormType}) => {

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [accountId, setAccountId] = useState<string | null>(null);

  const [showOtpModal, setShowOtpModal] = useState(false);

  const formSchema = authFormSchema(type)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
    }
  })

  const onSubmit = async(values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      if (type === "sign-up") {
        const response = await createAccount({
          fullName: values.fullName!,
          email: values.email,
        });

        if (!response.success) {
          setErrorMessage(response.message);
          return;
        }

        console.log("Account created:", response.accountId);
        setAccountId(response.accountId);
        setShowOtpModal(true);
      }

      if (type === "sign-in") {
        // Will implement sign-in later
        console.log("Sign in flow coming next...");
      }

    } catch (error) {
      console.error(error);
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }


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

          <Button
            type="submit"
            className="shad-form-button-submit flex items-center justify-center gap-2 cursor-pointer"
            disabled={isLoading}
          >
           {type === "sign-in" ? "Sign In" : "Sign Up"}
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
        />
      )}

    </>
  )
}

export default AuthForm
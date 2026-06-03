import Image from "next/image";
import { deleteUserAccount, getCurrentUser, signOutUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import AccountProfile from "@/components/AccountProfile";
import { getAvatarUrl } from "@/lib/getAvatar";

const AccountPage = async () => {
  const user = await getCurrentUser();

  if (!user) redirect("/sign-in");

  const fullName = user?.fullName || "Unknown User";
  const email = user?.email || "No email";

  const safeAvatarValue =
    typeof user?.avatar === "string" &&
    (user.avatar.startsWith("http://") || user.avatar.startsWith("https://"))
      ? user.avatar
      : "";

  const avatar = getAvatarUrl({
    avatar: safeAvatarValue,
    fullName,
    email,
  })

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-10">
      <div className="account-content">
        <AccountProfile 
          fullName={fullName}
          email={email}
          avatar={avatar}
        />

        <div className="mt-6 flex flex-col gap-6">
          <section
            className="
              rounded-3xl border border-[var(--color-primary)]/20
              bg-[var(--color-primary)]/5 p-6
            "
          >
            <h2 className="mb-4 sm:mb-5 text-lg sm:text-xl font-semibold text-[var(--color-primary)]">
              Project Notice
            </h2>

            <p className="text-sm sm:text-base
              leading-7 sm:leading-8
              text-[var(--color-light-100)]
              dark:text-[var(--color-light-200)]"
            >
              This application was built for portfolio and educational purposes.
              It demonstrates a modern cloud storage experience using
              Next.js, Appwrite, Tailwind CSS, and TypeScript.
            </p>
          </section>

          <section className="rounded-3xl border border-black/5 bg-black/[0.02] p-6 dark:border-white/10 dark:bg-white/[0.03] ">
            <h2 className="mb-3 sm:mb-4 text-lg sm:text-xl font-semibold">
              Delete Account
            </h2>

            <p className="mb-5 sm:mb-6
              text-sm sm:text-base
              leading-7 sm:leading-8
              text-[var(--color-light-100)]
              dark:text-[var(--color-light-200)]"
            >
              Permanently delete your account and all associated data.
              This action cannot be undone.
            </p>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="delete-account">
                  Delete Account
                </button>
              </AlertDialogTrigger>

              <AlertDialogContent className="shad-dialog">
                <AlertDialogHeader className="flex flex-col gap-3">
                  <AlertDialogTitle className="text-center text-2xl">
                    Delete Account?
                  </AlertDialogTitle>

                  <AlertDialogDescription
                    className="
                      text-center
                      text-[var(--color-light-100)]
                      dark:text-[var(--color-light-200)]
                    "
                  >
                    Are you sure you want to permanently delete your account?
                    All uploaded files and account data will be removed permanently.
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter className="flex flex-row justify-center gap-3 sm:justify-center">
                  <AlertDialogCancel className="flex-1 h-11 cursor-pointer text-base hover:bg-black/10 dark:hover:bg-white/10 transition-all duration-200">
                    Cancel
                  </AlertDialogCancel>

                  <form action={deleteUserAccount}>
                    <AlertDialogAction
                      type="submit"
                      className="delete-account-submit-button"
                    >
                      Delete Account
                    </AlertDialogAction>
                  </form>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
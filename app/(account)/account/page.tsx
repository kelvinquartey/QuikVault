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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import AccountProfile from "@/components/AccountProfile";
import { getAvatarUrl } from "@/lib/getAvatar";
import AccountHeader from "@/components/AccountHeader";

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
    <>
    <AccountHeader />
    <div className="mx-auto w-full max-w-4xl px-0 sm:px-6 py-0 sm:py-10">
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

            <Dialog>
              <DialogTrigger asChild>
                <button className="delete-account">
                  Delete Account
                </button>
              </DialogTrigger>

              <DialogContent className="shad-dialog">
                <form action={deleteUserAccount}>

                  <DialogHeader className="flex flex-col gap-3">
                    <DialogTitle className="text-center text-2xl">
                      Delete Account?
                    </DialogTitle>

                    <DialogDescription
                      className="
                        text-center
                        text-[var(--color-light-100)]
                        dark:text-[var(--color-light-200)]
                      "
                    >
                      Are you sure you want to permanently delete your account?
                      All uploaded files and account data will be removed permanently.
                      This action cannot be undone.
                    </DialogDescription>
                  </DialogHeader>

                  <DialogFooter className="flex flex-row justify-center gap-3 sm:justify-center">

                    <DialogClose asChild>
                      <button
                        type="button"
                        className="modal-cancel-button"
                      >
                        Cancel
                      </button>
                    </DialogClose>

                    <button
                      type="submit"
                      className="delete-account-submit-button"
                    >
                      Delete Account
                    </button>

                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

          </section>
        </div>
      </div>
    </div>
    </>
  );
};

export default AccountPage;
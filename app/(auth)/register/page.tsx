import { buttonVariants } from "@/components/ui/button";
import UserRegisterForm from "@/components/user-register-form";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function Register() {
  return (
    <div className="container grid flex-col lg:grid-cols-2 h-screen w-screen items-center justify-center lg:max-w-none lg:px-0">
      <Link
        href="/login"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute left-4 md:left-8 md:top-8"
        )}
      >
        ログイン
      </Link>
      <div className="h-full bg-muted lg:block hidden" />
      <div className="mx-auto w-full sm:w-[350px] flex flex-col justify-center space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-sxl font-semibold tracking-tight">
            アカウントの作成{" "}
          </h1>
          <p className="text-sm text-muted-foreground">
            メールアドレスを入力でアカウントの作成をして下さい。
          </p>
        </div>
        <UserRegisterForm />
        {/* <p className="text-center text-muted-foreground px-8 text-sm">
          続けてクリックすれば、私達の
          <Link href={"/terms"} className="underline underline-offset-4">
            利用規約
          </Link>
          と
          <Link href={"/privacy"} className="underline underline-offset-4">
            プライバシーポリシー
          </Link>
          に同意したことになります。
        </p> */}
      </div>
    </div>
  );
}

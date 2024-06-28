"use client";

import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Icon } from "./icon";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "./ui/use-toast";
import { signInSchema } from "@/lib/validations/signin";
import { z } from "zod";

type FormData = z.infer<typeof signInSchema>;

export default function UserAuthForm() {
  const [isGithubLoading, setIsGithubLoading] = useState<boolean>(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGuestLoading, setIsGuestLoading] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(signInSchema),
  });

  async function onSubmit(data: FormData) {
    setIsLoading(true);

    const signInResult = await signIn("credentials", {
      email: data.email.toLowerCase(),
      password: data.password,
      callbackUrl: "/dashboard",
      redirect: false,
    });

    if (!signInResult?.ok) {
      setIsLoading(false);
      return toast({
        title: "サインインに失敗しました",
        description: "ログイン画面よりログインをお試し下さい",
        variant: "destructive",
      });
    } else {
      window.location.href = "/dashboard";
    }
  }

  async function onGuestSubmit() {
    setIsGuestLoading(true);

    const signInResult = await signIn("credentials", {
      email: "guest@a.com",
      password: "123456",
      callbackUrl: "/dashboard",
      redirect: false,
    });

    if (!signInResult?.ok) {
      setIsGuestLoading(false);
      return toast({
        title: "ゲストログインに失敗しました",
        description: "もう一度お試しください",
        variant: "destructive",
      });
    } else {
      window.location.href = "/dashboard";
    }
  }

  return (
    <div className="grid gap-6">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label htmlFor="email">メールアドレス</Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              required
              {...register("email")}
            />
            <Label htmlFor="password">パスワード</Label>
            <Input
              id="password"
              type="password"
              required
              {...register("password")}
            />
          </div>
          <button className={cn(buttonVariants())}>
            {isLoading && <Icon.spinner className="mr-2 animate-spin" />}
            ログイン
          </button>
        </div>
      </form>

      <button className={cn(buttonVariants())} onClick={onGuestSubmit}>
        {isGuestLoading && <Icon.spinner className="mr-2 animate-spin" />}
        ゲストログイン
      </button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="text-muted-foreground px-2 bg-background">or</span>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <button
          className={cn(buttonVariants({ variant: "outline" }))}
          onClick={() => {
            setIsGithubLoading(true);
            signIn("github");
          }}
        >
          {isGithubLoading ? (
            <Icon.spinner className="mr-2 animate-spin" />
          ) : (
            <Icon.github className="mr-2" />
          )}
          GitHub
        </button>
        <button
          className={cn(buttonVariants({ variant: "outline" }))}
          onClick={() => {
            setIsGoogleLoading(true);
            signIn("google");
          }}
        >
          {isGoogleLoading ? (
            <Icon.spinner className="mr-2 animate-spin" />
          ) : (
            <Icon.google className="mr-2" />
          )}
          Google
        </button>
      </div>
    </div>
  );
}

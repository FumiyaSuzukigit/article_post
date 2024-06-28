// components/LogoutButton.tsx
"use client";

import { signOut } from "next-auth/react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const LogoutButton = () => {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className={cn(
        buttonVariants({ variant: "secondary", size: "sm" }),
        "px-4"
      )}
    >
      ログアウト
    </button>
  );
};

export default LogoutButton;

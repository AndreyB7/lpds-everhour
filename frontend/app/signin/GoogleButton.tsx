"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Button, Slot } from "@radix-ui/themes";
import Google from "@/icons/google";

const GoogleButton = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  return (
    <Button onClick={() => signIn("google", { callbackUrl })}>
      <Slot><Google size={14}/></Slot>
      Sign in with Google
    </Button>
  );
};

export { GoogleButton };
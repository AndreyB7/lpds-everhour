"use client";
import { Theme } from "@radix-ui/themes";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

export const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <Theme>
      <SessionProvider>{ children }</SessionProvider>
    </Theme>
  )
};
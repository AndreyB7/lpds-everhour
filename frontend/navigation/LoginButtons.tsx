'use client'
import React from 'react';
import Link from "next/link";
import { Button } from "@radix-ui/themes";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

type Props = {
  isLoggedIn: boolean
}
const LoginButtons = ({ isLoggedIn }: Props) => {
  const pathname = usePathname()
  return (<>
    { isLoggedIn ? (
        <Link href="#" onClick={ () => signOut({ callbackUrl: "/" }) }>
          <Button size="1" className={'navButton'}>Sign Out</Button>
        </Link>
      ) :
      (
        <Link href={ '/signin' }>
          <Button size="1" className={ `navButton ${ pathname === '/signin' ? 'current' : '' }` }>Sign In</Button>
        </Link>
      ) }
  </>)
};

export default LoginButtons;
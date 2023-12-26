'use client'
import { Button, Flex } from "@radix-ui/themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Session } from "next-auth";
import LoginButtons from "@/navigation/LoginButtons";


const pagesPublic = [
  { label: 'Home', url: '/' },
]

const pagesProtected = [
  { label: 'Parameters', url: '/parameters' },
  { label: 'COA', url: '/project/coa' },
  { label: 'SVT', url: '/project/svt' },
]

type Props = {
  session: Session | null
}
export default function Nav({ session }: Props) {
  const pathname = usePathname()
  const isLoggedIn = !!session?.user

  return (
    <Flex justify={ "center" } m={ "2" }>
      <Flex gap="2" align="center" justify={ "center" }>
        { pagesPublic.map(page => (
          <Link key={ page.url } href={ page.url }>
            <Button size="1" className={ pathname === page.url ? 'current' : '' }>{ page.label }</Button>
          </Link>
        )) }
        { isLoggedIn && (
          pagesProtected.map(page => (
            <Link key={ page.url } href={ page.url }>
              <Button size="1" className={ pathname === page.url ? 'current' : '' }>{ page.label }</Button>
            </Link>
          ))
        ) }
        <LoginButtons isLoggedIn={ isLoggedIn }/>
      </Flex>
    </Flex>)
}
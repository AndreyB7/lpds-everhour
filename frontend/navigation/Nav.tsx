'use client'
import { Button, Flex, Slot } from "@radix-ui/themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Session } from "next-auth";
import LoginButtons from "@/navigation/LoginButtons";
import { useState } from "react";
import { handleRefreshAction } from "@/app/actions";
import Loader from "@/icons/loader";

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
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    const res = await handleRefreshAction()
    console.log(res)
    setIsRefreshing(false)
  }

  return (
    <Flex className={ 'navigation' } justify={ "center" } p={ "2" }>
      <Flex gap="2" align="center" justify={ "center" } wrap={ "wrap" }>
        { pagesPublic.map(page => (
          <Link key={ page.url } href={ page.url }>
            <Button size="1"
                    className={ `navButton ${ pathname === page.url ? 'current' : '' }` }>{ page.label }</Button>
          </Link>
        )) }
        { isLoggedIn && (<>
            { pagesProtected.map(page => (
              <Link key={ page.url } href={ page.url }>
                <Button size="1"
                        className={ `navButton ${ pathname === page.url ? 'current' : '' }` }>{ page.label }</Button>
              </Link>
            )) }
            <Button size="1" onClick={ handleRefresh } disabled={ isRefreshing } className={ 'navButton' }>
              { isRefreshing ? <Slot><Loader/></Slot> : 'Refresh' }
            </Button>
          </>
        ) }
        <LoginButtons isLoggedIn={ isLoggedIn }/>
      </Flex>
    </Flex>)
}
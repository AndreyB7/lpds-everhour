'use client'
import { Button, Flex } from "@radix-ui/themes";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  links: {
    url: string,
    label: string
  }[]
}
const SecondaryNav = ({ links }: Props) => {
  const pathname = usePathname()
  return (
    <Flex className={ 'navigation secondary' } justify={ "center" } p={ "2" }>
      <Flex gap="2" align="center" justify={ "center" } wrap={ "wrap" }>
        { links.map(link => (
          <Link key={ link.url } href={ link.url }>
            <Button size="1"
                    className={ `navButton ${ pathname === link.url ? 'current' : '' }` }>{ link.label }</Button>
          </Link>
        )) }
      </Flex>
    </Flex>
  );
};

export default SecondaryNav;
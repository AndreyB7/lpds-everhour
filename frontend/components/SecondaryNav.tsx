'use client'
import { Button, Flex } from "@radix-ui/themes";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  layout?: "column" | "row",
  links: {
    url: string,
    label: string
  }[]
}
const SecondaryNav = ({ links, layout = "column" }: Props) => {
  const pathname = usePathname()
  return (
    <Flex className={ 'navigation secondary' } justify={ "center" }>
      <Flex gap="2" align="center" direction={layout}>
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
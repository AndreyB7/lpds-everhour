import { Button, Flex } from "@radix-ui/themes";
import Link from "next/link";

export default async function Nav() {
  return (
    <nav>
      <Flex gap="2" align="center">
        <Link href={ '/' }>
          <Button size="2">Home</Button>
        </Link>
        <Link href={ '/parameters' }>
          <Button size="2">Parameters</Button>
        </Link>
        <Link href={ '/coa' }>
          <Button size="2">COA</Button>
        </Link>
        <Link href={ '/svt' }>
          <Button size="2">SVT</Button>
        </Link>
      </Flex>
    </nav>
  )
}
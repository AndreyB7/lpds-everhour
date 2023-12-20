import { Text, Flex, Container } from "@radix-ui/themes";
import Nav from "@/app/nav";

export const metadata = {
  title: 'Home',
  description: 'Home Desc',
}

export default async function Home() {
  return (
    <Container>
      <Nav/>
      <Flex gap="2" align="center" direction="column">
        <Text>Home</Text>
      </Flex>
    </Container>
  )
}

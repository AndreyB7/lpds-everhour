import { Text, Flex, Container } from "@radix-ui/themes";
import { getServerSession } from "next-auth";
import { authConfig } from "@/configs/auth";

export const metadata = {
  title: 'Home',
  description: 'Home Desc',
}

export default async function Home() {
  const session = await getServerSession(authConfig);
  return (
    <Container>
      <Flex gap="2" align="center" direction="column">
        {session?.user ? <Text>Signed in as {session.user.email}</Text> : <Text>Not Signed In</Text>}
        <Text>Dashboard</Text>
      </Flex>
    </Container>
  )
}

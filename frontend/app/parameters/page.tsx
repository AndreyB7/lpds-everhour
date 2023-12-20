import { Text, Flex, Container } from "@radix-ui/themes";
import Nav from "@/app/nav";

export const metadata = {
  title: 'Parameters',
  description: 'Parameters Desc',
}

async function getData() {
  const res = await fetch('http://localhost:1337/api/parameters', { next: { revalidate: 120 } })

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data')
  }

  return res.json()
}

export default async function Parameters() {
  const data = await getData()
  return (
    <Container>
      <Nav/>
      <Flex gap="2" align="center" direction="column">
        <Text>Parameters</Text>
      </Flex>
      <Text>
        <pre>
          { JSON.stringify(data,null,2) }
          </pre>
      </Text>
    </Container>
  )
}

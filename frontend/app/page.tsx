import { Text, Flex, Container } from "@radix-ui/themes";
import { getServerSession } from "next-auth";
import { authConfig } from "@/configs/auth";
import { tMonitoring } from "../../types/types";
import MonitoringCard from "@/components/MonitoringCard";

export const metadata = {
  title: 'Home',
  description: 'Home Desc',
}

async function getData(): Promise<tMonitoring[]> {
  const res: Response = await fetch(`${ process.env.API_URL }/monitoring/data`, {
    next: {
      // revalidate: process.env.NODE_ENV == 'development' ? 0 : 3600,
      tags: ['monitoringData']
    }
  })
  if (!res.ok) {
    console.log(`Failed to fetch data ${ JSON.stringify(res.json()) }`);
    throw new Error(`Failed to fetch data`);
  }
  return res.json()
}

export default async function Home() {
  const session = await getServerSession(authConfig)
  const monitoring = await getData()
  return (
    <Container p={ "2" }>
      <Flex gap="2" align="center" direction="column">
        { session?.user ? <Text>Signed in as { session.user.email }</Text> : <Text>Not Signed In</Text> }
        <Flex gap={ "2" } wrap={ "wrap" } justify={ "center" }>
          { monitoring && monitoring.map(data => (
            <MonitoringCard key={ data.slug } data={ data }/>
          )) }
        </Flex>
      </Flex>
    </Container>
  )
}

import { Button, Text, Flex, Container } from "@radix-ui/themes";
import Link from "next/link";
import Nav from "@/app/nav";
import { string } from "prop-types";

export const metadata = {
  title: 'Home',
  description: 'Home Desc',
}
type ProjectData = {
  schemaTime: [],
  schemaTasks: [],
  tasks: [],
  timeTotal: string
} | null

async function getData(slug: string): Promise<ProjectData> {
  const res: Response = await fetch(`http://localhost:1337/api/${ slug }`, { next: { revalidate: 120 } })
  if (!res.ok) {

    // This will activate the closest `error.js` Error Boundary
    // throw new Error('Message');

    console.log(`Failed to fetch data ${ JSON.stringify(res.json()) }`);
    return null;
  }

  return res.json()
}

export default async function ProjectSlug({ params }: { params: { slug: string } }) {
  const data = await getData(params.slug)
  return (
    <Container>
      <Nav/>
      <Flex gap="2" align="center" direction="column">
        <Text>{ params.slug.toUpperCase() }</Text>
      </Flex>
      { data && <>
        <Text>
          Time Total: { data.timeTotal }
        </Text>
        <Flex>
          <Flex direction={"column"}>
            Tasks:<br/>
            { data.tasks.map(task => (<Text key={task[0]}>{ task[3] }</Text>)) }
          </Flex>
          <Text>
        <pre>
          Schema Time:<br/>
          { JSON.stringify(data.schemaTime, null, 2) }
          </pre>
          </Text>
          <Text>
        <pre>
          Schema Tasks:<br/>
          { JSON.stringify(data.schemaTasks, null, 2) }
          </pre>
          </Text>
        </Flex>
      </> }
    </Container>
  )
}

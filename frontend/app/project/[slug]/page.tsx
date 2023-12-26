import { Text, Flex, Container, Heading } from "@radix-ui/themes";
import { Metadata } from "next";

type ProjectData = {
  schemaTime: [],
  schemaTasks: [],
  tasks: [],
  timeTotal: string
} | null

type Props = { params: { slug: string } }

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  return {
    title: params.slug.toUpperCase(),
    description: `Description ${ params.slug.toUpperCase() }`
  }
}

async function getData(slug: string): Promise<ProjectData> {
  const res: Response = await fetch(`${process.env.API_URL}/${ slug }`, { next: { revalidate: 120 } })
  if (!res.ok) {
    console.log(`Failed to fetch data ${ JSON.stringify(res.json()) }`);
    // This will activate the closest `error.js` Error Boundary
    throw new Error(`Failed to fetch data`);
  }

  return res.json()
}

export default async function ProjectSlug({ params }: Props) {
  const data = await getData(params.slug)
  return (
    <Container>
      <Flex gap="2" align="center" direction="column">
        <Heading>{ params.slug.toUpperCase() }</Heading>
      </Flex>
      { data && <>
        <Text>
          Time Total: { data.timeTotal }
        </Text>
        <Flex direction={ "column" }>
          Tasks:<br/>
          { data.tasks.map(task => (<Text key={ task[0] }>{ task[3] }</Text>)) }
        </Flex>
        <Flex>
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

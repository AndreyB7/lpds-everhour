import { Container, Flex } from "@radix-ui/themes";
import { tProject } from "@/../types/types";
import ProjectOptionsForm from "@/app/parameters/ProjectOptionsForm";

export const metadata = {
  title: 'Parameters',
  description: 'Parameters Desc',
}

type Props = { params: { slug: string } }
async function getData(): Promise<tProject[]> {
  // cached forever, will be revalidated on params update action
  const res = await fetch(`${process.env.API_URL}/parameters`)

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data')
  }

  return res.json()
}

export default async function Parameters({params}: Props) {
  const projects = await getData()

  // TODO rebuild for single project use
  const currentProject = projects.filter(p => p.shortName === (params.slug).toUpperCase())

  return (
    <Container size={ "2" } p={"2"}>
      { currentProject.length ? <ProjectOptionsForm projects={ currentProject }/> :
        <Flex justify={ "center" }>No Data Loaded...</Flex> }
    </Container>
  )
}

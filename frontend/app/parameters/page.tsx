import { Container, Flex, Text } from "@radix-ui/themes";
import { tProject } from "../../../types/types";
import ProjectOptionsForm from "@/app/parameters/ProjectOptionsForm";

export const metadata = {
  title: 'Parameters',
  description: 'Parameters Desc',
}

async function getData(): Promise<tProject[]> {
  const res = await fetch('http://localhost:1337/api/parameters', { next: { revalidate: 120 } })

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data')
  }

  return res.json()
}

export default async function Parameters() {
  const projects = await getData()

  return (
    <Container size={ "2" }>
      {projects.length ? <ProjectOptionsForm projects={ projects }/> : <Flex justify={"center"}>No Data Loaded...</Flex>}
    </Container>
  )
}

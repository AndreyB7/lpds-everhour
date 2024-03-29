import { ReactNode } from "react";
import SecondaryNav from "@/components/SecondaryNav";
import { Box, Container, Flex } from "@radix-ui/themes";
import { Project } from "../../../types/types";

async function getData(): Promise<Project[]> {
  const res: Response = await fetch(`${ process.env.API_URL }/projects`, {
    next: {
      // revalidate: process.env.NODE_ENV == 'development' ? 0 : 3600,
      tags: ['dashboard']
    } })
  if (!res.ok) {
    console.log(`Failed to fetch data ${ JSON.stringify(res.json()) }`);
    throw new Error(`Failed to fetch data`);
  }
  return res.json()
}

export default async function Projects({ children }: {
  children: ReactNode
}) {
  const projects = await getData();
  const projectsLinks = projects.map(p => ({
    label: p.shortName,
    url: `/dashboard/${ p.slug }`
  }))
  projectsLinks.push({ label: 'Add New', url: '/dashboard/add-project' })
  return (
    <Container size={ "3" }>
      <Flex>
        <Box p={ "2" }>
          <SecondaryNav links={ projectsLinks }/>
        </Box>
        <Box width={ "100%" } p={ "2" }>
          { children }
        </Box>
      </Flex>
    </Container>
  );
};

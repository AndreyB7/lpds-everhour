import { ReactNode } from "react";
import SecondaryNav from "@/components/SecondaryNav";
import { Box, Container, Flex } from "@radix-ui/themes";
import { tProject } from "../../../types/types";

const projects = [
  { label: 'COA', url: '/dashboard/coa' },
  { label: 'SVT', url: '/dashboard/svt' },
  { label: 'Add New', url: '/dashboard/add-project' },
]

async function getData(): Promise<tProject[]> {
  const res: Response = await fetch(`${ process.env.NEXT_PUBLIC_API_URL }/projects`, { next: { revalidate: process.env.NODE_ENV == 'development' ? 0 : 3600 } })
  if (!res.ok) {
    console.log(`Failed to fetch data ${ JSON.stringify(res.json()) }`);
    throw new Error(`Failed to fetch data`);
  }
  return res.json()
}

export default async function Projects({ children }: {
  children: ReactNode
}) {
  const data = await getData();
  return (
    <Container size={ "3" }>
      <Flex>
        <Box p={ "2" }>
          <SecondaryNav links={ projects }/>
        </Box>
        <Box width={ "100%" } p={ "2" }>
          <Box>
            {JSON.stringify(data)}
          </Box>
          { children }
        </Box>
      </Flex>
    </Container>
  );
};

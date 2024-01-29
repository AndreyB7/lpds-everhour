import { ReactNode } from "react";
import SecondaryNav from "@/components/SecondaryNav";
import { Box, Container, Flex } from "@radix-ui/themes";

type Props = {
  children: ReactNode
  params: { slug: string }
}
export default async function Projects({ children, params }: Props) {
  const projects =   [
    { label: 'Project', url: `/dashboard/${params.slug}` },
    { label: 'Tasks', url: `/dashboard/${params.slug}/tasks` },
    { label: 'Options', url: `/dashboard/${params.slug}/options` }
  ]
  return (
    <Container size={ "3" }>
      <SecondaryNav layout={"row"} links={ projects }/>
      <Flex direction={ "column" }>
        { children }
      </Flex>
    </Container>
  );
};

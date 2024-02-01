import { Flex, Heading, Box } from "@radix-ui/themes";
import { Metadata } from "next";
import * as React from "react";
import CustomEditor from "@/components/Editor/CustomEditor";

type Props = { params: { slug: string } }

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  return {
    title: params.slug.toUpperCase(),
    description: `Description ${ params.slug.toUpperCase() }`
  }
}

export default async function ProjectSlug({ params }: Props) {

  return (
    <>
      <Flex gap="2" align={ "center" } direction={ "column" }>
        <Heading size={ "4" } mt={ "2" } mb={ "2" }>{ params.slug.toUpperCase() }</Heading>
      </Flex>
      <Flex direction={ "column" }>
        <Box mb={ "2" } py={ "8" } style={ { background: "#fff" } }>
          <CustomEditor/>
        </Box>
      </Flex>
    </>
  )
}

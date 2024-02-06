import { Flex, Heading, Box } from "@radix-ui/themes";
import { Metadata } from "next";
import * as React from "react";
import CustomEditor, { EditorJsData } from "@/components/Editor/CustomEditor";

type Props = { params: { slug: string } }

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  return {
    title: params.slug.toUpperCase(),
    description: `Description ${ params.slug.toUpperCase() }`
  }
}

async function getData(slug: string): Promise<EditorJsData> {
  const res: Response = await fetch(`${ process.env.API_URL }/page/${ slug }`, {
    next: {
      // revalidate: process.env.NODE_ENV == 'development' ? 0 : 3600,
      tags: [`page${ slug }`]
    }
  })
  if (!res.ok) {
    console.log(`Failed to fetch data ${ JSON.stringify(await res.json()) }`);
    throw new Error(`Failed to fetch data`);
  }
  const data = await res.json()
  if (!data.version) {
    // set defaults
    return {
      version: '',
      time: 0,
      blocks: []
    }
  }
  return data
}

export default async function ProjectSlug({ params }: Props) {
  const initData = await getData(params.slug)

  return (
    <Flex direction={ "column" }>
      <Box p={ "4" } style={ { background: "#fff", minHeight: "70px" } }>
        <CustomEditor initData={ initData } slug={ params.slug }/>
      </Box>
    </Flex>
  )
}

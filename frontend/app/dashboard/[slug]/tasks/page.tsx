import { Text, Flex, Heading, Box } from "@radix-ui/themes";
import { Metadata } from "next";
import { EverhourTask } from "@/../types/types";
import * as React from "react";
import Tree from "./tree";
import { ClientDateTime } from "@/components/ClientDateTime";

type ProjectData = {
  tasks: EverhourTask[],
  timeTotal: string,
  timeTotalSeconds: number,
  lastUpdate: { time: string }
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
  const res: Response = await fetch(`${ process.env.API_URL }/project/${ slug }`, {
    next: {
      // revalidate: process.env.NODE_ENV == 'development' ? 0 : 3600,
      tags: ['tasks']
    } })
  if (!res.ok) {
    console.log(`Failed to fetch data ${ JSON.stringify(await res.json()) }`);
    // throw new Error(`Failed to fetch data`);
    return null
  }
  return res.json()
}

export default async function ProjectSlug({ params }: Props) {
  const data = await getData(params.slug)

  return (
    <>
      <Flex gap="2" align={ "center" } direction={ "column" }>
        <Box p={ "2" }>
          <ClientDateTime date={ data?.lastUpdate?.time }/>
        </Box>
        <Heading size={ "4" } mt={ "2" } mb={ "2" }>{ params.slug.toUpperCase() }</Heading>
      </Flex>
      { data && <>
        <Flex justify={ "end" } align={ "end" }>
          <Text align={ "right" }>
            Time Total: { data?.timeTotal }
          </Text>
        </Flex>
        <hr/>
        { data?.tasks.length ?
          <Flex direction={ "column" }>
            <Tree data={ data.tasks }/>
          </Flex> :
          <Flex direction={ "column" }>
            <Text align={ "center" }>No data to display</Text>
          </Flex>
        }
      </> }
    </>
  )
}

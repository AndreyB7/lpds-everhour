import { Flex } from "@radix-ui/themes";
import { tProject } from "@/../types/types";
import ProjectOptionsForm from "@/app/parameters/ProjectOptionsForm";
import React from "react";

export const metadata = {
  title: 'Parameters',
  description: 'Parameters Desc',
}

type Props = { params: { slug: string } }

async function getData(): Promise<tProject[]> {
  // cached forever, will be revalidated on params update action
  const res = await fetch(`${ process.env.API_URL }/parameters`, { next: { tags: ['projectOptions'] }})

  if (!res.ok) {
    console.log(`Failed to fetch data ${ JSON.stringify(await res.json()) }`);
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data')
  }

  return res.json()
}

export default async function Parameters({ params }: Props) {
  const projects = await getData()

  console.log(projects)

  // TODO rebuild for single project use
  const currentProject = projects.filter(p => p.shortName === (params.slug).toUpperCase())

  return (
    <>
      { currentProject.length ? <ProjectOptionsForm projects={ currentProject }/> :
        <Flex justify={ "center" }>No Data Loaded...</Flex> }
    </>
  )
}

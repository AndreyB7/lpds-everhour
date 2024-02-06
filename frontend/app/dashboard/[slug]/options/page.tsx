import { Flex } from "@radix-ui/themes";
import { Project } from "@/../types/types";
import ProjectOptionsForm from "@/app/dashboard/[slug]/options/ProjectOptionsForm";
import React from "react";
import DeleteProjectButton from "@/app/dashboard/[slug]/options/DeleteProjectButton";

export const metadata = {
  title: 'Parameters',
  description: 'Parameters Desc',
}

type Props = { params: { slug: string } }

async function getData(slug: string): Promise<Project> {

  const res = await fetch(`${ process.env.API_URL }/project/${ slug }/options`, {
    next: {
      // revalidate: process.env.NODE_ENV == 'development' ? 0 : 3600,
      tags: [`projectOptions${ slug }`]
    }
  })

  if (!res.ok) {
    console.log(`Failed to fetch data ${ JSON.stringify(await res.json()) }`);
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data')
  }

  return res.json()
}

export default async function Options({ params }: Props) {
  const project = await getData(params.slug)

  return (
    <>
      { project ? <ProjectOptionsForm project={ project }/> :
        <Flex justify={ "center" }>No Project Data Loaded...</Flex> }
      <Flex justify={ "end" } px={ "5" } py={ "4" }>
        <DeleteProjectButton slug={ params.slug }/>
      </Flex>
    </>
  )
}

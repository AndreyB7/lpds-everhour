import { Flex, Heading } from "@radix-ui/themes";
import React from "react";
import AddProjectForm from "@/app/dashboard/add-project/AddProjectForm";

export const metadata = {
  title: 'Home',
  description: 'Home Desc',
}

export default async function Home() {
  return (
    <Flex gap="2" width={ "100%" } align="center" direction="column">
      <Heading>Add New Project</Heading>
      <AddProjectForm/>
    </Flex>
  )
}

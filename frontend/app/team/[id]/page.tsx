import React from 'react';
import { Flex, Heading } from "@radix-ui/themes";

type Props = { params: { id: number } }
const Project = ({params}: Props) => {
  return (
    <Flex justify={"center"}>
      <Heading size={ "4" } mt={ "4" } mb={ "2" }>Team Member {params.id}</Heading>
    </Flex>
  );
};

export default Project;
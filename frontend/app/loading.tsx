'use client'
import React from 'react';
import { Box } from "@radix-ui/themes";
import Image from "next/image";

const Loading = () => {
  return (
    <Box position={ "fixed" } bottom={ '0' } style={ { padding: '10px' } } right={ '0' }>
      <Image src={'/loader.svg'} alt={'loading'} width={40} height={40}/>
    </Box>
  )
    ;
};

export default Loading;

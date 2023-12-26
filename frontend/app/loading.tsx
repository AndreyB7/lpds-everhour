import React from 'react';
import { Box } from "@radix-ui/themes";

const Loading = () => {
  return (
    <Box position={"absolute"} top={'0'} style={{padding: '0px 5px'}} right={'0'}>
      Loading...
    </Box>
  );
};

export default Loading;

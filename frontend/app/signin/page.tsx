
import { Box, Flex, Heading } from "@radix-ui/themes";
import { GoogleButton } from "@/app/signin/GoogleButton";

export default async function Signin() {
  return (
    <Flex gap={ "2" } direction={ "column" } align={ "center" }>
      <Box p={"4"} className={"borderBox"}>
        <Heading align={"center"} mb={"4"}>Sign in</Heading>
        <GoogleButton/>
      </Box>
    </Flex>
  );
}
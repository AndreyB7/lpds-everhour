import { Container, Flex, Heading } from "@radix-ui/themes";
import { GoogleButton } from "@/app/signin/GoogleButton";

export default async function Signin() {
  return (
    <Container p={ "2" }>
      <Flex gap={ "2" } direction={ "column" } align={ "center" }>
        <Flex p={ "4" } className={ "borderBox" } direction={ "column" } justify={ "center" }>
          <Heading align={ "center" } mb={ "4" }>Sign in</Heading>
          <GoogleButton/>
        </Flex>
      </Flex>
    </Container>
  );
}
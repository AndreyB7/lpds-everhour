'use client'
import { useEffect } from 'react'
import { Box, Button, Container, Flex, Heading } from "@radix-ui/themes";

export default function Error({ error, reset }: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <Container size={ "1" } my={ "4" }>
      <Flex gap={ "2" } justify={ "center" } align={"center"} direction={ "column" }>
        <Heading align={ "center" }>Something went wrong...</Heading>
        <Box>
          <Button onClick={ () => reset() }>
            Try again
          </Button>
        </Box>
      </Flex>
    </Container>
  )
}
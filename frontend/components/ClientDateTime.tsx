'use client'
import { Text } from "@radix-ui/themes";
import * as React from "react";

export const ClientDateTime = ({ date }: {date: string | undefined} ) => (
  <Text size={ '1' }>Last refreshed: { date ? new Date(date).toLocaleString() : 'ND' }</Text>
)
import React from 'react';
import { Flex, Heading, Text } from "@radix-ui/themes";
import { ClientDateTime } from "@/components/ClientDateTime";
import { tMonitoring } from "../../types/types";

type Props = {
  data:tMonitoring
}
const MonitoringCard = ({data}: Props) => {
  return (
    <Flex className={ "borderBox" } p={ "2" } key={ data.slug } direction={ "column" }>
      <Heading size={ '3' }>{ data.fullName }</Heading>
      <hr/>
      <Text>Limit: { data.fullLimit }</Text>
      <Text>Progress: { data.timeTotal } ({ data.percent }%)</Text>
      <hr/>
      <ClientDateTime date={ data?.time }/>
    </Flex>
  );
};

export default MonitoringCard;
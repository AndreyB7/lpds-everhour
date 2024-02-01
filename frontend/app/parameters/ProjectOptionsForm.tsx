'use client'
import React, { useState } from 'react';
import { Flex, Heading, Text } from "@radix-ui/themes";
import { projectFormState, tProject } from "../../../types/types";
import { actionUpdateParams } from "@/serverActions/actions";
import { useFormState } from "react-dom";
import Form, { Field } from "@/components/Form";

type Props = {
  projects: tProject[]
}

const initialState = {
  message: '',
  errors: {},
}
const ProjectOptionsForm = ({ projects }: Props) => {

  const currentProject = projects[0]

  const [state, formAction] = useFormState<projectFormState, FormData>(actionUpdateParams, initialState)

  const fields: Field[] = [
    {
      label: 'Project Short Name',
      value: currentProject.shortName,
      name: 'shortName',
      error: state?.errors?.shortName?.join(', '),
      type: 'text',
      readOnly: true
    },
    {
      label: 'Project Everhour ID',
      value: currentProject.everhourId,
      name: 'everhourId',
      error: state?.errors?.everhourId?.join(', '),
      type: 'text'
    },
    {
      label: 'Project time limit in hours',
      value: currentProject.fullLimit.toString(),
      name: 'fullLimit',
      error: state?.errors?.fullLimit?.join(', '),
      type: 'number'
    },
    {
      label: 'Notification Emails (Separate with comma)',
      value: currentProject.emailNotify,
      name: 'emailNotify',
      error: state?.errors?.emailNotify?.join(', '),
      type: 'text'
    },
    {
      label: 'Slack WebHook URL',
      value: currentProject.slackChatWebHook,
      name: 'slackChatWebHook',
      error: state?.errors?.slackChatWebHook?.join(', '),
      type: 'text'
    }
  ]

  return (
        <Flex px={ "5" } py={ "4" } className={ 'borderBox' } align={"center"} style={ { flex: 1, minWidth: 350 } }
              direction={ "column" } grow={ '1' }>
          <Heading size={ "6" } mb={ "4" }>Parameters { currentProject.shortName }</Heading>
          <Form fields={fields} formAction={formAction} submitText={'UPDATE'}/>
          { state?.message && <Flex justify={ "center" }><Text>{ state.message }</Text></Flex> }
        </Flex>
  );
};

export default ProjectOptionsForm;
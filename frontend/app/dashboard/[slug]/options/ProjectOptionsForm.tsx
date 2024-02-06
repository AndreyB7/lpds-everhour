'use client'
import { Flex, Heading, Text } from "@radix-ui/themes";
import { Project, projectFormState } from "../../../../../types/types";
import { actionSetProjectOptions } from "@/serverActions/actions";
import { useFormState } from "react-dom";
import Form, { Field } from "@/components/Form/Form";

type Props = {
  project: Project
}

const initialState = {
  message: '',
  errors: {},
}
const ProjectOptionsForm = ({ project }: Props) => {

  const [state, formAction] = useFormState<projectFormState, FormData>(actionSetProjectOptions, initialState)

  const fields: Field[] = [
    {
      label: 'Project Slug',
      value: project.slug,
      name: 'slug',
      error: state?.errors?.slug?.join(', '),
      type: 'text',
      readOnly: true
    },
    {
      label: 'Project Short Name',
      value: project.shortName,
      name: 'shortName',
      error: state?.errors?.shortName?.join(', '),
      type: 'text',
    },
    {
      label: 'Project time limit in hours',
      value: project.fullLimit ? project.fullLimit.toString() : '0',
      name: 'fullLimit',
      error: state?.errors?.fullLimit?.join(', '),
      type: 'number'
    },
    {
      label: 'Time Tracking Type',
      value: project.type,
      name: 'type',
      error: state?.errors?.type?.join(', '),
      type: 'select',
      options: ['Retainer', 'Project']
    },
    {
      label: 'Project Full Name',
      value: project.fullName,
      name: 'fullName',
      error: state?.errors?.fullName?.join(', '),
      type: 'text',
    },
    {
      label: 'Project Everhour ID',
      value: project.everhourId,
      name: 'everhourId',
      error: state?.errors?.everhourId?.join(', '),
      type: 'text'
    },
    {
      label: 'Notification Emails (Separate with comma)',
      value: project.emailNotify,
      name: 'emailNotify',
      error: state?.errors?.emailNotify?.join(', '),
      type: 'text'
    },
    {
      label: 'Slack WebHook URL',
      value: project.slackChatWebHook,
      name: 'slackChatWebHook',
      error: state?.errors?.slackChatWebHook?.join(', '),
      type: 'text'
    },
    {
      label: 'Project ID',
      value: project.id,
      name: 'id',
      error: state?.errors?.id?.join(', '),
      type: 'text',
      readOnly: true,
    }
  ]

  return (
        <Flex px={ "5" } py={ "4" } className={ 'borderBox' } align={"center"} style={ { flex: 1, minWidth: 350 } }
              direction={ "column" } grow={ '1' }>
          <Heading size={ "6" } mb={ "4" }>{ project.shortName } Options</Heading>
          <Form fields={fields} formAction={formAction} submitText={'UPDATE'}/>
          { state?.message && <Flex justify={ "center" }><Text>{ state.message }</Text></Flex> }
        </Flex>
  );
};

export default ProjectOptionsForm;
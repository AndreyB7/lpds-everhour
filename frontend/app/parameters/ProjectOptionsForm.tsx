'use client'
import React, { useState } from 'react';
import { Button, Flex, Heading, Text, TextField } from "@radix-ui/themes";
import { projectFormState, tProject } from "../../../types/types";
import * as Label from "@radix-ui/react-label"
import { actionUpdateParams } from "@/app/actions";
import SubmitButton from "@/app/parameters/SubmitButton";
import { useFormState } from "react-dom";

type Props = {
  projects: tProject[]
}

const initialState = {
  message: '',
  errors: {},
}
const ProjectOptionsForm = ({ projects }: Props) => {

  const [currentProject, setCurrentProject] = useState<tProject>(projects[0])

  const [state, formAction] = useFormState<projectFormState, FormData>(actionUpdateParams, initialState)

  const selectProject = (project: tProject) => {
    setCurrentProject(project)
    formAction(new FormData())
  }

  const fields = [
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
      value: currentProject.fullLimit,
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
    <Flex gap={ "2" } direction={ "column" } align={'center'}>
      <Heading size={ "4" } mt={ "4" } mb={ "2" }>Parameters { currentProject.shortName }</Heading>
      <Flex gap={ "2" } width={"100%"}>
        <Flex gap={ "2" } direction={ "column" } style={{width:'25%'}}>
          <Text>Projects:</Text>
          { projects.map(project =>
            <Button key={ project.shortName }
                    className={ project.shortName === currentProject.shortName ? 'current' : '' }
                    onClick={ () => selectProject(project) }>{ project.shortName }</Button>) }
          <Button disabled={true}>ADD NEW</Button>
        </Flex>
        <Flex px={ "5" } py={ "4" } className={ 'borderBox' } width={ '100%' } direction={"column"} grow={'1'}>
          <form className={ "rt-Flex rt-r-display-flex rt-r-fd-column rt-r-jc-start rt-r-gap-4 rt-r-w-100%" }
                action={ formAction }>
            { fields.map(field =>
              <Label.Root key={ field.value } htmlFor={ field.name } style={ { position: 'relative' } }>
                { field.label }
                <TextField.Input mt={ "1" } type={ field.type } name={ field.name }
                                 readOnly={ field?.readOnly }
                                 defaultValue={ field.value } className={ field.error?.length ? 'fieldError' : '' }
                />
                <Flex position={ "absolute" } translate={ "yes" }>
                  <Text size={ '1' } color={ 'ruby' }>{ field.error }</Text>
                </Flex>
              </Label.Root>
            ) }
            <SubmitButton text={ "UPDATE" }/>
          </form>
          { state?.message && <Flex justify={ "center" }><Text>{ state.message }</Text></Flex> }
        </Flex>
        <Flex style={{width:'25%'}}></Flex>
      </Flex>
    </Flex>
  );
};

export default ProjectOptionsForm;
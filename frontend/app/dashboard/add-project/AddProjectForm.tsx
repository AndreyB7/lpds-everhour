'use client'
import { createProjectFormState } from "@/../types/types";
import Form, { Field } from "@/components/Form/Form";
import React from "react";
import { useFormState } from "react-dom";
import { addProjectFormAction } from "@/serverActions/actions";
import { Flex, Heading, Text } from "@radix-ui/themes";

const initialState = {
  message: '',
  errors: {},
}

export default function AddProjectForm() {
  const [state, formAction] = useFormState<createProjectFormState, FormData>(addProjectFormAction, initialState)
  const fields: Field[] = [
    {
      label: 'Slug (unique)',
      value: '',
      name: 'slug',
      error: state?.errors?.slug?.join(', '),
      type: 'text',
    },
    {
      label: 'Short Name',
      value: '',
      name: 'shortName',
      error: state?.errors?.shortName?.join(', '),
      type: 'text'
    },
    {
      label: 'Project Title',
      value: '',
      name: 'fullName',
      error: state?.errors?.fullName?.join(', '),
      type: 'text'
    },
    {
      label: 'Time Tracking Type',
      value: 'Project',
      name: 'type',
      error: state?.errors?.type?.join(', '),
      type: 'select',
      options: ['Retainer', 'Project']
    },
  ]
  if (state.errors) {
    console.log(state.errors)
  }
  return (
    <Flex px={ "5" } py={ "5" } className={ 'borderBox' } align={"center"} width={"100%"} style={ { flex: 1, minWidth: 350 } }
          direction={ "column" } grow={ '1' }>
      <Heading size={ "6" } mb={ "4" }>Add New Project</Heading>
      <Form fields={ fields } formAction={ formAction } submitText={ 'CREATE' }/>
      { state?.message && <Flex justify={ "center" }><Text>{ state.message }</Text></Flex> }
    </Flex>
  );
}
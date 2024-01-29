'use client'
import { createProjectFormState } from "@/../types/types";
import Form, { Field } from "@/components/Form";
import React from "react";
import { useFormState } from "react-dom";
import { addProjectFormAction } from "@/app/actions";

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
  ]
  return (
    <Form fields={ fields } formAction={ formAction } submitText={ 'CREATE' }/>
  );
}
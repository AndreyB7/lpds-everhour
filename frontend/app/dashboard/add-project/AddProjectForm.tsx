'use client'
import React from 'react';
import { Button } from "@radix-ui/themes";
import { Project } from "@/../types/types";

const AddProjectForm = () => {
  const handelAddProject = async () => {
    const data: Project = {
      shortName: 'SVT',
      fullName: 'Saviynt'
    }
    await fetch(`${ process.env.NEXT_PUBLIC_API_URL }/addproject`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    })
  }
  const pending = false;
  return (
    <div>
      <Button onClick={ handelAddProject } my={ "2" }
              disabled={ pending }>{ pending ? 'PENDING...' : 'ADD PROJECT' }</Button>
    </div>
  );
};

export default AddProjectForm;
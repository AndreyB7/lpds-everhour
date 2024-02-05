'use client'
import React from 'react';
import { Button } from "@radix-ui/themes";
import { useRouter } from "next/navigation";

type Props = {
    slug: string
}

export default function DeleteProjectButton ({slug}:Props) {
  const { push } = useRouter();
  const handleDeleteProject = async () => {
    const res: Response = await fetch(`/api/project/${ slug }`, {method: 'DELETE'})
    if (!res.ok) {
      console.log(`Failed to fetch data ${ JSON.stringify(await res.json()) }`);
      throw new Error(`Failed to fetch data`);
    }
    push('/dashboard')
  }
  return (
    <Button size={"2"} color={"red"} variant={"soft"} onClick={handleDeleteProject}>
      Delete Project
    </Button>
  );
};

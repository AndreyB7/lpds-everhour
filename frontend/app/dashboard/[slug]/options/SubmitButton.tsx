'use client'
import React from 'react';
import { Button } from "@radix-ui/themes";
import { useFormStatus } from "react-dom";

const SubmitButton = ({text}:{text: string}) => {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" size={"3"} mt={"4"} mb={ "2" } disabled={pending}>{pending ? 'PENDING...' : text}</Button>
  );
};

export default SubmitButton;
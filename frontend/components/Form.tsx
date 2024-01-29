import React from 'react';
import * as Label from "@radix-ui/react-label";
import { Flex, Text, TextField } from "@radix-ui/themes";
import SubmitButton from "@/app/parameters/SubmitButton";

type Props = {
  formAction: (payload: FormData) => void,
  fields: Field[],
  submitText: string,
}

export type Field = {
  label: string;
  value: string,
  name: string,
  error: string | undefined,
  type: 'text' | 'number',
  readOnly?: boolean
}
const Form = ({ fields, formAction, submitText = 'Submit' }: Props) => {
  return (
    <form className={ "rt-Flex rt-r-display-flex rt-r-fd-column rt-r-jc-start rt-r-gap-4 rt-r-w-100%" }
          action={ formAction }>
      { fields.map(field =>
        <Label.Root key={ field.name } htmlFor={ field.name } style={ { position: 'relative' } }>
          { field.label }
          <TextField.Input
            key={ field.name }
            mt={ "1" }
            type={ field.type }
            name={ field.name }
            readOnly={ field?.readOnly }
            defaultValue={ field.value }
            className={ field.error?.length ? 'fieldError' : '' }
          />
          <Flex position={ "absolute" } translate={ "yes" }>
            <Text size={ '1' } color={ 'ruby' }>{ field.error }</Text>
          </Flex>
        </Label.Root>
      ) }
      <SubmitButton text={ submitText }/>
    </form>
  );
};

export default Form;
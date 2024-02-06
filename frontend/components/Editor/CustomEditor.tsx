"use client"

import dynamic from "next/dynamic";
import { useState } from "react";
import { Button, Flex } from "@radix-ui/themes";
import Blocks from 'editorjs-blocks-react-renderer';
import { Checklist } from "@/components/Editor/Checklist/ChecklistRenderer";

const Editor = dynamic(() => import("./Editor"), {
  ssr: false,
});

export type EditorJsData = {
  time: number,
  blocks: any[],
  version: string,
}

type Props = {
  slug: string;
  initData: EditorJsData
}

export default function CustomEditor({ initData, slug }: Props) {
  const [data, setData] = useState(initData)
  const [isEditMode, setIsEditMode] = useState(false);

  const handleSave = async () => {
    setIsEditMode(!isEditMode);
    const res = await fetch(`/api/page/${ slug }`, {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  return (
    <div className={ 'editor-wrapper' }>
      <Flex className={ "edit-toggle" } justify={ "end" }>
        <Button size={ "1" } onClick={ handleSave }>{ isEditMode ? 'Save' : 'Edit' }</Button>
      </Flex>
      { isEditMode ?
        <Editor
          data={ data }
          onChange={ setData }
          holder={ 'editorjs-container' }
        /> :
        <Blocks data={ data } renderers={ { checklist: Checklist } } config={ {
          header: {
            className: "heading"
          }
        } }/>
      }
    </div>
  );
};
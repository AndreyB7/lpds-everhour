"use client"

import dynamic from "next/dynamic";
import { useState } from "react";
import PreviewRenderer from "@/components/Editor/PreviewRenderer";
import { Button } from "@radix-ui/themes";

const Editor = dynamic(() => import("./Editor"), {
  ssr: false,
});

const initData = {
  "time": 1706881094690,
  "blocks": [
    {
      "id": "M-2b-QSjVA",
      "type": "header",
      "data": {
        "text": "Saved title 1",
        "level": 3
      }
    },
    {
      "id": "UZ-a64LHpI",
      "type": "paragraph",
      "data": {
        "text": "Paragraph 1 saved text"
      }
    },
    {
      "id": "Ky-00-EdUp",
      "type": "paragraph",
      "data": {
        "text": "Paragraph 2 saved text"
      }
    }
  ],
  "version": "2.29.0"
}

export default function CustomEditor() {
  const [data, setData] = useState(initData)
  const [isEditMode, setIsEditMode] = useState(false);
  return (
    <>
      <Editor
        data={ data }
        onChange={ setData }
        holder="editorjs-container"
      />
      {/*{ data && <PreviewRenderer data={ data }/> }*/}
    </>
  );
};
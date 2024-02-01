"use client"

import dynamic from "next/dynamic";
import { useState } from "react";

// import PreviewRenderer from "@/components/PreviewRenderer";

const Editor = dynamic(() => import("./Editor"), {
  ssr: false,
});

export default function CustomEditor() {
  const [data, setData] = useState();
  return (
    <Editor
      data={ data }
      onChange={ setData }
      holder="editorjs-container"
    />
  );
};
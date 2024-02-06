import React, { useEffect, useRef } from "react";
import EditorJs from "@editorjs/editorjs";
import { EDITOR_TOOLS } from "./tools/tools";

export default function Editor({ data, onChange, holder }) {
  //add a reference to editor
  const ref = useRef();

  //initialize editorjs
  useEffect(() => {
    //initialize editor if we don't have a reference
    if (!ref.current) {
      ref.current = new EditorJs({
        holder: holder,
        tools: EDITOR_TOOLS,
        data,
        async onChange(api, event) {
          const data = await api.saver.save();
          onChange(data);
        },
      })
    }

    //add a return function handle cleanup
    return () => {
      if (ref.current && ref.current.destroy) {
        ref.current.destroy();
      }
    };
  }, []);

  return <>
    <div id={ holder }/>
  </>;
};

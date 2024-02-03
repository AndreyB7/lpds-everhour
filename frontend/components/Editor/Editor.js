import React, { useEffect, useRef, useState } from "react";
import EditorJS from "@editorjs/editorjs";
import { EDITOR_TOOLS } from "./EditorTools";
import { Button } from "@radix-ui/themes";

export default function Editor({ data, onChange, holder }) {
  //add a reference to editor
  const ref = useRef();
  const [ isViewMode, setIsViewMode ] = useState(false)

  //initialize editorjs
  useEffect(() => {
    //initialize editor if we don't have a reference
    if (!ref.current) {
      ref.current = new EditorJS({
        readOnly: isViewMode,
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

  const handleEditToggle = () => {
    console.log('toggle')
    console.log(ref)
    if (ref.current && ref.current.toggle) {
      console.log('toggle ref')
      ref.current.toggle?.()
      setIsViewMode(!isViewMode)
    }
  }

  return <>
    <Button onClick={ handleEditToggle }>{ isViewMode ? 'Edit' : 'View' }</Button>
    <div id={ holder }/>
  </>;
};

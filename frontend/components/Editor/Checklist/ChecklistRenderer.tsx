import { RenderFn } from "editorjs-blocks-react-renderer";
import HTMLReactParser from "html-react-parser";

export const Checklist: RenderFn<{
  items: {
    text: string,
    checked: boolean
  }[]
}> = ({
        data, className = ""
      }) => {

  return (
    <>
      { data?.items.map((item, i) => (
        <p key={ i } className={ className }>
          <label>
            <input type="checkbox" checked={ item.checked } readOnly={ true }/>
            { HTMLReactParser(item.text) }
          </label>
        </p>
      )) }
    </>
  )
}
import brace from "brace";
import "brace/mode/coffee";
import "brace/theme/solarized_dark";
import * as React from "react";
import AceEditor from "react-ace";

const donothing = (a => null)(brace);

export type EditorProps = {
  code: string;
  onChange: (code: string) => void;
};
export const Editor = ({ code, onChange }: EditorProps) => {
  return (
    <AceEditor
      name="code"
      value={code}
      onChange={onChange}
      theme="solarized_dark"
      editorProps={{ $blockScrolling: true }}
    />
  );
};

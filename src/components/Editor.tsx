import * as React from "react";
import { js_beautify } from "js-beautify";
import MonacoEditor from "react-monaco-editor";

export type EditorProps = {
  format?: boolean;
  code: string;
  readonly?: boolean;
  onChange?: (code: string) => void;
};
export const Editor = ({ code, onChange, format, readonly }: EditorProps) => {
  return (
    <MonacoEditor
      width="100%"
      height="300"
      language="javascript"
      theme="vs-dark"
      value={format ? js_beautify(code) : code}
      options={{ formatOnPaste: true, formatOnType: true }}
      onChange={!readonly ? onChange : undefined}
    />
  );
};

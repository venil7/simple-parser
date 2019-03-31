// import * as prettier from "prettier";
import * as React from "react";
import MonacoEditor from "react-monaco-editor";

export type EditorProps = {
  format?: boolean;
  code: string;
  onChange?: (code: string) => void;
};
export const Editor = ({ code, onChange, format }: EditorProps) => {
  return (
    <MonacoEditor
      width="100%"
      height="300"
      language="typescript"
      theme="vs-dark"
      value={code}
      options={{ formatOnPaste: true, formatOnType: true }}
      onChange={onChange}
    />
  );
};

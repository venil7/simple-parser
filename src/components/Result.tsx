import * as React from "react";
import { useState } from "react";
import { createContext, run } from "../interpreter";
import { Ast } from "../parser";

export type ResultProps = {
  ast: Ast;
};
export const Result = (props: ResultProps) => {
  const [res, setRes] = useState("");
  const runAst = () => {
    try {
      const [result] = run(props.ast, createContext());
      setRes(result.toString());
    } catch (e) {
      setRes(e.message);
    }
  };
  return (
    <>
      <button onClick={runAst}>RUN</button>
      <span>{res}</span>
    </>
  );
};

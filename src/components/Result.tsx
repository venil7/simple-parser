import * as React from "react";
import { useState } from "react";
import { Popover, PopoverBody } from "reactstrap";
import Button from "reactstrap/lib/Button";
import { createContext, run } from "../interpreter";
import { Ast } from "../parser";

export type ResultProps = {
  ast: Ast;
  js: string;
};
export const Result = (props: ResultProps) => {
  const [vmRes, setVmRes] = useState("");
  const [jsRes, setJsRes] = useState("");
  const runAst = () => {
    try {
      const [result] = run(props.ast, createContext());
      setVmRes(result.toString());
    } catch (e) {
      setVmRes(e.message);
    }
  };
  const runJs = () => {
    try {
      const res = eval(props.js);
      setJsRes(res.toString());
    } catch (e) {
      setJsRes(e.message);
    }
  };
  return (
    <>
      <Button id="runvm" onClick={runAst}>
        Run VM
      </Button>
      <Popover
        placement="bottom"
        isOpen={!!vmRes}
        target="runvm"
        toggle={() => setVmRes("")}
      >
        <PopoverBody>{vmRes}</PopoverBody>
      </Popover>

      <Button id="runjs" onClick={runJs}>
        Run JS
      </Button>
      <Popover
        placement="bottom"
        isOpen={!!jsRes}
        target="runjs"
        toggle={() => setJsRes("")}
      >
        <PopoverBody>{jsRes}</PopoverBody>
      </Popover>
    </>
  );
};

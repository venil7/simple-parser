import * as React from "react";
import { useState } from "react";
import "react-treeview/react-treeview.css";
import { Col, Container, Row } from "reactstrap";
import { Ast, Parser } from "../parser";
import { AstViewer } from "./AstViewer";
import { Editor } from "./Editor";
import { Result } from "./Result";

const initCode = `
# fibonacci
fib = lambda (x): {
  if x < 2 then {1} else {
      fib(x-2) + fib(x-1);
  };
};
fib(7);

# recursive odd/even
even = lambda (x) : if (x == 0) then true else odd(x-1);
odd = lambda (x) : if (x == 0) then false else even(x-1);

odd(500);
`;

const parse = (code: string): { ast: Ast; error: string } => {
  let ast, error;
  try {
    ast = new Parser(code).parseTopLevel();
  } catch (e) {
    error = (e as Error).message;
  }
  return { ast, error };
};

export const App = () => {
  const [code, setCode] = useState(initCode);
  const { ast, error } = parse(code);
  return (
    <Container>
      <Row>
        <Col sm={6}>
          <Editor code={code} onChange={setCode} />
        </Col>
        <Col sm={4}>
          <AstViewer ast={ast} error={error} />
        </Col>
        <Col sm={2}>
          <Result ast={ast} />
        </Col>
      </Row>
    </Container>
  );
};

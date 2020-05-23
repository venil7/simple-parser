import * as React from "react";
import { useState } from "react";
import "react-treeview/react-treeview.css";
import { Col, Container, Row } from "reactstrap";
import Button from "reactstrap/lib/Button";
import { compile } from "../compiler";
import { Ast, Parser } from "../parser";
import "../style.css";
import { AstViewer } from "./AstViewer";
import { Editor } from "./Editor";
import { Result } from "./Result";

const fibonacciExample = `
# fibonacci
let fib = lambda (x): {
  if x < 2 then 1 else {
      fib(x-2) + fib(x-1);
  };
};
fib(7);
`;

const oddEvenExample = `
# recursive odd/even
let even = lambda (x) : if (x == 0) then true else odd(x-1);
let odd = lambda (x) : if (x == 0) then false else even(x-1);

odd(500);
`;

const parse = (code: string): { ast: Ast | null; error: string } => {
  try {
    const ast = new Parser(code).parseTopLevel();
    return { ast, error: "" };
  } catch (e) {
    const error = (e as Error).message;
    return { ast: null, error };
  }
};

export const App = () => {
  const [code, setCode] = useState(fibonacciExample);
  const { ast, error } = parse(code);
  const js = !ast ? "" : compile(ast);
  return (
    <Container>
      <Row>
        <Col sm={6}>
          <h3>Simple lang</h3>
          <Editor code={code} onChange={setCode} />
          <Button color="warning" onClick={() => setCode(fibonacciExample)}>
            Fibonacci
          </Button>
          <Button color="info" onClick={() => setCode(oddEvenExample)}>
            Recursive odd/even
          </Button>
        </Col>
        <Col sm={6}>
          <h3>Compiled JavaScript</h3>
          <Editor code={js} readonly format />
          <Result ast={ast} js={js} />
        </Col>
      </Row>
      <Row>
        <Col>
          <h3>AST Preview</h3>
          <AstViewer ast={ast} error={error} />
        </Col>
      </Row>
    </Container>
  );
};

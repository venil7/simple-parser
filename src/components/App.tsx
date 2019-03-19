import * as React from "react";
import { useState } from "react";
import AceEditor from "react-ace";
import "react-treeview/react-treeview.css";
import { Col, Container, Row } from "reactstrap";
import { Ast, Parser } from "../parser";
import { AstViewer } from "./AstViewer";

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
  const [code, setCode] = useState("");
  const { ast, error } = parse(code);
  return (
    <Container>
      <Row>
        <Col sm={6}>
          <AceEditor
            mode="java"
            value={code}
            theme="github"
            onChange={setCode}
            name="UNIQUE_ID_OF_DIV"
            editorProps={{ $blockScrolling: true }}
          />
        </Col>
        <Col sm={6}>
          <AstViewer ast={ast} error={error} />
        </Col>
      </Row>
    </Container>
  );
};

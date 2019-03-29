import * as React from "react";
import TreeView from "react-treeview";
import {
  Ast,
  AstAssign,
  AstBinary,
  AstBool,
  AstCall,
  AstIf,
  AstLambda,
  AstNode,
  AstNum,
  AstProg,
  AstStr,
  AstVar
} from "../parser";

export const astNode = (node: Ast) => {
  const id = Math.random().toString();
  switch (node.type) {
    case AstNode.Bool:
    case AstNode.Num:
    case AstNode.Var:
      return <AstTerminalNode node={node} id={id} />;
    case AstNode.Prog:
      return <AstProgNode node={node} id={id} />;
    case AstNode.Lambda:
      return <AstLambdaNode node={node} id={id} />;
    case AstNode.If:
      return <AstIfNode node={node} id={id} />;
    case AstNode.Call:
      return <AstCallNode node={node} id={id} />;
    case AstNode.Binary:
    case AstNode.Assign:
      return <AstBinaryNode node={node} id={id} />;
  }
};

export type AstViewerProps = {
  ast: Ast;
  error: string;
};

export type AstNodeProps<T extends Ast> = {
  id: string;
  node: T;
};
const AstTerminalNode = ({
  id,
  node
}: AstNodeProps<AstNum | AstBool | AstStr | AstVar>) => {
  const label = `${node.type}: ${node.value}`;
  return <TreeView key={id} nodeLabel={label} />;
};

const AstBinaryNode = ({ id, node }: AstNodeProps<AstAssign | AstBinary>) => {
  let label;
  switch (node.type) {
    case AstNode.Assign:
      label = node.declare ? "Declare (let)" : "Assign (=)";
      break;
    case AstNode.Binary:
      label = `Op (${node.op})`;
      break;
  }
  return (
    <TreeView key={id} nodeLabel={label}>
      {astNode(node.left)}
      {astNode(node.right)}
    </TreeView>
  );
};

const AstCallNode = ({ id, node }: AstNodeProps<AstCall>) => {
  return (
    <TreeView key={id} nodeLabel={node.type}>
      {astNode(node.func)}
      {node.args.map(astNode)}
    </TreeView>
  );
};
const AstProgNode = ({ id, node }: AstNodeProps<AstProg>) => {
  return (
    <TreeView key={id} nodeLabel={node.type}>
      {node.body.map(astNode)}
    </TreeView>
  );
};

const AstIfNode = ({ id, node }: AstNodeProps<AstIf>) => {
  return (
    <TreeView key={id} nodeLabel={node.type}>
      {astNode(node.cond)}
      {astNode(node.then)}
      {astNode(node.else)}
    </TreeView>
  );
};
const AstLambdaNode = ({ id, node }: AstNodeProps<AstLambda>) => {
  return (
    <TreeView key={id} nodeLabel={node.type}>
      <TreeView nodeLabel="args">{node.vars.map(astNode)}</TreeView>
      <TreeView nodeLabel="body">{astNode(node.body)}</TreeView>
    </TreeView>
  );
};
export const AstViewer = ({ ast, error }: AstViewerProps) => {
  return error ? <pre>{error}</pre> : astNode(ast);
};

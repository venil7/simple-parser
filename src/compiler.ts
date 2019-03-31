import { BinaryOp } from "./operator";
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
} from "./parser";

const allButLast = <T>(xs: T[]): T[] => {
  const [, ...ys] = [...xs].reverse();
  return [...ys].reverse();
};

const last = <T extends Ast>(xs: T[]): null | T => {
  if (xs.length) {
    const [x] = [...xs].reverse();
    return x;
  }
  return null;
};

const compileNum = (ast: AstNum) => `${ast.value}`;
const compileStr = (ast: AstStr) => `"${ast.value}"`;
const compileBool = (ast: AstBool) => (ast.value ? "true" : "false");
const compileVar = (ast: AstVar) => `${ast.value}`;
const compileLastInBlock = (ast: Ast | null): string => {
  if (ast === null) return "";
  if (ast.type == AstNode.Assign) {
    return `${compile(ast)}\n ${compileLastInBlock(ast.left)}`;
  } else {
    return `return ${compile(ast)};`;
  }
};
const compileSelfInvokingFunc = (ast: AstProg) => {
  let code = "";
  if (ast.body.length === 1) {
    code = compileLastInBlock(ast.body[0]);
  }
  const bodyAst = allButLast(ast.body);
  const lastAst = last(ast.body);
  code = `${bodyAst
    .map(ast => `${compile(ast)};\n`)
    .join("")}${compileLastInBlock(lastAst)}`;
  return `(function(){ ${code} }())`;
};

const compileAssign = (ast: AstAssign) =>
  ast.declare
    ? `var ${compile(ast.left)} = ${compile(ast.right)}`
    : `${compile(ast.left)} = ${compile(ast.right)}`;

const compileBinary = (ast: AstBinary) => {
  switch (ast.op) {
    case BinaryOp.Power:
      return `Math.pow(${compile(ast.left)}, ${compile(ast.right)})`;
    case BinaryOp.Eq:
      return `${compile(ast.left)} === ${compile(ast.right)}`;
    case BinaryOp.NotEq:
      return `${compile(ast.left)} !== ${compile(ast.right)}`;
    default:
      return `${compile(ast.left)} ${ast.op} ${compile(ast.right)}`;
  }
};
const compileIf = (ast: AstIf) =>
  `(${compile(ast.cond)}) ? ${compile(ast.then)} : ${compile(ast.else)}`;
const compileLambda = (ast: AstLambda) =>
  `function (${ast.vars.map(compileVar).join(",")}) {${compileLambdaBody(
    ast.body
  )}}`;
const compileLambdaBody = (ast: Ast) =>
  ast.type === AstNode.Prog ? compile(ast) : `return ${compile(ast)};`;
const compileCall = (ast: AstCall) =>
  `${compile(ast.func)}(${ast.args.map(compile).join(",")})`;

export const compile = (ast: Ast): string => {
  switch (ast.type) {
    case AstNode.Num:
      return compileNum(ast);
    case AstNode.Str:
      return compileStr(ast);
    case AstNode.Bool:
      return compileBool(ast);
    case AstNode.Var:
      return compileVar(ast);
    case AstNode.Prog:
      return compileSelfInvokingFunc(ast);
    case AstNode.Assign:
      return compileAssign(ast);
    case AstNode.Binary:
      return compileBinary(ast);
    case AstNode.If:
      return compileIf(ast);
    case AstNode.Lambda:
      return compileLambda(ast);
    case AstNode.Call:
      return compileCall(ast);
  }
};

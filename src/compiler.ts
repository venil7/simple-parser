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
  const [, ...ys] = xs.reverse();
  return ys.reverse();
};

const last = <T extends Ast>(xs: T[]): null | T => {
  if (xs.length) {
    const [x] = xs.reverse();
    return x;
  }
  return null;
};

const compileNum = (ast: AstNum) => `${ast.value}`;
const compileStr = (ast: AstStr) => `"${ast.value}"`;
const compileBool = (ast: AstBool) => (ast.value ? "true" : "false");
const compileVar = (ast: AstVar) => `var ${ast.value}`;
const compileProg = (ast: AstProg) => {
  if (ast.body.length === 1) {
    return compile(ast.body[0]);
  }
  const lastAst = last(ast.body);
  if (lastAst) {
    return `{\n${allButLast(ast.body)
      .map(compile)
      .join(";\n")} return ${compile(lastAst)}}\n`;
  }
  return "";
};
const compileAssign = (ast: AstAssign) =>
  `${compile(ast.left)} = ${compile(ast.right)}\n`;
const compileBinary = (ast: AstBinary) =>
  `${compile(ast.left)} ${ast.op} ${compile(ast.right)}\n`;
const compileIf = (ast: AstIf) =>
  `(${compile(ast.cond)}) ? ${compile(ast.then)} : ${compile(ast.else)}`;
const compileLambda = (ast: AstLambda) =>
  `function (${ast.vars.map(compileVar).join(",")}) {\n${compileLambdaBody(
    ast.body
  )}\n}`;
const compileLambdaBody = (ast: Ast) =>
  ast.type === AstNode.Prog ? compile(ast) : `return ${compile(ast)};\n`;
const compileCall = (ast: AstCall) =>
  `(${compile(ast.func)})(${ast.args.map(compile).join(",")})`;

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
      return compileProg(ast);
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

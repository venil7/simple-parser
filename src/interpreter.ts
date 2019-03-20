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

const runNum = (ast: AstNum, ctx: Context): RunResult<number> => [
  ast.value,
  ctx
];
const runStr = (ast: AstStr, ctx: Context): RunResult<string> => [
  ast.value,
  ctx
];
const runBool = (ast: AstBool, ctx: Context): RunResult<boolean> => [
  ast.value,
  ctx
];

type Value = number | string | boolean;
type Context = {
  parent: Context | null;
  vars: Map<string, Value | AstLambda>;
};

const getVar = (ctx: Context, name: string): Value | AstLambda => {
  if (ctx.vars.has(name)) {
    return ctx.vars.get(name);
  } else if (ctx.parent) {
    return getVar(ctx.parent, name);
  }
  throw Error(`Variable "${name}" is undefined`);
};

const setVar = (
  ctx: Context,
  name: string,
  val: Value | AstLambda
): Context => {
  ctx.vars.set(name, val);
  return ctx;
};

export type RunResult<T = Value | AstLambda> = [T, Context];
type PreVars = [string, Value | AstLambda][];

export const createContext = (
  parent: Context = null,
  vars: PreVars = []
): Context => ({
  parent,
  vars: new Map<string, Value | AstLambda>(vars)
});
type BinaryFunc<T extends Value | AstLambda, R = T> = (l: T, r: T) => R;

const zip = (names: string[], values: (Value | AstLambda)[]): PreVars => {
  if (names.length === values.length) {
    return names.map((name, idx) => [name, values[idx]]);
  }
  throw Error(`Argument mismatch`);
};
const createBinary = <T extends Value | AstLambda, R = T>(
  func: BinaryFunc<T, R>
) => (left: Ast, right: Ast, ctx: Context): RunResult => {
  const [l] = run(left, ctx);
  const [r] = run(right, ctx);
  const res = func(l as T, r as T);
  return [(res as unknown) as Value | AstLambda, ctx];
};

const runAddNum = createBinary<number>((l, r) => l + r);
const runSubNum = createBinary<number>((l, r) => l - r);
const runMulNum = createBinary<number>((l, r) => l * r);
const runDivNum = createBinary<number>((l, r) => l / r);
const runPowNum = createBinary<number>((l, r) => l ** r);

const runAndBool = createBinary<boolean>((l, r) => l && r);
const runOrBool = createBinary<boolean>((l, r) => l || r);

const runConcatStr = createBinary<string>((l, r) => l + r);

const runEq = createBinary<Value, boolean>((l, r) => l == r);
const runNotEq = createBinary<Value, boolean>((l, r) => l != r);
const runGreater = createBinary<number, boolean>((l, r) => l > r);
const runGreaterEq = createBinary<number, boolean>((l, r) => l >= r);
const runLess = createBinary<number, boolean>((l, r) => l < r);
const runLessEq = createBinary<number, boolean>((l, r) => l <= r);

const runIf = (ast: AstIf, ctx: Context): RunResult => {
  const [cond] = run(ast.cond, ctx);
  return cond ? run(ast.then, ctx) : run(ast.else, ctx);
};

const runSequence = (ast: Ast[], ctx: Context): RunResult => {
  return ast.reduce(([, _ctx], block) => run(block, _ctx), [false, ctx]);
};
const runProg = (ast: AstProg, ctx: Context): RunResult => {
  const progContext = createContext(ctx);
  const [result] = runSequence(ast.body, progContext);
  return [result, progContext.parent];
};

const runAdd = (left: Ast, right: Ast, ctx: Context): RunResult => {
  const [_left] = run(left, ctx);
  const [_right] = run(right, ctx);
  if (typeof _left === "number" && typeof _right === "number") {
    return [_left + _right, ctx];
  } else if (typeof _left === "string" && typeof _right === "string") {
    return [_left + _right, ctx];
  }
  throw Error(`Type mismatch: can't + ${_left} and ${_right}`);
};

const runAs = (t: string) => (ast: Ast, ctx: Context) => {
  const [res] = run(ast, ctx);
  if (typeof res === t) return res;
  throw Error(`Type mismatch: expected ${res} to be ${t}`);
};

const runAsNum = runAs("number");
const runAsStr = runAs("string");
const runAsBool = runAs("boolean");

const runBinary = (ast: AstBinary, ctx: Context): RunResult => {
  switch (ast.op) {
    case BinaryOp.Plus:
      return runAdd(ast.left, ast.right, ctx);
    case BinaryOp.Minus:
      return runSubNum(ast.left, ast.right, ctx);
    case BinaryOp.Mul:
      return runMulNum(ast.left, ast.right, ctx);
    case BinaryOp.Div:
      return runDivNum(ast.left, ast.right, ctx);
    case BinaryOp.Power:
      return runPowNum(ast.left, ast.right, ctx);
    case BinaryOp.Eq:
      return runEq(ast.left, ast.right, ctx);
    case BinaryOp.NotEq:
      return runNotEq(ast.left, ast.right, ctx);
    case BinaryOp.GT:
      return runGreater(ast.left, ast.right, ctx);
    case BinaryOp.GTE:
      return runGreaterEq(ast.left, ast.right, ctx);
    case BinaryOp.LT:
      return runLess(ast.left, ast.right, ctx);
    case BinaryOp.LTE:
      return runLessEq(ast.left, ast.right, ctx);
  }
};

const runVarName = (ast: AstVar, ctx: Context): RunResult<string> => [
  ast.value,
  ctx
];
const runVarValue = (ast: AstVar, ctx: Context): RunResult => {
  const name = ast.value;
  const value = getVar(ctx, name);
  return [value, ctx];
};
const runAssign = (ast: AstAssign, ctx: Context): RunResult => {
  const [name, ctx1] = runVarName(ast.left as AstVar, ctx);
  const [value, ctx2] = run(ast.right, ctx1);
  const ctx3 = setVar(ctx2, name, value);
  return [value, ctx3];
};

const runCall = (ast: AstCall, ctx: Context): RunResult => {
  const [func] = run(ast.func, ctx);
  const args = ast.args.map(arg => run(arg, ctx)).map(([arg, _]) => arg);
  let lambda: AstLambda;
  switch (typeof func) {
    case "string": {
      lambda = getVar(ctx, func) as AstLambda;
      break;
    }
    case "object": {
      lambda = func;
      break;
    }
    default:
      throw new Error(`${func} can not be invoked as function`);
  }
  const names = lambda.vars
    .map(varName => runVarName(varName, ctx))
    .map(([name]) => name);
  const lambdaContext = createContext(ctx, zip(names, args));
  const [result, _ctx] = runSequence(lambda.body, lambdaContext);
  return [result, _ctx.parent];
};
const runLambda = (ast: AstLambda, ctx: Context): RunResult => [ast, ctx];

export const run = (ast: Ast, ctx: Context): RunResult => {
  switch (ast.type) {
    case AstNode.Bool:
      return runBool(ast, ctx);
    case AstNode.Num:
      return runNum(ast, ctx);
    case AstNode.Str:
      return runStr(ast, ctx);
    case AstNode.Var:
      return runVarValue(ast, ctx);
    case AstNode.If:
      return runIf(ast, ctx);
    case AstNode.Lambda:
      return runLambda(ast, ctx);
    case AstNode.Call:
      return runCall(ast, ctx);
    case AstNode.Assign:
      return runAssign(ast, ctx);
    case AstNode.Binary:
      return runBinary(ast, ctx);
    case AstNode.Prog:
      return runProg(ast, ctx);
  }
};

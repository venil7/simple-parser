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
  AstVar,
} from "./parser";

type Value = number | string | boolean;
type Context = {
  parent: Context | null;
  vars: Map<string, Value | AstLambda>;
};
export type RunResult<T = Value | AstLambda> = [T, Context];
type PreVars = [string, Value | AstLambda][];
type BinaryFunc<T extends Value | AstLambda, R = T> = (l: T, r: T) => R;

class RunResultMonad {
  constructor(public runResult: (_: Context) => RunResult) {}

  public bind(func: (n: RunResult) => RunResultMonad): RunResultMonad {
    return new RunResultMonad((ctx: Context) => {
      const [val, ctx_] = this.runResult(ctx);
      return func([val, ctx_]).runResult(ctx_);
    });
  }

  public static return(result: RunResult): RunResultMonad {
    return new RunResultMonad((_: Context) => result);
  }
}

const runNum = (ast: AstNum, ctx: Context): RunResult<number> => [
  ast.value,
  ctx,
];
const runStr = (ast: AstStr, ctx: Context): RunResult<string> => [
  ast.value,
  ctx,
];
const runBool = (ast: AstBool, ctx: Context): RunResult<boolean> => [
  ast.value,
  ctx,
];

const getVar = (ctx: Context, name: string): Value | AstLambda => {
  if (ctx.vars.has(name)) {
    return ctx.vars.get(name) as Value | AstLambda;
  } else if (ctx.parent) {
    return getVar(ctx.parent, name);
  }
  throw new Error(`Variable ${name} is not declared`);
};

const declareVar = (
  ctx: Context,
  name: string,
  val: Value | AstLambda
): RunResult => {
  if (ctx.vars.has(name)) {
    throw new Error(`Variable ${name} is already declared in this scope`);
  }
  ctx.vars.set(name, val);
  return [val, ctx];
};
const setVar = (
  ctx: Context | null,
  name: string,
  val: Value | AstLambda
): RunResult => {
  if (!ctx) {
    throw new Error(`Variable ${name} is not declared`);
  }
  if (!ctx.vars.has(name)) {
    return setVar(ctx.parent, name, val);
  }
  return [val, ctx];
};

export const createContext = (
  parent: Context | null = null,
  vars: PreVars = []
): Context => ({
  parent,
  vars: new Map<string, Value | AstLambda>(vars),
});

const zip = (names: string[], values: (Value | AstLambda)[]): PreVars => {
  if (names.length === values.length) {
    return names.map((name, idx) => [name, values[idx]]);
  }
  throw Error(
    `${values.length} arguments provided where ${names.length} expected`
  );
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
  return [result, progContext.parent as Context];
};

const runAdd = (left: Ast, right: Ast, ctx: Context): RunResult => {
  const leftM = new RunResultMonad((c) => run(left, c));
  const rightM = new RunResultMonad((c) => run(right, c));
  const plusTypes = (a: Value | AstLambda, b: Value | AstLambda) =>
    (typeof a === "number" && typeof b === "number") ||
    (typeof a === "string" && typeof b === "string");

  return leftM
    .bind(([leftVal]) =>
      rightM.bind(([rightVal]) => {
        if (plusTypes(leftVal, rightVal))
          return RunResultMonad.return([
            (leftVal as number) + (rightVal as number),
            ctx,
          ]);
        else throw Error(`Type mismatch: can't + ${leftVal} and ${rightVal}`);
      })
    )
    .runResult(ctx);
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
  ctx,
];
const runVarValue = (ast: AstVar, ctx: Context): RunResult => {
  const name = ast.value;
  const value = getVar(ctx, name);
  return [value, ctx];
};
const runAssign = (ast: AstAssign, ctx: Context): RunResult => {
  const [name, ctx1] = runVarName(ast.left as AstVar, ctx);
  if (ctx1) {
    const [value, ctx2] = run(ast.right, ctx1);
    if (ctx2) {
      return ast.declare
        ? declareVar(ctx2, name, value)
        : setVar(ctx2, name, value);
    }
  }
  throw new Error(`Context is not defined`);
};

const runCall = (ast: AstCall, ctx: Context): RunResult => {
  const [func] = run(ast.func, ctx);
  const args = ast.args.map((arg) => run(arg, ctx)).map(([arg, _]) => arg);
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
    .map((varName) => runVarName(varName, ctx))
    .map(([name]) => name);
  const lambdaContext = createContext(ctx, zip(names, args));
  const [result, _ctx] = run(lambda.body, lambdaContext);
  return [result, _ctx.parent as Context];
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

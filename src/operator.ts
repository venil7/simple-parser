export enum BinaryOp {
  Plus = "+",
  Minus = "-",
  Mul = "*",
  Div = "/",
  Power = "^",
  Eq = "==",
  NotEq = "!=",
  GT = ">",
  GTE = ">=",
  LT = "<",
  LTE = "<="
}

export const BINARYOPS = [
  BinaryOp.Eq,
  BinaryOp.NotEq,
  BinaryOp.Plus,
  BinaryOp.Minus,
  BinaryOp.Mul,
  BinaryOp.Div,
  BinaryOp.Power,
  BinaryOp.GT,
  BinaryOp.GTE,
  BinaryOp.LT,
  BinaryOp.LTE
].map(x => x.toString());

export const OPS = Array.from(new Set(BINARYOPS.join("").split("")));

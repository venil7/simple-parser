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

export const toBinaryOp = (s: string): BinaryOp => {
  switch (s) {
    case "+":
      return BinaryOp.Plus;
    case "-":
      return BinaryOp.Minus;
    case "*":
      return BinaryOp.Mul;
    case "/":
      return BinaryOp.Div;
    case "^":
      return BinaryOp.Power;
    case "==":
      return BinaryOp.Eq;
    case "!=":
      return BinaryOp.NotEq;
    case ">":
      return BinaryOp.GT;
    case ">=":
      return BinaryOp.GTE;
    case "<":
      return BinaryOp.LT;
    case "<=":
      return BinaryOp.LTE;
    default:
      throw new Error(`Unexpected binary op ${s}`);
  }
};

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

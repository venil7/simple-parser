import { BinaryOp } from "./operator";
import { Peekable } from "./peekable";
import { Token, TokenStream, TokenType } from "./tokenStream";
enum AstNode {
  Num = "Num",
  Str = "Str",
  Bool = "Bool",
  Var = "Var",
  Lambda = "Lambda",
  Call = "Call",
  If = "If",
  Assign = "Assign",
  Binary = "Binary",
  Prog = "Prog"
}

type Ast =
  | AstNum
  | AstStr
  | AstBool
  | AstVar
  | AstIf
  | AstLambda
  | AstCall
  | AstAssign
  | AstBinary
  | AstProg;
type AstNum = { type: typeof AstNode.Num; value: number };
type AstStr = { type: typeof AstNode.Str; value: string };
type AstBool = { type: typeof AstNode.Bool; value: boolean };
type AstVar = { type: typeof AstNode.Var; value: string };
type AstIf = { type: typeof AstNode.If; cond: Ast; then: Ast; else: Ast };
type AstLambda = { type: typeof AstNode.Lambda; vars: string[]; body: Ast };
type AstCall = { type: typeof AstNode.Call; func: Ast; args: Ast[] };
type AstProg = { type: typeof AstNode.Prog; body: Ast[] };
type AstBinary = {
  type: typeof AstNode.Binary;
  op: BinaryOp;
  left: Ast;
  right: Ast;
};
type AstAssign = {
  type: typeof AstNode.Assign;
  op: "=";
  left: Ast;
  right: Ast;
};

type ParserFunc = () => Ast;

const isTokenType = (tokenType: TokenType) => (token: Token) =>
  tokenType === token.type;
const isTokenVal = (value: Token["value"]) => (token: Token) =>
  value === token.value;
const isToken = (tokenType: TokenType) => (value: Token["value"]) => (
  token: Token
) => isTokenType(tokenType)(token) && isTokenVal(value)(token);
const isOp = isTokenType(TokenType.Op);
const isPunc = isTokenType(TokenType.Punc);
const isSemicol = isToken(TokenType.Punc)(";");
const isOpenParen = isToken(TokenType.Punc)("(");
const isCloseParen = isToken(TokenType.Punc)(")");
const isOpenCurly = isToken(TokenType.Punc)("{");
const isCloseCurly = isToken(TokenType.Punc)("}");
const isVar = isTokenType(TokenType.Var);
const isString = isTokenType(TokenType.Str);
const isNum = isTokenType(TokenType.Num);
const isIf = isToken(TokenType.Kw)("if");
const isTrue = isToken(TokenType.Kw)("true");
const isFalse = isToken(TokenType.Kw)("false");
export const isAssign = isToken(TokenType.Op)("=");

export class Parser {
  private rawTokenStream: TokenStream;
  private tokenStream: Peekable<Token>;
  constructor(input: string) {
    this.rawTokenStream = new TokenStream(input);
    this.tokenStream = new Peekable<Token>(this.rawTokenStream.stream());
  }

  private parseNum = (value: number): AstNum => ({ type: AstNode.Num, value });
  private parseStr = (value: string): AstStr => ({ type: AstNode.Str, value });
  private parseVar = (value: string): AstVar => ({ type: AstNode.Var, value });
  private parseBool = (value: boolean): AstBool => ({
    type: AstNode.Bool,
    value
  });

  private parseItem(): Ast {
    const peek = this.peek();
    if (isIf(peek)) return this.parseIf();
    // if (isOpenParen(peek)) return this.parseExpression();
    if (isOpenCurly(peek)) return this.parseProg();
    const next = this.next();
    if (isVar(next))
      return this.maybeCall(() => this.parseVar(next.value as string));
    if (isFalse(next)) return this.parseBool(false);
    if (isTrue(next)) return this.parseBool(true);
    if (isString(next)) return this.parseStr(next.value as string);
    if (isNum(next)) return this.parseNum(next.value as number);
    this.error(`Unexpected token "${next.value}"`);
  }

  private parseProg(): Ast | AstProg {
    const body = this.delimited("{", "}", ";", () => this.parseExpression());
    if (body.length === 0) {
      return body[0];
    }
    return {
      type: AstNode.Prog,
      body
    };
  }
  private parseIf(): AstIf {
    this.skipIf();
    const cond = this.parseExpression();
    this.skipThen();
    const _then = this.parseProg();
    this.skipElse();
    const _else = this.parseProg();
    return {
      type: AstNode.If,
      cond,
      then: _then,
      else: _else
    };
  }

  private parseCall(func: Ast): Ast {
    return {
      type: AstNode.Call,
      func,
      args: this.delimited("(", ")", ",", () => this.parseExpression())
    };
  }

  private maybeCall(func: ParserFunc): Ast {
    const node = func();
    const next = this.peek();
    if (!this.eof() && isOpenParen(next)) {
      return this.parseCall(node);
    }
    return node;
  }

  public maybeBinary(left: Ast): Ast {
    const next = this.peek();
    if (!this.eof() && isOp(next)) {
      const op = this.next();
      const assign = isAssign(op);
      const right = this.maybeBinary(this.parseItem());
      return assign
        ? ({
            type: AstNode.Assign,
            op: "=",
            left,
            right
          } as AstAssign)
        : ({
            type: AstNode.Binary,
            op: op.value,
            left,
            right
          } as AstBinary);
    }
    return left;
  }

  private parseExpression(): Ast {
    return this.maybeCall(() => this.maybeBinary(this.parseItem()));
  }

  private delimited(
    start: string,
    stop: string,
    sep: string,
    parser: ParserFunc
  ): Ast[] {
    const isStop = isToken(TokenType.Punc)(stop);
    const ast = [];
    let first = true;
    this.skipPunc(start);
    while (!this.eof()) {
      if (isStop(this.peek())) {
        this.skipPunc(stop);
        break;
      }
      if (first) {
        first = false;
      } else {
        this.skipPunc(sep);
      }
      if (isStop(this.peek())) {
        this.skipPunc(stop);
        break;
      }
      ast.push(parser());
    }
    return ast;
  }

  public parseTopLevel(): AstProg {
    const body = [];
    while (!this.tokenStream.eof()) {
      body.push(this.parseExpression());
      if (!this.tokenStream.eof()) {
        this.skipSemicol();
      }
    }
    return { type: AstNode.Prog, body };
  }

  private skipToken(type: TokenType, val: string) {
    const token = this.next();
    const isCorrectToken = isToken(type)(val);
    if (!isCorrectToken(token)) this.error(`${val} expected`);
  }
  private skipKw = (val: string) => this.skipToken(TokenType.Kw, val);
  private skipIf = () => this.skipKw("if");
  private skipThen = () => this.skipKw("then");
  private skipElse = () => this.skipKw("else");
  private skipPunc = (val: string) => this.skipToken(TokenType.Punc, val);
  private skipSemicol = () => this.skipPunc(";");
  private eof = (): boolean => this.tokenStream.eof();
  private next = (): Token => this.tokenStream.next().value;
  private peek = (): Token => this.tokenStream.peek().value;
  private error = (s: string) =>
    this.rawTokenStream.error(`${s} around "${this.peek().value}"`);
}

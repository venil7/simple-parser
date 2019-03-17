import { TokenStream, TokenType } from "./tokenStream";
import { BinaryOp } from "./operator";
import { Peekable, Token } from "./peekable";
enum AstNode {
  Num,
  Str,
  Bool,
  Var,
  Lambda,
  Call,
  If,
  Assign,
  Binary,
  Prog
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
const isTokenVal = (value: typeof Token.value) => (token: Token) =>
  value === token.value;
const isToken = (tokenType: TokenType) => (value: typeof Token.value) => (
  token: Token
) => isTokenType(tokenType)(token) && isTokenVal(tokenType)(token);
const isOp = isTokenType(TokenType.Op);
const isPunc = isTokenType(TokenType.Punc);
const isSemicol = isToken(TokenType.Punc)(";");
const isOpenParen = isToken(TokenType.Punc)("(");
const isCloseParen = isToken(TokenType.Punc)(")");
const isOpenCurly = isToken(TokenType.Punc)("{");
const isCloseCurly = isToken(TokenType.Punc)("}");
const isVar = isToken(TokenType.Var);
const isString = isToken(TokenType.Str);
const isNum = isToken(TokenType.Num);
const isIf = isToken(TokenType.Kw)("if");
const isTrue = isToken(TokenType.Kw)("true");
const isFalse = isToken(TokenType.Kw)("false");
const isAssign = isToken(TokenType.Op)("=");

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
    if (isIf(next)) return this.parseIf();
    if (isOpenParen(next)) return this.parseExpression();
    if (isOpenCurly(next)) return this.parseProg();
    const next = this.next();
    if (isVar(next)) return this.maybeCall(next);
    if (isFalse(next)) return this.parseBool(false);
    if (isString(next)) return this.parseString(next.value);
    if (isNum(next)) return this.parseNum(next.value);
    this.error(`Unexpected token ${next.value}`);
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
    const _then = this.parseProg();
    this.skipThen();
    const _else = this.parseProg();
    return {
      type: NodeType.If,
      then: _then,
      else: _else
    };
  }

  private parseCall(func: AstVar): AstCall | AstVar {
    const next = this.peek();
    if (isOpenParen(next)) {
      return {
        type: AstNode.Call,
        func,
        args: this.delimited("(", ")", ",", () => this.parseExpression())
      };
    }
    return func;
  }

  private maybeCall(func: ParserFunc): Ast {
    const node = func();
    const next = this.peek();
    if (isOpenParen(next)) {
      return this.parseCall(node);
    }
    return node;
  }

  public maybeBinary(left: Ast): Ast | AstBinary {
    const next = this.peek();
    if (isOp(next)) {
      const op = this.next();
      const assign = isAssign(op);
      const right = this.maybeBinary(this.parseItem());
      return {
        type: assign ? AstNode.Assign : AstNode.Binary,
        op,
        left,
        right
      };
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
    const ast = [];
    let first = true;
    this.skipPunc(start);
    while (!this.eof()) {
      if (isPunc(stop)) break;
      if (first) {
        first = false;
      } else {
        this.skipPunc(sep);
      }
      if (isPunc(stop)) break;
      ast.push(parser());
    }
    return ast;
  }

  private parseTopLevel(): AstProg {
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
    if (!isCorrectToken(token)) this.error(`${p} expected`);
  }
  private skipKw = (val: string) => this.skipToken(TokenType.Kw, val);
  private skipIf = () => this.skipKw("if");
  private skipThen = () => this.skipKw("then");
  private skipPunc = (val: string) => this.skipToken(TokenType.Punc, val);
  private skipSemicol = () => this.skipPunc(";");
  private eof = (): boolean => this.tokenStream.eof();
  private next = (): Token => this.tokenStream.next().value;
  private peek = (): Token => this.tokenStream.peek().value;
  private error = (s: string) => this.rawTokenStream.error(s);
}

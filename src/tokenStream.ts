import { CharStream } from "./charStream";
import { BinaryOp, BINARYOPS, OPS } from "./operator";

export enum TokenType {
  Punc = "PUNC",
  Num = "NUM",
  Str = "STRING",
  Var = "VAR",
  Kw = "KW",
  Op = "OP"
}

const WHITESPACE = [" ", "\n", "\t"];
const ALPHABET = "abcdefghijklmnopqrstuvwxyz".split("");
const NUMBER = "1234567890".split("");
const VARSTART = [...ALPHABET, "_"];
const IDENTIFIER = [...VARSTART, ...NUMBER];
const PUNCT = "{}[]();".split("");
const COMMENT = ["#"];
const KEYWORDS = ["if", "then", "lambda", "true", "false"];

export type Token = { type: TokenType; value: string | number };

const includes = (...chars: string[]) => (c: string) => chars.indexOf(c) >= 0;
const excludes = (...chars: string[]) => (c: string) => !includes(...chars)(c);
const isPunctuation = includes(...PUNCT);
const isWhitespace = includes(...WHITESPACE);
const isIdentifier = includes(...IDENTIFIER);
const isAlphabet = includes(...ALPHABET);
const isVarstart = includes(...VARSTART);
const isNumber = includes(...NUMBER);
const isOperator = includes(...OPS);
const isAssign = includes("=");
const isBinaryOperator = includes(...BINARYOPS);
const isQuote = includes('"');
const isComment = includes(...COMMENT);
const isKeword = includes(...KEYWORDS);

export class TokenStream {
  private charStream: CharStream;
  private charIterator: IterableIterator<string>;

  constructor(private input: string) {
    this.charStream = new CharStream(input);
    this.charIterator = this.charStream.stream();
  }
  private takeWhile(...chars: string[]): string {
    const isIn = includes(...chars);
    let str = "";
    while (isIn(this.charStream.peek())) {
      str += this.charIterator.next().value;
    }
    return str;
  }
  private takeUntil(...chars: string[]): string {
    const notIn = excludes(...chars);
    let str = "";
    while (notIn(this.charStream.peek())) {
      str += this.charIterator.next().value;
    }
    return str;
  }
  private skipWhitespace(): void {
    this.takeWhile(...WHITESPACE);
  }
  private skipLineRemainder(): void {
    this.takeUntil("\n");
  }
  private takeAsString(): string {
    const str = this.takeUntil('"', "\n");
    return str.replace(/\"/g, "");
  }
  private takeAsOperator(): string {
    const op = this.takeWhile(...OPS);
    if (!isBinaryOperator(op) && !isAssign(op)) {
      this.charStream.error(`Unknown operator ${op}`);
    }
    return op;
  }
  private takeAsIdentifier(): string {
    return this.takeWhile(...IDENTIFIER);
  }
  private takeAsNumber(): number {
    const num = this.takeWhile(...NUMBER);
    const next = this.charStream.peek();
    if (isVarstart(next)) {
      this.charStream.error(`Unknown token ${num}${next}..`);
    }
    return Number(num);
  }
  public *stream(): IterableIterator<Token> {
    let char;
    while ((char = this.charStream.peek())) {
      if (isComment(char)) {
        this.skipLineRemainder();
      } else if (isWhitespace(char)) {
        this.skipWhitespace();
      } else if (isPunctuation(char)) {
        yield { type: TokenType.Punc, value: this.charIterator.next().value };
      } else if (isNumber(char)) {
        yield { type: TokenType.Num, value: this.takeAsNumber() };
      } else if (isQuote(char)) {
        yield { type: TokenType.Str, value: this.takeAsString() };
      } else if (isOperator(char)) {
        yield { type: TokenType.Op, value: this.takeAsOperator() };
      } else if (isVarstart(char)) {
        const identifier = this.takeAsIdentifier();
        if (isKeword(identifier)) {
          yield { type: TokenType.Kw, value: identifier };
        } else {
          yield { type: TokenType.Var, value: identifier };
        }
      } else {
        this.charStream.error(`Unknown token ${char}`);
      }
    }
  }
}

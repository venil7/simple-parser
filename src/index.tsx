import * as React from "react";
import * as ReactDOM from "react-dom";
import { App } from "./components/App";
import { Parser } from "./parser";
import { TokenStream } from "./tokenStream";

const input = `
  sum = lambda (a,b): {a+b;};
  mul = lambda (a,b): {a*b;};
  sum(mul(2,3),5*2);
`;

const tokenResult = () => {
  try {
    const ts = new TokenStream(input);
    const tokens = Array.from(ts.stream());
    return tokens;
  } catch (e) {
    return (e as Error).message;
  }
};
const parserResult = () => {
  try {
    const parser = new Parser(input);
    return parser.parseTopLevel();
  } catch (e) {
    return (e as Error).message;
  }
};

// document.getElementById("app").innerHTML = `
// ${JSON.stringify(parserResult(), null, 2)}
// `;

ReactDOM.render(<App />, document.getElementById("app"));

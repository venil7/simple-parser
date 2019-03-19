import { Parser } from "./parser";
import { TokenStream } from "./tokenStream";

const input = `
  #if a==true then {hello(1,2,3);} else {b="str"};
  #print("some string", 123);
  lambda (a,b): {a+b;}
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

document.getElementById("app").innerHTML = `
${JSON.stringify(parserResult(), null, 2)}
`;

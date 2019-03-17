import { TokenStream } from "./tokenStream";
import { Parser } from "./parser";

const input = `
    a==9;
`;

const result = () => {
  try {
    // const ts = new TokenStream(input);
    // const tokens = Array.from(ts.stream());
    // return tokens;
    const parser = new Parser(input);
    return parser.parseTopLevel();
  } catch (e) {
    return e.message;
  }
};

document.getElementById("app").innerHTML = `${JSON.stringify(
  result(),
  null,
  2
)}`;

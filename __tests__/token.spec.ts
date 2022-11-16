import { isAssign } from "../src/parser/parser";
import { TokenType } from "../src/parser/tokenStream";

describe("desc", () => {
  it("---", () => {
    const token = { type: TokenType.Op, value: "=" };
    const result = isAssign(token);
    expect(result).toBe(true);
  });
});

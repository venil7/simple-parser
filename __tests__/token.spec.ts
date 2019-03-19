import { isAssign } from "../src/parser";
import { TokenType } from "../src/tokenStream";
describe('desc', () => {
  it('---', () => {
    const token = { type: TokenType.Op, value: "=" };
    const result = isAssign(token);
    expect(result).toBe(true);
  });
});
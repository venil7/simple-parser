export class CharStream {
  private pos: number = 0;
  private col: number = 0;
  private line: number = 1;
  constructor(private input: string) {}
  public *stream(): IterableIterator<string> {
    for (let ch of this.input) {
      if (ch === "\n") {
        this.col = 0;
        this.line += 1;
      } else {
        this.col += 1;
      }
      this.pos += 1;
      yield ch;
    }
  }
  public peek(): string {
    return this.input.charAt(this.pos);
  }
  error(s: string): never {
    throw Error(`Error: ${s} at line: ${this.line} col: ${this.col}`);
  }
}

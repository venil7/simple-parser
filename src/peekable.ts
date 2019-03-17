type PeekableIterator<T> = IterableIterator<T> & {
  peek: () => IteratorResult<T>;
  eof: () => boolean;
};

export class Peekable<T> implements PeekableIterator<T> {
  private item: IteratorResult<T> | null;
  constructor(private iterator: IterableIterator<T>) {}

  public peek(): IteratorResult<T> {
    if (this.item) return this.item;
    this.item = this.iterator.next();
    return this.item;
  }

  public eof(): boolean {
    const item = this.peek();
    return item && item.done;
  }

  public next(): IteratorResult<T> {
    if (this.item) {
      const item = this.item;
      this.item = null;
      return item;
    }
    return this.iterator.next();
  }
  public [Symbol.iterator](): IterableIterator<T> {
    return this;
  }
}

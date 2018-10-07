//@flow
export default class Stack<X> {
  array: X[]
  depth: number

  constructor(value?: X) {
    this.array = []
    this.depth = -1

    if (value !== undefined) {
      this.push(value)
    }
  }

  get size(): number {
    return this.array.length
  }

  push(v: X): void {
    this.depth = this.array.push(v) - 1
  }

  pop(): X {
    if (this.depth <= 0) {
      throw 'cannot pop() empty stack!!'
    }
    --this.depth
    return this.array.pop()
  }

  top(): X {
    return this.array[this.depth]
  }

  get(depth: number): X {
    if (this.array[depth] === undefined) {
      throw `depth:${depth} is out of range of stack!!`
    }
    return this.array[depth]
  }

  set(value: X, depth: number = this.depth): X {
    this.array[depth] = value
    return value
  }

  /**
   * スタックの上から下の順にループする
   */
  forEach(callback: (value: X, depth: number) => void) {
    for (let i = this.array.length - 1; i >= 0; i--) {
      callback(this.array[i], i)
    }
  }
}

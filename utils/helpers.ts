export class PriorityQueue<T> {
  private items: T[]
  private compare: (a: T, b: T) => number

  constructor(compareFunction: (a: T, b: T) => number) {
    this.items = []
    this.compare = compareFunction
  }

  enqueue(element: T): void {
    if (this.isEmpty()) {
      this.items.push(element)
    } else {
      let added = false
      for (let i = 0; i < this.items.length; i++) {
        if (this.compare(element, this.items[i]) < 0) {
          this.items.splice(i, 0, element)
          added = true
          break
        }
      }
      if (!added) {
        this.items.push(element)
      }
    }
  }

  dequeue(): T | undefined {
    return this.items.shift()
  }

  isEmpty(): boolean {
    return this.items.length === 0
  }

  includes(element: T): boolean {
    return this.items.includes(element)
  }
}


export default class Iterator {
  constructor(items = []) {
    this.index = 0
    this.items = items
  }

  first = () => this.items?.[0]

  last = () => [...this.items]?.reverse()?.[0]

  hasNext = () => this.index < this.items.length - 1

  current = () => this.items[this.index]

  next() {
    if (this.hasNext()) this.index += 1
    return this.current()
  }

  prev() {
    if (this.index > 0) this.index -= 1
    return this.current()
  }
}

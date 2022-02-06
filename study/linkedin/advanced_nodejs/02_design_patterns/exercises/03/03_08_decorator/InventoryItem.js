export class InventoryItem {
  constructor(name, price) {
    this.name = name
    this.price = price
  }

  print() {
    console.log(`${item.name} costs ${item.price}`)
  }
}

export class GoldenInventoryItem {
  constructor(baseItem) {
    this.name = `Golden ${baseItem.name}`
    this.price = 1000 + baseItem.price
  }
}

export class DiamondInventoryItem {
  constructor(baseItem) {
    this.name = `Diamond ${baseItem.name}`
    this.price = 1000 + baseItem.price
    this.cutsGlass = true
  }

  print() {
    console.log(`${this.name} costs a lot of money...`)
  }
}

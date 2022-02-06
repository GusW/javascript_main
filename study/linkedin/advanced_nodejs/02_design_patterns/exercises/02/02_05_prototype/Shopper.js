export default class Shopper {
  constructor(name = "") {
    this._name = name
    this._shoppingList = []
  }

  set name(value) {
    this._name = value
  }

  get name() {
    return this._name
  }

  get shoppingList() {
    return this._shoppingList.join(", ")
  }

  addItemToList(item) {
    this._shoppingList.push(item)
  }

  clone(name) {
    const proto = Object.getPrototypeOf(this)
    const cloned = Object.create(proto)

    cloned._name = name
    cloned._shoppingList = [...this._shoppingList]

    return cloned
  }
}

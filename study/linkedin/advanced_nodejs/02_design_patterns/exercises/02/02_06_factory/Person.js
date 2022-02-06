export default class Person {
  constructor(name = "unnamed person") {
    this.name = name
  }

  toString() {
    return JSON.stringify(this)
  }
}

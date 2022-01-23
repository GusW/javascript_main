import Person from "./Person.js"

export default class Shopper extends Person {
  constructor(name, money = 0) {
    super(name)
    this.money = money
    this.employed = false
  }
}

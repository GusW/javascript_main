import Employee from "./Employee.js"
import Shopper from "./Shopper.js"

export default class UserFactory {
  constructor(name, options = { type, money: 0, employer: "" }) {
    if (options?.type === "employee") {
      return new Employee(name, options?.money, options?.employer)
    } else {
      return new Shopper(name, options?.money)
    }
  }
}

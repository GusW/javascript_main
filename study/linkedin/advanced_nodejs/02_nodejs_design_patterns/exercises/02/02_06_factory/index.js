import UserFactory from "./UserFactory.js"

const alex = new UserFactory("Alex Banks", { money: 100 })
const eve = new UserFactory("Eve Porcello", {
  type: "employee",
  money: 100,
  employer: "This and That",
})

eve.payDay(100)

console.log(alex.toString())
console.log(eve.toString())

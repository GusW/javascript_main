import Store from "./Store.js"
import { createRequire } from "module"
const require = createRequire(import.meta.url)
const inventory = require("./inventory.json")

const skiShop = new Store("Steep and Deep", inventory)

const searchItem = "powder skis"
const results = skiShop.find(searchItem)

console.log(results)

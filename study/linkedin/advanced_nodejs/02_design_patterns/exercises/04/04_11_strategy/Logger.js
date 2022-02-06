import LogStrategy from "./LogStrategy.js"
import { createRequire } from "module"

const require = createRequire(import.meta.url)
const { logs } = require("./config.json")

class Logger {
  constructor(strategy = "toConsole") {
    this.logs = []
    this.strategy = LogStrategy[strategy]
  }

  get count() {
    return this.logs.length
  }

  changeStrategy = (newStrategy) => {
    this.strategy = LogStrategy[newStrategy]
  }

  log = (message) => {
    const timestamp = new Date().toISOString()
    this.logs.push({ message, timestamp })
    this.strategy(timestamp, message)
  }
}

export default new Logger(logs.strategy)

import { writeFile, existsSync, readFileSync, unlink } from "fs"

class LocalStorageAdapter {
  #FILE_NAME = "localStorage.json"

  constructor() {
    if (existsSync(this.#FILE_NAME)) {
      console.log(`Loading items from ${this.#FILE_NAME}`)
      const txt = readFileSync(this.#FILE_NAME)
      this.items = JSON.parse(txt)
    } else {
      this.items = {}
    }
  }

  get length() {
    return Object.keys(this.items).length
  }

  getItem(key) {
    return this.items[key]
  }

  setItem(key, value) {
    this.items[key] = value
    writeFile(this.#FILE_NAME, JSON.stringify(this.items), (error) => {
      if (error) {
        console.error(error)
      }
    })
  }

  clear() {
    this.items = {}
    unlink(this.#FILE_NAME, () => {
      console.log("localStorage file removed")
    })
  }
}

export default new LocalStorageAdapter()

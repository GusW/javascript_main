import { writeFile, unlink } from "fs"
import { join, resolve } from "path"

export class ExitCommand {
  get name() {
    return "exit... bye!"
  }

  execute() {
    process.exit(0)
  }
}

export class CreateCommand {
  constructor(fileName, text) {
    this.fileName = fileName
    this.body = text
    this.fullPath = join(resolve(), fileName)
  }

  get name() {
    return `create ${this.fileName}`
  }

  execute() {
    writeFile(this.fullPath, this.body, (f) => f)
  }

  undo() {
    unlink(this.fullPath, (f) => f)
  }
}

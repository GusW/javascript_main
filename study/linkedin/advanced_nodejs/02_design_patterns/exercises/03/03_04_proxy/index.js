import * as nativeFs from "fs"
import { join, resolve } from "path"
import FS_Proxy from "./FS_Proxy.js"

const fs = new FS_Proxy(nativeFs)

const txtFile = join(resolve(), "Readme.txt")
const mdFile = join(resolve(), "Readme.md")

const result = (error, contents) => {
  if (error) {
    console.log("\x07")
    console.error(error)
    process.exit(0)
  }

  console.log("reading file...")
  console.log(contents)
}

fs.readFile(txtFile, "UTF-8", result)
fs.readFile(mdFile, "UTF-8", result)

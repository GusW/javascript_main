import { join, resolve } from "path"
import { appendFile } from "fs"
import { encode } from "morse"

export default class LogStrategy {
  static toMorseCode = (_timestamp, message) => {
    const morseCode = encode(message)
    console.log(morseCode)
  }

  static noDate = (_timestamp, message) => {
    console.log(message)
  }

  static toFile = (timestamp, message) => {
    const fileName = join(resolve(), "logs.txt")
    appendFile(fileName, `${timestamp} - ${message} \n`, (error) => {
      if (error) {
        console.log("Error writing to file")
        console.error(error)
      }
    })
  }

  static toConsole = (timestamp, message) => {
    console.log(`${timestamp} - ${message}`)
  }

  static none = () => {}
}

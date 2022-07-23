let userInput: unknown
let userName: string

userInput = 5
userInput = 'Max'
if (typeof userInput === 'string') {
  userName = userInput
}

function generateError(message: string, code: number): never {
  throw { message: message, errorCode: code }
  // or in case of an eternal loop: while (true) {}
}

generateError('An error occurred!', 500)

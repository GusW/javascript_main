const add = (
  n1: number = 0,
  n2: number = 0,
  showResult: boolean,
  phrase: string
) => {
  const result = n1 + n2
  if (showResult) {
    console.log(phrase + result)
  } else {
    return result
  }
}

let number1: number
number1 = 5
const number2 = 2.8
const logResult = true
let resultPhrase = 'Result is: '

add(number1, number2, logResult, resultPhrase)

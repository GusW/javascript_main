type Combinable = number | string
type ConversionDescriptor = 'as-number' | 'as-text'

const combine = (
  input1: Combinable,
  input2: Combinable,
  resultConversion: ConversionDescriptor
) => {
  let result: Combinable
  if (
    (typeof input1 === 'number' && typeof input2 === 'number') ||
    resultConversion === 'as-number'
  ) {
    result = +input1 + +input2
  } else {
    result = input1.toString() + input2.toString()
  }
  return result
}

let combinedAges = combine(30, 26, 'as-number')
console.log(combinedAges)

combinedAges = combine('30', '96', 'as-number')
console.log(combinedAges)

const combinedNames = combine('Max', 'Anna', 'as-text')
console.log(combinedNames)

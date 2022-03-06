const newObj = { key1: 8, key2: 64, key3: 512 }

const exampleArray = [
  { key1: 1, key2: 1, key3: 1 },
  { key1: 2, key2: 4, key3: 8 },
  { key1: 3, key2: 9, key3: 27 },
  { key1: 4, key2: 16, key3: 64 },
  { key1: 5, key2: 25, key3: 125 },
  { key1: 6, key2: 36, key3: 216 },
  { key1: 7, key2: 49, key3: 343 },
]

// psuh -> append to right, returns length
console.log(exampleArray.push(newObj))

console.log(exampleArray)

// pop -> remove right, returns last element
console.log(exampleArray.pop())

console.log(exampleArray)

// shift -> remove left, returns first element
console.log(exampleArray.shift())

console.log(exampleArray)

// unshift -> append to left, return length
console.log(exampleArray.unshift({ key1: 1, key2: 1, key3: 1 }))

console.log(exampleArray)

// concat -> extend array, return array extended
console.log(
  exampleArray.concat([
    { key1: 'A', key2: 'AA', key3: 'AAA' },
    { key1: 'B', key2: 'BB', key3: 'BBB' },
  ])
)

// join -> return joined string
console.log(exampleArray.join('^hooray^'))

// slice -> return new array slice
console.log(exampleArray.slice(0, 2))

console.log(exampleArray)

// reverse -> mutate and return reversed
console.log(exampleArray.reverse())

console.log(exampleArray.at(-1))

// element in [indexOf, includes]

console.log(exampleArray.includes({ newObj }))
console.log(exampleArray.includes(exampleArray[0]))

console.log(exampleArray.indexOf(exampleArray[6]))

// Iterations

console.log(exampleArray.find((set) => set.key2 === 9))

console.log(exampleArray.findIndex((set) => set.key2 === 25))

// all
console.log(exampleArray.every((set) => set.key1 > 0))

// any
console.log(exampleArray.some((set) => set.key1 >= 7))

console.log(exampleArray.filter((set) => set.key3 % 2 === 0))

console.log(exampleArray.map((set) => ({ newKey: Object.values(set) })))

exampleArray.forEach((item) => console.log(`My crazy ${item.key3}`))

console.log(
  Object.values(exampleArray?.[0]).reduce(
    (accumulator, currentValue, idx) => accumulator + currentValue + idx,
    0
  )
)

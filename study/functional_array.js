const exampleArray = [
  { key1: 1, key2: 1, key3: 1 },
  { key1: 2, key2: 4, key3: 8 },
  { key1: 3, key2: 9, key3: 27 },
  { key1: 4, key2: 16, key3: 64 },
  { key1: 5, key2: 25, key3: 125 },
  { key1: 6, key2: 36, key3: 216 },
  { key1: 7, key2: 49, key3: 343 },
]

console.log(exampleArray.find((set) => set.key2 === 9))

console.log(exampleArray.filter((set) => set.key3 % 2 === 0))

console.log(exampleArray.map((set) => ({ newKey: Object.values(set) })))

exampleArray.forEach((item) => console.log(`My crazy ${item.key3}`))

console.log(
  Object.values(exampleArray?.[0]).reduce(
    (accumulator, currentValue, idx) => accumulator + currentValue + idx,
    0
  )
)

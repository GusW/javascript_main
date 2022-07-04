function power(base, exp) {
  if (exp === 0) return 1
  if (exp === 1) return base
  return base * power(base, exp - 1)
}

console.log(power(2, 0) === 1)
console.log(power(2, 2) === 4)
console.log(power(2, 4) === 16)

function factorial(num) {
  if (num < 0) return 0
  if (num === 0 || num === 1) return 1
  return num * factorial(num - 1)
}

console.log(factorial(1) === 1)
console.log(factorial(2) === 2)
console.log(factorial(4) === 24)
console.log(factorial(7) === 5040)

const productOfArray = (arr) => {
  if (arr.length === 0) return 1
  const first = arr.shift()
  return first * productOfArray(arr)
}

console.log(productOfArray([1, 2, 3]) === 6)
console.log(productOfArray([1, 2, 3, 10]) === 60)

function recursiveRange(num) {
  if (num === 1) return 1
  return num + recursiveRange(num - 1)
}

console.log(recursiveRange(6) === 21)
console.log(recursiveRange(10) === 55)

const cache = {}
function fib(num) {
  if (num <= 0) return 0
  if (num === 1) return 1
  if (num in cache) return cache[num]

  const first = fib(num - 2)
  cache[num - 2] = first

  const second = fib(num - 1)
  cache[num - 1] = second

  return first + second
}

console.log(fib(4) === 3)
console.log(fib(10) === 55)
console.log(fib(28) === 317811)
console.log(fib(35) === 9227465)

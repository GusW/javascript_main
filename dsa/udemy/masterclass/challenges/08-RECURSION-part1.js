function reverse(str) {
  if (str.length === 0) return ''
  if (str.length === 1) return str
  return str[str.length - 1] + reverse(str.slice(0, str.length - 1))
}

console.log(reverse('awesome') === 'emosewa')
console.log(reverse('rithmschool') === 'loohcsmhtir')

function isPalindrome(str) {
  if (str.length === 1) return true
  if (str.length === 2) return str[0] === str[1]

  if (str[0] !== str[str.length - 1]) return false

  return isPalindrome(str.slice(1, str.length - 1))
}

console.log(!isPalindrome('awesome'))
console.log(!isPalindrome('foobar'))
console.log(isPalindrome('tacocat'))
console.log(isPalindrome('amanaplanacanalpanama'))
console.log(!isPalindrome('amanaplanacanalpandemonium'))

const isOdd = (val) => val % 2 !== 0

function someRecursive(arr, callback) {
  if (arr.length === 0) return false

  if (!callback(arr.shift())) return someRecursive(arr, callback)
  return true
}

console.log(someRecursive([1, 2, 3, 4], isOdd))
console.log(someRecursive([4, 6, 8, 9], isOdd))
console.log(!someRecursive([4, 6, 8], isOdd))
console.log(!someRecursive([4, 6, 8], (val) => val > 10))

function capitalizeFirst(arr) {
  const res = []

  const capt = (target) => {
    if (target.length === 0) return

    let first = target.shift()
    res.push(first[0].toUpperCase() + first.slice(1))
    capt(target)
  }

  capt(arr)
  return res
}

console.log(capitalizeFirst(['car', 'taco', 'banana']))

function capitalizeWords(words) {
  const res = []

  const recurse = (target) => {
    if (target.length === 0) return
    res.push(target.shift().toUpperCase())
    recurse(target)
  }

  recurse(words)
  return res
}

console.log(capitalizeWords(['i', 'am', 'learning', 'recursion']))

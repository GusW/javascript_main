/**
 * SAME(ARRAY1, ARRAY2)
 * should return true if for each element of array 1 there is a
 * quadratic pair in array 2, with same frequency
 */

function same_naive(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return false
  }
  for (let i = 0; i < arr1.length; i++) {
    let correctIndex = arr2.indexOf(arr1[i] ** 2)
    if (correctIndex === -1) {
      return false
    }
    arr2.splice(correctIndex, 1)
  }
  return true
}

console.log(same_naive([1, 2, 3, 2], [9, 1, 4, 4]))

function same(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return false
  }
  let frequencyCounter1 = {}
  let frequencyCounter2 = {}
  for (let val of arr1) {
    frequencyCounter1[val] = ++frequencyCounter1[val] || 1
  }
  for (let val of arr2) {
    frequencyCounter2[val] = ++frequencyCounter2[val] || 1
  }
  for (let key in frequencyCounter1) {
    if (!(key ** 2 in frequencyCounter2)) {
      return false
    }
    if (frequencyCounter2[key ** 2] !== frequencyCounter1[key]) {
      return false
    }
  }
  return true
}

console.log(same([1, 2, 3, 2, 5], [9, 1, 4, 4, 25]))

const validAnagram = (str1, str2) => {
  strMap = {}
  for (let char of str1) {
    strMap[char] = ++strMap[char] || 1
  }

  console.log(strMap)

  for (let char of str2) {
    strMap[char] = --strMap[char] ?? -1
  }

  console.log(strMap)

  if (Object.values(strMap)?.some((val) => val !== 0)) return false

  return true
}

console.log(validAnagram('', '') === true)
console.log(validAnagram('aaz', 'zza') === false)
console.log(validAnagram('anagram', 'nagaram') === true)
console.log(validAnagram('rat', 'car') === false)
console.log(validAnagram('awesome', 'awesom') === false)
console.log(validAnagram('qwerty', 'qeywrt') === true)
console.log(validAnagram('texttwisttime', 'timetwisttext') === true)

const validAnagram2 = (first, second) => {
  if (first.length !== second.length) return false

  const lookup = {}
  for (let char of first) {
    lookup[char] = ++lookup[char] || 1
  }

  for (let char of second) {
    if (!lookup[char]) return false
    lookup[char]--
  }

  return true
}

console.log(validAnagram2('', '') === true)
console.log(validAnagram2('aaz', 'zza') === false)
console.log(validAnagram2('anagram', 'nagaram') === true)
console.log(validAnagram2('rat', 'car') === false)
console.log(validAnagram2('awesome', 'awesom') === false)
console.log(validAnagram2('qwerty', 'qeywrt') === true)
console.log(validAnagram2('texttwisttime', 'timetwisttext') === true)

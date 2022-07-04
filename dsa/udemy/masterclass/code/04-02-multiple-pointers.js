function sumZeroNaive(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] + arr[j] === 0) {
        return [arr[i], arr[j]]
      }
    }
  }
}

console.log(sumZeroNaive([-4, -3, -2, -1, 0, 1, 2, 5]))

const sumZero = (arr) => {
  let [left, right] = [0, arr.length - 1]

  while (left < right) {
    const targetSum = arr[left] + arr[right]
    if (targetSum === 0) return [arr[left], arr[right]]
    else if (targetSum > 0) right--
    else left++
  }

  return false
}

console.log(sumZero([-4, -3, -2, -1, 0, 1, 2, 5]))
console.log(sumZero([-4, -3, -2, 0, 1, 5]))
console.log(sumZero([0, 1, 2, 5]))
console.log(sumZero([-4, -3, -2, -1, 0, 1, 4, 5]))

function countUniqueValues(arr) {
  let lastSeen = ''
  let counter = 0
  for (let item of arr) {
    if (item !== lastSeen) {
      lastSeen = item
      counter++
    }
  }
  return counter
}

console.log(countUniqueValues([1, 2, 2, 5, 7, 7, 99]))

function countUniqueValuesPointers(arr) {
  if (arr.length === 0) return 0
  var i = 0
  for (var j = 1; j < arr.length; j++) {
    if (arr[i] !== arr[j]) {
      i++
      arr[i] = arr[j]
    }
  }
  return i + 1
}
console.log(countUniqueValuesPointers([1, 2, 2, 5, 7, 7, 99]))

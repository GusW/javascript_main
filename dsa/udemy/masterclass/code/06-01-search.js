const linearSearchNative = (arr, target) => arr.findIndex((el) => el === target)

const linearSearch = (arr, target) => {
  for (let idx in arr) {
    if (arr[idx] === target) return idx
  }
  return -1
}

function binarySearch(arr, target) {
  let [left, right] = [0, arr.length - 1]

  while (left <= right) {
    const mid = Math.floor((right + left) / 2)

    const current = arr[mid]

    if (current === target) return mid
    if (current > target) right = mid - 1
    else left = mid + 1
  }
  return -1
}

console.log(binarySearch([1, 2, 3, 4, 5], 2) === 1)
console.log(binarySearch([1, 2, 3, 4, 5], 3) === 2)
console.log(binarySearch([1, 2, 3, 4, 5], 5) === 4)

const naiveStringSearch = (str, pattern) => {
  let idx = 0
  let amt = 0
  for (let char of str) {
    if (char === pattern[idx]) {
      idx++
      if (idx === pattern.length) {
        amt++
        idx = 0
      }
    } else idx = 0
  }
  return amt
}

console.log(naiveStringSearch('wsajkkomgwijomgjifdsaiomghhhhhom', 'omg') === 3)

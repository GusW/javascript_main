function flatten(arr) {
  let flat = []

  const recurse = (targetArr) => {
    if (targetArr.length === 0) return

    const first = targetArr.shift()
    if (typeof first === 'number') {
      flat.push(first)
      recurse(targetArr)
    } else {
      flat.concat(recurse([...first, ...targetArr]))
    }
  }

  recurse(arr)
  return flat
}

console.log(flatten([1, 2, 3, [4, 5]]))
console.log(flatten([1, [2, [3, 4], [[5]]]]))
console.log(flatten([[1], [2], [3]]))
console.log(flatten([[[[1], [[[2]]], [[[[[[[3]]]]]]]]]]))

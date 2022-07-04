function collectOddValues(arr) {
  let newArr = []

  if (arr.length === 0) {
    return newArr
  }

  first = arr.shift()

  if (first % 2 !== 0) {
    newArr.push(first)
  }

  newArr = newArr.concat(collectOddValues(arr))
  return newArr
}

collectOddValues([1, 2, 3, 4, 5])

// with helper method
function collectOddValuesHelper(arr) {
  let result = []

  function helper(helperInput) {
    if (helperInput.length === 0) {
      return
    }

    first = helperInput.shift()
    if (first % 2 !== 0) {
      result.push(first)
    }

    helper(helperInput)
  }

  helper(arr)

  return result
}

collectOddValuesHelper([1, 2, 3, 4, 5, 6, 7, 8, 9])

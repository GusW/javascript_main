function areThereDuplicates(...args) {
  const known = new Set()
  for (let arg of args) {
    if (known.has(arg)) return true
    known.add(arg)
  }
  return false
}

areThereDuplicates(1, 2, 3)
areThereDuplicates(1, 2, 2)

// Frequency
function areThereDuplicatesFrequency() {
  let collection = {}
  for (let val in arguments) {
    collection[arguments[val]] = (collection[arguments[val]] || 0) + 1
  }
  for (let key in collection) {
    if (collection[key] > 1) return true
  }
  return false
}

// Multiple Pointers
function areThereDuplicatesPointers(...args) {
  // Two pointers
  args.sort((a, b) => a > b)
  let start = 0
  let next = 1
  while (next < args.length) {
    if (args[start] === args[next]) {
      return true
    }
    start++
    next++
  }
  return false
}

// One liner
function areThereDuplicatesOneLiner() {
  return new Set(arguments).size !== arguments.length
}

function addUpToLoop(n) {
  let total = 0
  for (let i = 1; i <= n; i++) {
    total += i
  }
  return total
}

let t1 = performance.now()
addUpToLoop(1000000000)
let t2 = performance.now()
console.log(`Time Elapsed loop: ${(t2 - t1) / 1000} seconds.`)

function addUpToMath(n) {
  return (n * (n + 1)) / 2
}

t1 = performance.now()
addUpToMath(1000000000)
t2 = performance.now()
console.log(`Time Elapsed math: ${(t2 - t1) / 1000} seconds.`)

// Call Stack - added to stack and popped on its return
function takeShower() {
  return 'Showering!'
}

function eatBreakfast() {
  let meal = cookFood()
  return `Eating ${meal}`
}

function cookFood() {
  let items = ['Oatmeal', 'Eggs', 'Protein Shake']
  return items[Math.floor(Math.random() * items.length)]
}
function wakeUp() {
  takeShower()
  eatBreakfast()
  console.log('Ok ready to go to work!')
}

wakeUp()

// COUNTDOWN
// Iterative Version
function countDownIter(num) {
  for (var i = num; i > 0; i--) {
    console.log(i)
  }
  console.log('All done!')
}

countDownIter(4)

// Recursive Version
function countDown(num) {
  if (num <= 0) {
    console.log('All done!')
    return
  }
  console.log(num)
  num--
  countDown(num)
}

countDown(4)

// SUM RANGE
function sumRange(num) {
  if (num === 1) return 1
  return num + sumRange(num - 1)
}

sumRange(40)

// FACTORIAL
// Iterative Version
function factorialIterative(num) {
  let total = 1
  for (let i = num; i > 1; i--) {
    total *= i
  }

  return total
}

factorialIterative(6)

// Recursive Version
const factorial = (num) => {
  if (num === 1) return 1
  return num * factorial(num - 1)
}

factorial(6)

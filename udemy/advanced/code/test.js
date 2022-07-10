'use strict'
var Person = {
  init: function (firstName, lastName) {
    this.firstName = firstName
    this.lastName = lastName
    return this
  },
  fullName: function () {
    return `${this.firstName} ${this.lastName}`
  },
}

var foo = Object.create(Person)
foo.init('John', 'Montana')
console.log(foo.fullName())

function doAsyncTask() {
  const promise = new Promise((resolve, reject) => {
    console.log('Async done')
    if (false) {
      resolve('Task Complete')
    } else {
      reject('boo')
    }
  })
  return promise
}

doAsyncTask()
  .catch((err) => console.log(err))
  .then((val) => console.log(val))

const doAsyncTask2 = () => Promise.resolve('done')
const foo2 = async () => {
  const value = await doAsyncTask2()
  console.log(value)
}
foo2()

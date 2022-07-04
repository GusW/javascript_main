function nestedEvenSum(obj) {
  let res = 0

  const recurse = (target) => {
    for (let val of Object.values(target)) {
      if (typeof val === 'number' && val % 2 === 0) res += val
      else if (typeof val === 'object' && !Array.isArray(val)) recurse(val)
    }
  }
  recurse(obj)
  return res
}

var obj1 = {
  outer: 2,
  obj: {
    inner: 2,
    otherObj: {
      superInner: 2,
      notANumber: true,
      alsoNotANumber: 'yup',
    },
  },
}

var obj2 = {
  a: 2,
  b: { b: 2, bb: { b: 3, bb: { b: 2 } } },
  c: { c: { c: 2 }, cc: 'ball', ccc: 5 },
  d: 1,
  e: { e: { e: 2 }, ee: 'car' },
}

console.log(nestedEvenSum(obj1) === 6)
console.log(nestedEvenSum(obj2) === 10)

const collectStrings = (obj) => {
  const res = []

  const recurse = (target) => {
    for (let val of Object.values(target)) {
      if (typeof val === 'string') {
        res.push(val)
      } else if (typeof val === 'object' && !Array.isArray(val)) {
        recurse(val)
      }
    }
  }

  recurse(obj)
  return res
}

let obj = {
  stuff: 'foo',
  data: {
    val: {
      thing: {
        info: 'bar',
        moreInfo: {
          evenMoreInfo: {
            weMadeIt: 'baz',
          },
        },
      },
    },
  },
}

console.log(collectStrings(obj))

const stringifyNumbers = (obj) => {
  const newObj = {}
  for (let [key, val] of Object.entries(obj)) {
    if (typeof val === 'number') {
      console.log(val)
      newObj[key] = String(val)
    } else if (typeof val === 'object' && !Array.isArray(val)) {
      console.log(val)
      newObj[key] = stringifyNumbers(val)
    } else {
      console.log(val)
      newObj[key] = val
    }
  }

  return newObj
}

obj = {
  num: 1,
  test: [],
  data: {
    val: 4,
    info: {
      isRight: true,
      random: 66,
    },
  },
}
stringifyNumbers(obj)

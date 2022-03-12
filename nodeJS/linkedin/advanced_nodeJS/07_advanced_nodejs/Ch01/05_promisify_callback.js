import { promisify } from 'util'

const delay = (seconds, callback) => {
  if (seconds > 3) {
    callback(new Error(`${seconds} seconds it too long!`))
  } else {
    setTimeout(
      () => callback(null, `the ${seconds} second delay is over.`),
      seconds
    )
  }
}

// if error is the first param in the callback then can be promisify'd
delay(2, (error, message) => {
  if (error) {
    console.log(error.message)
  } else {
    console.log(message)
  }
})

const promisifyDelay = promisify(delay)

promisifyDelay(4).then(console.log).catch(console.error)

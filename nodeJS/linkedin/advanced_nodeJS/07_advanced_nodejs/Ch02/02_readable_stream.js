import { Readable } from 'stream'

const peaks = [
  'Tallac',
  'Ralston',
  'Rubicon',
  'Twin Peaks',
  'Castle Peak',
  'Rose',
  'Freel Peak',
]

class StreamFromArray extends Readable {
  #array
  constructor(array) {
    // no options => binary
    // encoding: 'UTF-8' => text
    // objectMode: true => objects
    super({ objectMode: true })
    this.#array = array
  }

  _read() {
    this.#array?.forEach((data, index) => {
      this.push({ data, index })
    })

    this.push(null)
  }
}

const peakStream = new StreamFromArray(peaks)

peakStream.on('data', (chunk) => console.log(chunk))

peakStream.on('end', () => console.log('done!'))

import { readFile as _readFile, writeFile as _writeFile } from 'fs'
import { promisify } from 'util'

const readFile = promisify(_readFile)
const writeFile = promisify(_writeFile)

export default class ReservationService {
  constructor({ datafile, reservationDuration, numberOfTables }) {
    this.datafile = datafile
    this.numberOfTables = numberOfTables
    this.reservationDuration = 60 * 60 * reservationDuration
  }

  isAvailable = (datetime, reservations) => {
    const x1 = datetime
    const x2 = datetime + this.reservationDuration

    // Find out if the intervals [x1, x2] and [y1, y2] overlap
    const booked = reservations.filter((reservation) => {
      const y1 = reservation.datetime
      const y2 = reservation.datetime + this.reservationDuration
      return x1 <= y2 && y1 <= x2
    })

    return this.numberOfTables - booked.length >= 0
  }

  getList = async () => this.getData()

  tryReservation = async (datetime, numberOfGuests, customerName) => {
    const data = (await this.getData()) || []
    if (numberOfGuests > 4 || !this.isAvailable(datetime, data)) {
      return {
        error: 'There are no free tables available at that time.',
      }
    }
    data.unshift({ datetime, numberOfGuests, customerName })
    await writeFile(
      this.datafile,
      JSON.stringify(data.sort((a, b) => b.datetime - a.datetime))
    )
    return {
      success: 'The table was successfully reserved!',
    }
  }

  getData = async () => {
    const data = await readFile(this.datafile, 'utf8')
    if (!data) return []
    return JSON.parse(data)
  }
}

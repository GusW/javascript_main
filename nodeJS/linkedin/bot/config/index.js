import { join } from 'path'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config()

export const reservations = {
  datafile: join(path.resolve(), '/data/reservations.json'),
  reservationDuration: 2, // in hours
  numberOfTables: 6,
}

export const slack = {
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  token: process.env.SLACK_TOKEN,
}

export const wit = {
  token: process.env.WIT_TOKEN,
}

const fs = require('fs')
const util = require('util')

const readFile = util.promisify(fs.readFile)

class SpeakersService {
  constructor(datafile) {
    this.datafile = datafile
  }

  getNames = async () => {
    const data = await this.getData()

    return data.map((speaker) => ({
      name: speaker.name,
      shortname: speaker.shortname,
    }))
  }

  getListShort = async () => {
    const data = await this.getData()
    return data.map((speaker) => ({
      name: speaker.name,
      shortname: speaker.shortname,
      title: speaker.title,
    }))
  }

  getList = async () => {
    const data = await this.getData()
    return data.map((speaker) => ({
      name: speaker.name,
      shortname: speaker.shortname,
      summary: speaker.summary,
      title: speaker.title,
    }))
  }

  getAllArtwork = async () => {
    const data = await this.getData()
    return data
      ?.filter((item) => item?.artwork?.length > 0)
      ?.reduce((acc, elm) => [...acc, ...elm.artwork], [])
  }

  getSpeaker = async (shortname) => {
    const data = await this.getData()
    const speaker = data?.find((current) => current.shortname === shortname)
    if (!speaker) return null
    return {
      description: speaker.description,
      name: speaker.name,
      shortname: speaker.shortname,
      title: speaker.title,
    }
  }

  getArtworkForSpeaker = async (shortname) => {
    const data = await this.getData()
    const speaker = data.find((current) => current.shortname === shortname)
    return speaker?.artwork || null
  }

  getData = async () => {
    const data = await readFile(this.datafile, 'utf8')
    return data ? JSON.parse(data).speakers : []
  }
}

module.exports = SpeakersService

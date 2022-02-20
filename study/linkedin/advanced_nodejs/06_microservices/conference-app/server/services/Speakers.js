/* eslint-disable class-methods-use-this */
const axios = require('axios')
const crypto = require('crypto')
const fs = require('fs')
const path = require('path')
const util = require('util')
const CircuitBreaker = require('../lib/CircuitBreaker')

const fsExists = util.promisify(fs.exists)

class SpeakersService {
  #serviceName
  #circuitBreaker
  #cache
  constructor({ serviceRegistryUrl, serviceVersionIdentifier }) {
    this.#serviceName = 'speakers-service'
    this.#circuitBreaker = new CircuitBreaker()
    this.serviceRegistryUrl = serviceRegistryUrl
    this.serviceVersionIdentifier = serviceVersionIdentifier
    this.#cache = {}
  }

  getImage = async (path) => {
    const { ip, port } = await this.getService(this.#serviceName)
    return this.callService({
      method: 'get',
      responseType: 'stream',
      url: `http://${ip}:${port}/images/${path}`,
    })
  }

  getNames = async () => {
    const { ip, port } = await this.getService(this.#serviceName)
    return this.callService({
      method: 'get',
      url: `http://${ip}:${port}/names`,
    })
  }

  getListShort = async () => {
    const { ip, port } = await this.getService(this.#serviceName)
    return this.callService({
      method: 'get',
      url: `http://${ip}:${port}/list-short`,
    })
  }

  getList = async () => {
    const { ip, port } = await this.getService(this.#serviceName)
    return this.callService({
      method: 'get',
      url: `http://${ip}:${port}/list`,
    })
  }

  getAllArtwork = async () => {
    const { ip, port } = await this.getService(this.#serviceName)
    return this.callService({
      method: 'get',
      url: `http://${ip}:${port}/artwork`,
    })
  }

  getSpeaker = async (shortname) => {
    const { ip, port } = await this.getService(this.#serviceName)
    return this.callService({
      method: 'get',
      url: `http://${ip}:${port}/speaker/${shortname}`,
    })
  }

  getArtworkForSpeaker = async (shortname) => {
    const { ip, port } = await this.getService(this.#serviceName)
    return this.callService({
      method: 'get',
      url: `http://${ip}:${port}/artwork/${shortname}`,
    })
  }

  // should be on Base Class
  // Refactor method
  callService = async (requestOptions) => {
    const url = new URL(requestOptions.url)
    const cacheKey = crypto
      .createHash('md5')
      .update(requestOptions.method + url?.pathname)
      .digest('hex')

    const cacheFile =
      requestOptions?.responseType === 'stream'
        ? path.join(path.resolve(), '_imagecache', cacheKey)
        : null

    const result = await this.#circuitBreaker.callService(requestOptions)

    if (!result) {
      if (cacheFile) {
        const exists = await fsExists(cacheFile)
        if (exists) return fs.createReadStream(cacheFile)
      }
      return this.#cache?.[cacheKey] || false
    }

    if (cacheFile) {
      const ws = fs.createWriteStream(cacheFile)
      result.pipe(ws)
    } else {
      this.#cache[cacheKey] = result
    }
    return result
  }

  // should be on Base Class
  getService = async (servicename) => {
    const response = await axios.get(
      `${this.serviceRegistryUrl}/find/${servicename}/${this.serviceVersionIdentifier}`
    )
    return response?.data?.result
  }
}

module.exports = SpeakersService

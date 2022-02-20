/* eslint-disable class-methods-use-this */
const axios = require('axios')

class SpeakersService {
  #serviceName
  constructor({ serviceRegistryUrl, serviceVersionIdentifier }) {
    this.#serviceName = 'speakers-service'
    this.serviceRegistryUrl = serviceRegistryUrl
    this.serviceVersionIdentifier = serviceVersionIdentifier
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
  callService = async (requestOptions) => {
    const response = await axios(requestOptions)
    return response.data
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

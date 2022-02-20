/* eslint-disable class-methods-use-this */
const axios = require('axios')
const crypto = require('crypto')
const amqplib = require('amqplib')
const CircuitBreaker = require('../lib/CircuitBreaker')

const circuitBreaker = new CircuitBreaker()

class FeedbackService {
  constructor({ serviceRegistryUrl, serviceVersionIdentifier }) {
    this.serviceVersionIdentifier = serviceVersionIdentifier
    this.serviceRegistryUrl = serviceRegistryUrl
    this.cache = {}
  }

  addEntry = async (name, title, message) => {
    const conn = await amqplib.connect('amqp://localhost')
    const q = 'feedback'
    const qm = JSON.stringify({ name, title, message })
    const ch = await conn.createChannel()
    await ch.assertQueue(q)
    return ch.sendToQueue(q, Buffer.from(qm, 'utf8'))
  }

  getList = async () => {
    const { ip, port } = await this.getService('feedback-service')
    return this.callService({
      method: 'get',
      url: `http://${ip}:${port}/list`,
    })
  }

  callService = async (requestOptions) => {
    const url = new URL(requestOptions.url)
    const cacheKey = crypto
      .createHash('md5')
      .update(requestOptions.method + url?.pathname)
      .digest('hex')

    const result = await circuitBreaker.callService(requestOptions)

    if (!result) {
      return this.cache?.[cacheKey] || null
    }

    this.cache[cacheKey] = result
    return result
  }

  getService = async (servicename) => {
    const response = await axios.get(
      `${this.serviceRegistryUrl}/find/${servicename}/${this.serviceVersionIdentifier}`
    )
    return response.data?.result
  }
}

module.exports = FeedbackService

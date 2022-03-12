const semver = require('semver')

class ServiceRegistry {
  #services = {}
  constructor(log) {
    this.log = log
    this.#services = {}
    this.timeout = 30
  }

  get services() {
    return this.#services
  }

  get = (name, version) => {
    const candidates = Object.values(this.services).filter(
      (service) =>
        service.name === name && semver.satisfies(service.version, version)
    )

    return candidates[Math.floor(Math.random() * candidates.length)]
  }

  #handleKey = (name, version, ip, port) => `${name}_${version}_${ip}_${port}`

  #getNowTimestamp = () => Math.floor(new Date() / 1000)

  register = (name, version, ip, port) => {
    const key = this.#handleKey(name, version, ip, port)
    const timestamp = this.#getNowTimestamp()

    if (this.services.hasOwnProperty(key)) {
      this.#services[key] = { ...this.services[key], timestamp }
      this.log.debug(
        `Updated services ${name}, version ${version} at ${ip}:${port}`
      )
      return key
    }

    this.#services[key] = {
      timestamp,
      ip,
      port,
      name,
      version,
    }
    this.log.debug(
      `Added services ${name}, version ${version} at ${ip}:${port}`
    )
    return key
  }

  unregister = (name, version, ip, port) => {
    const key = this.#handleKey(name, version, ip, port)
    delete this.services[key]
    this.log.debug(
      `Unregistered services ${name}, version ${version} at ${ip}:${port}`
    )
    return key
  }

  cleanup = () => {
    const now = this.#getNowTimestamp()
    Object.keys(this.services).forEach((key) => {
      if (this.services[key].timestamp + this.timeout < now) {
        delete this.services[key]
        this.log.debug(`Removed service ${key}`)
      }
    })
  }
}

module.exports = ServiceRegistry

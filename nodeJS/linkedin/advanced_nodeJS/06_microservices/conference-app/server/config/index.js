const sitename = 'Roux Meetups'
const serviceRegistryUrl = 'http://localhost:3000'
const serviceVersionIdentifier = '1.x.x'

module.exports = {
  development: {
    sitename: `${sitename} [Development]`,
    serviceRegistryUrl,
    serviceVersionIdentifier,
  },
  production: {
    sitename,
    serviceRegistryUrl,
    serviceVersionIdentifier,
  },
}

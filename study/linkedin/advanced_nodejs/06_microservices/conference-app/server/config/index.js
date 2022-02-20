const path = require('path')

const sitename = 'Roux Meetups'
const serviceRegistryUrl = 'http://localhost:3000'
const serviceVersionIdentifier = '1.x.x'
const feedback = path.join(__dirname, '../data/feedback.json')

module.exports = {
  development: {
    sitename: `${sitename} [Development]`,
    serviceRegistryUrl,
    serviceVersionIdentifier,
    data: {
      feedback,
    },
  },
  production: {
    sitename,
    serviceRegistryUrl,
    serviceVersionIdentifier,
    data: {
      feedback,
    },
  },
}

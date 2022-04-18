import pkg from 'node-wit'
const { Wit } = pkg

export default class WitService {
  constructor(accessToken) {
    this.client = new Wit({ accessToken })
  }

  #isResultObjectEmpty = (resultObj) => Object.keys(resultObj)?.length == 0

  #extractObjectWithHigherConfidence = (arrayOfObjectsWithConfidence) =>
    arrayOfObjectsWithConfidence.reduce((prev, curr) =>
      prev.confidence > curr.confidence ? prev : curr
    )

  #handleTraits = (traitsQueryResult) => {
    if (this.#isResultObjectEmpty(traitsQueryResult)) return null

    const parsedTraits = Object.entries(traitsQueryResult)?.map(
      ([key, arrayVal]) => {
        const { value, confidence } = arrayVal.shift()
        return { role: key.replace('wit$', ''), value, confidence }
      }
    )
    return this.#extractObjectWithHigherConfidence(parsedTraits)
  }

  #handleEntities = (entitiesQueryResult) => {
    if (this.#isResultObjectEmpty(entitiesQueryResult)) return null

    const parsedEntities = Object.values(entitiesQueryResult)
    return this.#extractObjectWithHigherConfidence(parsedEntities)?.shift()
  }

  query = async (text) => {
    const queryResult = await this.client.message(text)

    const { entities, intents, traits } = queryResult
    const intent = [...intents]?.shift()?.name
    if (!intent) return {}

    const extractedData = { intent }
    const trait = this.#handleTraits({ ...traits })
    const entity = this.#handleEntities({ ...entities })

    const { role, value } = trait || entity || { role: null, value: null }

    return {
      ...extractedData,
      ...(role && value && { [role]: value }),
    }
  }
}

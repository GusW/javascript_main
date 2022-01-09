import mongodb from "mongodb"

const { ObjectId } = mongodb

export default class DAOBase {
  static injectDB = async (client, collectionConn, collectionName) => {
    if (collectionConn) {
      return
    }
    try {
      return await client
        // eslint-disable-next-line no-undef
        .db(process.env.RESTREVIEWS_NS)
        .collection(collectionName)
    } catch (err) {
      console.error(
        `Unable to establish collection handler in ${typeof this}: ${err}`
      )
    }
  }

  static generateIdObj = (targetId) => {
    return new ObjectId(targetId)
  }
}

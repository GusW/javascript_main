import DAOBase from "./DAOBase.js"
import { ItemNotFoundError, RestaurantError } from "../libs/exceptions.js"

let restaurantsConn

export default class RestaurantsDAO extends DAOBase {
  static injectDB = async (client) => {
    restaurantsConn = await super.injectDB(
      client,
      restaurantsConn,
      "restaurants"
    )
  }

  static _generateQueryFromFilters = (filters) => {
    let query = {}

    const { cuisine, name, zipcode } = filters

    // Requires creation of collection index for field name of type text in MongoDB Atlas
    if (name) query = { ...query, $text: { $search: name } }
    // or could equally be accomplished using
    // if (name) query = { ...query, name: { $regex: name } }
    if (cuisine) query = { ...query, cuisine: { $eq: cuisine } }
    if (zipcode) query = { ...query, "address.zipcode": { $eq: zipcode } }

    return query
  }

  static _getRestaurantCursor = async (filters) => {
    try {
      const query = this._generateQueryFromFilters(filters)
      return await restaurantsConn.find(query)
    } catch (err) {
      throw new RestaurantError(`Unable to issue find command, ${err}`)
    }
  }

  static getRestaurants = async ({
    filters = null,
    page = 0,
    restaurantsPerPage = 20,
  }) => {
    const restaurantCursor = await this._getRestaurantCursor(filters)
    const totalNumRestaurants = await restaurantCursor.count()
    if (page > 0 && restaurantsPerPage >= totalNumRestaurants)
      throw new RestaurantError(
        `No restaurants available on page ${page}: please try page 0 instead.`
      )

    const displayCursor = restaurantCursor
      .limit(restaurantsPerPage)
      .skip(restaurantsPerPage * page)

    try {
      const restaurants = await displayCursor.toArray()
      return { restaurants, totalNumRestaurants }
    } catch (err) {
      throw new RestaurantError(
        `Unable to convert restaurant displayCursor to array, ${err}`
      )
    }
  }

  static getRestaurantById = async (restaurantId) => {
    try {
      // MongoDB agreggation pipeline
      const pipeline = [
        {
          $match: {
            _id: this.generateIdObj(restaurantId),
          },
        },
        {
          $lookup: {
            from: "reviews",
            let: {
              id: "$_id",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$restaurant_id", "$$id"],
                  },
                },
              },
              {
                $sort: {
                  date: -1,
                },
              },
            ],
            as: "reviews",
          },
        },
        {
          $addFields: {
            reviews: "$reviews",
          },
        },
      ]
      const restaurant = await restaurantsConn.aggregate(pipeline).next()
      if (restaurant) return restaurant

      throw new ItemNotFoundError(`Restaurant not found id ${restaurantId}`)
    } catch (err) {
      throw new RestaurantError(`Error while getRestaurantById: ${err}`)
    }
  }

  static getCuisines = async () => {
    try {
      return await restaurantsConn.distinct("cuisine")
    } catch (err) {
      throw new RestaurantError(`Unable to get cuisines, ${err}`)
    }
  }
}

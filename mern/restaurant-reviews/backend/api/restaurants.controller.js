import RestaurantsDAO from "../dao/restaurantsDAO.js"
import { RestaurantGetByIdValidationError } from "../libs/exceptions.js"

export default class RestaurantsController {
  static _restaurantWrapper = async ({
    targetFn = null,
    args = null,
    res = null,
    action = "",
  }) => {
    try {
      const review_id = await targetFn(args)
      res.json({ action, review_id, status: "success" })
    } catch (err) {
      console.error(err)
      res.status(err.status || 500).json({ error: err.message })
    }
  }

  static getRestaurants = async (req, res) => {
    const { cuisine, zipcode, name } = req.query
    let { restaurantsPerPage, page } = req.query

    page = parseInt(page ?? 0, 10)
    restaurantsPerPage = parseInt(restaurantsPerPage || 20, 10)

    const filters = {
      cuisine,
      name,
      zipcode,
    }

    try {
      const { restaurants, totalNumRestaurants } =
        await RestaurantsDAO.getRestaurants({
          filters,
          page,
          restaurantsPerPage,
        })

      res.json({
        restaurants,
        page,
        filters,
        entries_per_page: restaurantsPerPage,
        total_results: totalNumRestaurants,
      })
    } catch (err) {
      console.error(err)
      res.status(err.status || 500).json({ error: err.message })
    }
  }

  static getRestaurantById = async (req, res) => {
    try {
      const id = req.params.id
      if (!id) {
        throw new RestaurantGetByIdValidationError(
          `Restaurant Id required: received ${id}`
        )
      }
      const restaurant = await RestaurantsDAO.getRestaurantById(id)
      if (!restaurant) {
        res.status(404).json({ error: "Restaurant not found" })
        return
      }
      res.json(restaurant)
    } catch (err) {
      console.error(err)
      res.status(err.status || 500).json({ error: err.message })
    }
  }

  static getRestaurantCuisines = async (_req, res) => {
    try {
      const cuisines = await RestaurantsDAO.getCuisines()
      res.json(cuisines)
    } catch (err) {
      console.error(err)
      res.status(err.status || 500).json({ error: err.message })
    }
  }
}

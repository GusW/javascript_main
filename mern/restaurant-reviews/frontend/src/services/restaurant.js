import http from "../http-common"

class RestaurantDataService {
  getAll = (page = 0) => http.get(`?page=${page}`)

  get = (restaurantId) => http.get(`/id/${restaurantId}`)

  find = (searchObj, page = 0) => {
    const searchQuery = Object.entries(searchObj)
      ?.filter(([_key, val]) => val)
      ?.map(([key, val]) => `${key}=${val}`)
      .join("&")

    return http.get(`?${searchQuery ? `${searchQuery}&` : ""}page=${page}`)
  }
  createReview = (data) => http.post("/review", data)

  updateReview = (data) => http.put("/review", data)

  deleteReview = (id, userId) =>
    http.delete(`/review?id=${id}`, {
      data: { user_id: userId },
    })
  getCuisines = () => http.get(`/cuisines`)
}

export default new RestaurantDataService()

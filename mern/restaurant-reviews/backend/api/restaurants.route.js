import express from "express"
import RestaurantsCtrl from "./restaurants.controller.js"
import ReviewsCtrl from "./reviews.controller.js"

const router = express.Router()

router.route("/").get(RestaurantsCtrl.getRestaurants)
router.route("/id/:id").get(RestaurantsCtrl.getRestaurantById)
router.route("/cuisines").get(RestaurantsCtrl.getRestaurantCuisines)

router
  .route("/review")
  .post(ReviewsCtrl.createReview)
  .put(ReviewsCtrl.updateReview)
  .delete(ReviewsCtrl.deleteReview)

export default router

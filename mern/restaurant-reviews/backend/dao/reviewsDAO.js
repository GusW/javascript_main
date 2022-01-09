import DAOBase from "./DAOBase.js"
import {
  RestaurantReviewError,
  ItemNotFoundError,
  RestaurantReviewUserError,
} from "../libs/exceptions.js"

let reviewsConn

export default class ReviewsDAO extends DAOBase {
  static injectDB = async (client) => {
    reviewsConn = await super.injectDB(client, reviewsConn, "reviews")
  }

  static createReview = async ({
    restaurant_id = 0,
    user = null,
    text = "",
  }) => {
    const reviewDoc = {
      name: user?.name,
      user_id: user?._id,
      date: new Date(),
      text,
      restaurant_id: this.generateIdObj(restaurant_id),
    }
    const createReviewResponse = await reviewsConn.insertOne(reviewDoc)
    if (createReviewResponse.acknowledged)
      return createReviewResponse.insertedId?.toString()
    throw new RestaurantReviewError(
      `Failed to insert new review to restaurantId ${restaurant_id}`
    )
  }

  static _getReviewById = async (reviewId) => {
    try {
      return await reviewsConn.findOne(this.generateIdObj(reviewId))
    } catch (err) {
      throw new RestaurantReviewError(`Could not getReviewById: ${err}`)
    }
  }

  static _handleReviewUser = async (reviewId, userId) => {
    const review = await this._getReviewById(reviewId)
    if (review?.user_id === userId) return
    if (!review) throw new ItemNotFoundError(`Review not found id ${reviewId}`)
    throw new RestaurantReviewUserError(
      `Review was not created by user id ${userId}`
    )
  }

  static updateReview = async ({ review_id = 0, user_id = 0, text = "" }) => {
    await this._handleReviewUser(review_id, user_id)
    try {
      await reviewsConn.updateOne(
        { user_id, _id: this.generateIdObj(review_id) },
        { $set: { text, date: new Date() } }
      )
      return review_id
    } catch (err) {
      throw new RestaurantReviewError(`Unable to update review: ${err}`)
    }
  }

  static deleteReview = async ({ review_id = 0, user_id = 0 }) => {
    await this._handleReviewUser(review_id, user_id)
    try {
      await reviewsConn.deleteOne({
        _id: this.generateIdObj(review_id),
        user_id,
      })
      return review_id
    } catch (err) {
      throw new RestaurantReviewError(`Unable to delete review: ${err}`)
    }
  }
}

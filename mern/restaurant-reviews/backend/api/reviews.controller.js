import ReviewsDAO from "../dao/reviewsDAO.js"
import validator from "../schemas/validator.js"

export default class ReviewsController {
  static _reviewWrapper = async ({
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

  static createReview = async (req, res) => {
    const { validateReviewCreate } = validator(req.body)
    const { restaurant_id, text, name, user_id } = validateReviewCreate()
    const user = {
      name,
      _id: user_id,
    }
    await this._reviewWrapper({
      targetFn: ReviewsDAO.createReview,
      args: {
        restaurant_id,
        user,
        text,
      },
      res,
      action: "create",
    })
  }

  static updateReview = async (req, res) => {
    const { validateReviewUpdate } = validator(req.body)
    const { review_id, text, user_id } = validateReviewUpdate()
    await this._reviewWrapper({
      targetFn: ReviewsDAO.updateReview,
      args: {
        review_id,
        user_id,
        text,
      },
      res,
      action: "update",
    })
  }

  static deleteReview = async (req, res) => {
    const { validateReviewDelete } = validator({ ...req.query, ...req.body })
    const { id, user_id } = validateReviewDelete()
    await this._reviewWrapper({
      targetFn: ReviewsDAO.deleteReview,
      args: {
        review_id: id,
        user_id,
      },
      res,
      action: "delete",
    })
  }
}

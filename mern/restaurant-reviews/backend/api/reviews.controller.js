import ReviewsDAO from "../dao/reviewsDAO.js"

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
    const { restaurant_id, text, name, user_id } = req.body
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
    const { review_id, text, user_id } = req.body
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
    const review_id = req.query.id
    const user_id = req.body.user_id
    await this._reviewWrapper({
      targetFn: ReviewsDAO.deleteReview,
      args: {
        review_id,
        user_id,
      },
      res,
      action: "delete",
    })
  }
}

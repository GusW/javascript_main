import React, { useState } from "react"
import { useParams, useLocation } from "react-router-dom"
import RestaurantDataService from "../services/restaurant"
import RestaurantHeader from "./restaurant-header.js"

const AddReview = (props) => {
  const { user } = props
  const { restaurantId } = useParams()
  let location = useLocation()
  const currentRestaurant = location?.state?.currentRestaurant || null
  const currentReview = location?.state?.currentReview || null

  const editing = Boolean(currentReview)
  const initialReviewState = currentReview?.text || ""

  const [review, setReview] = useState(initialReviewState)
  const [submitted, setSubmitted] = useState(false)

  const _handleInputChange = (event) => {
    setReview(event.target.value)
  }

  const _triggerReviewActionRequest = () => {
    review
    let data = {
      text: review,
      user_id: user?.id,
    }

    if (editing) {
      data.review_id = currentReview._id
      return RestaurantDataService.updateReview(data)
    }

    data.name = user?.name
    data.restaurant_id = restaurantId
    return RestaurantDataService.createReview(data)
  }

  const saveReview = () => {
    _triggerReviewActionRequest()
      .then((response) => {
        setSubmitted(true)
      })
      .catch((err) => {
        console.error(err)
        alert(err)
      })
  }

  return (
    <>
      {user ? (
        <div>
          <RestaurantHeader restaurant={currentRestaurant} />

          <h4 style={{ marginTop: ".5rem" }}>
            {" "}
            {editing ? "Edit" : "Create"} Review{" "}
          </h4>
          <div className="row">
            <div className="submit-form">
              {submitted ? (
                <div>
                  <h4>You submitted successfully!</h4>
                </div>
              ) : (
                <div>
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control"
                      id="text"
                      required
                      value={review}
                      onChange={_handleInputChange}
                      name="text"
                    />
                  </div>
                  <div className="row" style={{ marginTop: ".5rem" }}>
                    <div className="col-xs-0 col-sm-10"></div>
                    <div className="col-xs-12 col-sm-2">
                      <button
                        onClick={saveReview}
                        className="btn btn-success"
                        style={{ width: "100%" }}
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div>Please log in.</div>
      )}
    </>
  )
}

export default AddReview

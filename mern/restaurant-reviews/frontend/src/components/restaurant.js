import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import RestaurantDataService from "../services/restaurant.js"
import RestaurantHeader from "./restaurant-header.js"

const initialRestaurantState = {
  restaurantId: null,
  name: "",
  address: {},
  cuisine: "",
  reviews: [],
}

const Restaurant = (props) => {
  const [restaurant, setRestaurant] = useState(initialRestaurantState)
  const { restaurantId } = useParams()
  let navigate = useNavigate()
  const { user } = props
  const userId = user?.id

  const getRestaurant = (restaurantId) => {
    RestaurantDataService.get(restaurantId)
      .then((response) => {
        setRestaurant(response.data)
      })
      .catch((err) => {
        console.error(err)
        alert(err)
      })
  }

  useEffect(() => {
    getRestaurant(restaurantId)
  }, [restaurantId])

  const deleteReview = (reviewId, index) => {
    RestaurantDataService.deleteReview(reviewId, userId)
      .then((_response) => {
        setRestaurant((prevState) => {
          prevState.reviews.splice(index, 1)
          return {
            ...prevState,
          }
        })
      })
      .catch((err) => {
        console.error(err)
        alert(err)
      })
  }

  const _generateAddReviewButton = () => (
    <a
      onClick={() =>
        navigate(`/restaurants/${restaurantId}/review`, {
          state: { currentRestaurant: restaurant },
        })
      }
      className="btn btn-primary"
    >
      Add Review
    </a>
  )

  return (
    <div>
      {restaurant ? (
        <div>
          <RestaurantHeader
            restaurant={restaurant}
            addReviewLink={_generateAddReviewButton()}
          />

          <h4 style={{ marginTop: ".5rem" }}> Reviews </h4>
          <div className="row">
            {restaurant.reviews.length > 0 ? (
              restaurant.reviews.map((review, index) => {
                return (
                  <div className="col-lg-4 pb-1" key={index}>
                    <div className="card">
                      <div className="card-body">
                        <p className="card-text">
                          {review.text}
                          <br />
                          <strong>User: </strong>
                          {review.name}
                          <br />
                          <strong>Date: </strong>
                          {review.date}
                        </p>
                        {userId === review.user_id && (
                          <div
                            className="row"
                            style={{
                              justifyContent: "center",
                              paddingTop: ".5rem",
                              borderTop: "solid .1rem #dfdfdf",
                            }}
                          >
                            <a
                              onClick={() => deleteReview(review._id, index)}
                              className="btn btn-primary col-lg-5 mx-1 mb-1"
                            >
                              Delete
                            </a>
                            <a
                              onClick={() =>
                                navigate(
                                  `/restaurants/${restaurantId}/review`,
                                  {
                                    state: {
                                      currentRestaurant: restaurant,
                                      currentReview: review,
                                    },
                                  }
                                )
                              }
                              className="btn btn-primary col-lg-5 mx-1 mb-1"
                            >
                              Edit
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="col-sm-4">
                <p>No reviews yet.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div>
          <br />
          <p>No restaurant selected.</p>
        </div>
      )}
    </div>
  )
}

export default Restaurant

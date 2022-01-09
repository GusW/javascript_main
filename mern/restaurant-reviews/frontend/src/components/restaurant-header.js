import React from "react"
import { useNavigate } from "react-router-dom"

const RestaurantHeader = (props) => {
  const { addReviewLink, restaurant } = props
  const navigate = useNavigate()

  return (
    <div className="row" style={{ borderBottom: "solid .1rem #dfdfdf" }}>
      <div className="col-10">
        <h5>{restaurant?.name}</h5>
        <p>
          <strong>Cuisine: </strong>
          {restaurant?.cuisine}
          <br />
          <strong>Address: </strong>
          {restaurant?.address.building} {restaurant?.address.street},{" "}
          {restaurant?.address.zipcode}
        </p>
      </div>
      <div className="col">
        <div className="row" style={{ marginBottom: ".5rem" }}>
          <a onClick={() => navigate(-1)} className="btn btn-secondary">
            Back
          </a>
        </div>
        <div className="row">{addReviewLink}</div>
      </div>
    </div>
  )
}

export default RestaurantHeader

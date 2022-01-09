import React from "react"
import { Routes, Route } from "react-router-dom"

import AddReview from "./add-review.js"
import Login from "./login.js"
import Restaurant from "./restaurant.js"
import RestaurantsList from "./restaurant-list.js"

const ProjectRoutes = (props) => {
  const { login, user } = props
  return (
    <div className="container mt-3">
      <Routes>
        <Route exact path="/" element={<RestaurantsList />} />
        <Route path="/restaurants" element={<RestaurantsList />} />
        <Route
          path="/restaurants/:restaurantId"
          element={<Restaurant {...props} user={user} />}
        />
        <Route
          path="/restaurants/:restaurantId/review"
          element={<AddReview user={user} />}
        />
        <Route path="/login" element={<Login {...props} login={login} />} />
      </Routes>
    </div>
  )
}

export default ProjectRoutes

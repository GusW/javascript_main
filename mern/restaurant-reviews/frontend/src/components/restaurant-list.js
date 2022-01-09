import React, { useState, useEffect } from "react"
import RestaurantDataService from "../services/restaurant"
import { Link } from "react-router-dom"

const initialSearchQueryState = {
  cuisine: "",
  name: "",
  zipcode: "",
}

const RestaurantsList = () => {
  const [restaurants, setRestaurants] = useState([])
  const [cuisines, setCuisines] = useState(["All Cuisines"])
  const [searchQuery, setSearchQuery] = useState(initialSearchQueryState)

  useEffect(() => {
    _retrieveRestaurants()
    _retrieveCuisines()
  }, [])

  const _onChangeSearchCuisine = (ev) => {
    const cuisine = ev.target.value
    setSearchQuery({ ...searchQuery, cuisine })
  }

  const _onChangeSearchName = (ev) => {
    const name = ev.target.value
    setSearchQuery({ ...searchQuery, name })
  }

  const _onChangeSearchZip = (ev) => {
    const zipcode = ev.target.value
    setSearchQuery({ ...searchQuery, zipcode })
  }

  const _retrieveRestaurants = () => {
    RestaurantDataService.getAll()
      .then((response) => {
        setRestaurants(response.data.restaurants)
      })
      .catch((err) => {
        console.error(err)
        alert(err)
      })
  }

  const _retrieveCuisines = () => {
    RestaurantDataService.getCuisines()
      .then((response) => {
        setCuisines(response.data)
      })
      .catch((err) => {
        console.error(err)
        alert(err)
      })
  }

  const _findRestaurants = () => {
    RestaurantDataService.find(searchQuery)
      .then((response) => {
        setRestaurants(response.data.restaurants)
      })
      .catch((err) => {
        console.error(err)
        alert(err)
      })
  }

  const _clearSearch = () => {
    setSearchQuery({ ...initialSearchQueryState })
  }

  return (
    <div>
      <div className="row" style={{ padding: "1rem 0" }}>
        <div className="col-md-6 col-lg-3">
          <select className="form-select" onChange={_onChangeSearchCuisine}>
            {/* TODO deprecate selected to option */}
            <option selected={!searchQuery.cuisine} value={""}>
              All Cuisines
            </option>
            {cuisines.map((cuisine, idx) => (
              <option key={idx} value={cuisine}>
                {" "}
                {cuisine.substring(0, 30)}{" "}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-6 col-lg-3">
          <input
            type="text"
            className="form-control"
            placeholder="Name"
            value={searchQuery.name}
            onChange={_onChangeSearchName}
          />
        </div>
        <div className="col-md-6 col-lg-2">
          <input
            type="text"
            className="form-control"
            placeholder="Zip"
            value={searchQuery.zipcode}
            onChange={_onChangeSearchZip}
          />
        </div>
        <div className="col-md-6 col-lg-4" style={{}}>
          <div className="row">
            <div className="col">
              <button
                className="btn btn-primary"
                type="button"
                onClick={_findRestaurants}
                style={{ width: "100%" }}
              >
                Search
              </button>
            </div>
            <div className="col">
              <button
                className="btn btn-secondary"
                type="button"
                onClick={_clearSearch}
                style={{ width: "100%" }}
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        {restaurants.map((restaurant, idx) => {
          const address = `${restaurant.address.building} ${restaurant.address.street}, ${restaurant.address.zipcode}`
          return (
            <div key={idx} className="col-lg-4 pb-3">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{restaurant.name}</h5>
                  <p className="card-text">
                    <strong>Cuisine: </strong>
                    {restaurant.cuisine}
                    <br />
                    <strong>Address: </strong>
                    {address}
                  </p>
                  <div
                    className="row"
                    style={{
                      justifyContent: "center",
                      paddingTop: ".5rem",
                      borderTop: "solid .1rem #dfdfdf",
                    }}
                  >
                    <Link
                      to={"/restaurants/" + restaurant._id}
                      className="btn btn-outline-primary col-lg-5 mx-1 mb-1"
                    >
                      View Reviews
                    </Link>
                    <a
                      target="_blank"
                      href={"https://www.google.com/maps/place/" + address}
                      className="btn btn-outline-primary col-lg-5 mx-1 mb-1"
                      rel="noreferrer"
                    >
                      View Map
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default RestaurantsList

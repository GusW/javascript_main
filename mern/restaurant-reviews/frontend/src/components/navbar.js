import React from "react"
import { Link } from "react-router-dom"

const Navbar = (props) => {
  const { logout, user } = props
  return (
    <nav className="navbar navbar-expand navbar-dark bg-dark">
      <a href="/restaurants" className="navbar-brand">
        Restaurant Reviews
      </a>
      <div className="navbar-nav mr-auto">
        <li className="nav-item">
          <Link to={"/restaurants"} className="nav-link">
            Restaurants
          </Link>
        </li>
        <li className="nav-item">
          {user ? (
            <a
              onClick={logout}
              className="nav-link"
              style={{ cursor: "pointer" }}
            >
              Logout {user.name}
            </a>
          ) : (
            <Link to={"/login"} className="nav-link">
              Login
            </Link>
          )}
        </li>
      </div>
    </nav>
  )
}

export default Navbar

import React, { useState } from "react"

import Navbar from "./components/navbar.js"
import ProjectRoutes from "./components/project-routes.js"

import "bootstrap/dist/css/bootstrap.min.css"

const App = () => {
  const [user, setUser] = useState(null)

  const login = async (user = null) => {
    setUser(user)
  }

  const logout = async () => {
    setUser(null)
  }

  return (
    <div>
      <Navbar logout={logout} user={user} />
      <ProjectRoutes login={login} user={user} />
    </div>
  )
}

export default App

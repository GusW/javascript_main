import React, { useState } from "react"
import { useNavigate } from "react-router-dom"

const initialUserState = {
  name: "",
  id: "",
}

const Login = (props) => {
  let navigate = useNavigate()

  const [user, setUser] = useState(initialUserState)

  const _handleInputChange = (event) => {
    const { name, value } = event.target
    setUser({ ...user, [name]: value })
  }

  const _login = () => {
    props.login(user)
    navigate(-1)
  }

  return (
    <div className="submit-form">
      <div className="row">
        <div className="form-group col">
          <label htmlFor="user">Username</label>
          <input
            type="text"
            className="form-control"
            id="name"
            required
            value={user.name}
            onChange={_handleInputChange}
            name="name"
          />
        </div>

        <div className="form-group col">
          <label htmlFor="id">ID</label>
          <input
            type="text"
            className="form-control"
            id="id"
            required
            value={user.id}
            onChange={_handleInputChange}
            name="id"
          />
        </div>
        <div
          className="form-group col"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "end",
          }}
        >
          <button
            onClick={_login}
            className="btn btn-success"
            style={{ width: "100%" }}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login

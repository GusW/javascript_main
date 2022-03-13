import { useEffect, useState } from 'react'

const UserTypeComponent = (props) => {
  const [admin, setAdmin] = useState(true)

  const userTypeMsg = `user is ${admin ? '' : 'not'} an admin`

  useEffect(() => {
    console.log(userTypeMsg)
  }, [userTypeMsg]) // dependency array - only gets fired when the admin changes

  return (
    <>
      <p>{userTypeMsg}</p>
      <button onClick={() => setAdmin(!admin)}>Toggle admin</button>
    </>
  )
}

export default UserTypeComponent

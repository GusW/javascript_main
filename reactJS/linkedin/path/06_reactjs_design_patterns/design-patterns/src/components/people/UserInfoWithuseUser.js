import { useUser } from '../../customHooks/useUser.js'

export const UserInfoWithuseUser = ({ userId }) => {
  const user = useUser(userId)

  const { name, age, hairColor, hobbies } = user || {}

  return user ? (
    <>
      <h3>{name}</h3>
      <p>Age: {age} years</p>
      <p>Hair Color: {hairColor}</p>
      <h3>Hobbies:</h3>
      <ul>
        {hobbies.map((hobby) => (
          <li key={hobby}>{hobby}</li>
        ))}
      </ul>
    </>
  ) : (
    <p>Loading...</p>
  )
}

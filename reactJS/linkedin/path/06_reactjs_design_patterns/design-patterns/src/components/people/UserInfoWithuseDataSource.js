import { useDataSource } from '../../customHooks/useDataSource.js'
import axios from 'axios'

const serverResource = (resourceUrl) => async () => {
  const response = await axios.get(resourceUrl)
  return response.data
}

const localStorageResource = (key) => () => localStorage.getItem(key)

export const UserInfoWithuseDataSource = ({ userId }) => {
  // const user = useResource(`/users/${userId}`);
  const user = useDataSource(serverResource(`/users/${userId}`))
  const message = useDataSource(localStorageResource('message'))

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
      <p>{message}</p>
    </>
  ) : (
    <p>Loading...</p>
  )
}

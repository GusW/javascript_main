import { useEffect, useState } from 'react'

const ComponentWithFetch = (props) => {
  const [data, setData] = useState([])

  useEffect(() => {
    fetch('https://api.github.com/users')
      .then((resp) => resp.json())
      .then(setData)
  }, [])

  return (
    <>
      <button onClick={() => setData([])}>Clear</button>
      <ul>
        {data?.map((user) => (
          <li key={user.id}>{user.login}</li>
        ))}
      </ul>
    </>
  )
}

export default ComponentWithFetch

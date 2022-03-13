import useFetch from './useFetch'

const UseFetchComponent = ({ login }) => {
  const { loading, data, error } = useFetch(
    `https://api.github.com/users/${login}`
  )

  if (loading) return <h1>Loading</h1>
  if (error) return <pre>{JSON.stringify(error, null, 2)}</pre>

  return (
    <>
      <img src={data.avatar_url} alt={data.login} />
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </>
  )
}

export default UseFetchComponent

const isObject = (target) => typeof target === 'object' && target !== null

export const RecursiveComponent = ({ data }) => {
  if (!isObject(data)) {
    return <li>{data}</li>
  }

  const pairs = Object.entries(data)

  return (
    <>
      {pairs.map(([key, value]) => (
        <li>
          {key}:
          <ul key={`${key}_${value}`}>
            <RecursiveComponent data={value} />
          </ul>
        </li>
      ))}
    </>
  )
}

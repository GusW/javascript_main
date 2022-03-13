import { useContext } from 'react'
import { TreesContext } from './ContextComponent'
import { useTrees } from './CustomContextComponent'

export const ComponentWithCustomContext = (props) => {
  const { trees } = useTrees()

  return (
    <>
      <h3>Trees I've heard about:</h3>
      <ul>
        {trees?.map((item) => (
          <li key={item.id}>{item.type}</li>
        ))}
      </ul>
    </>
  )
}

const ComponentWithContext = (props) => {
  const { trees } = useContext(TreesContext)

  return (
    <>
      <h3>Trees I've heard about:</h3>
      <ul>
        {trees?.map((item) => (
          <li key={item.id}>{item.type}</li>
        ))}
      </ul>
    </>
  )
}

export default ComponentWithContext

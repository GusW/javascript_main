import { useEffect, useState } from 'react'

const ComponentWithEffect = (props) => {
  const [name, setName] = useState('Foo')

  useEffect(() => {
    document.title = `Congrats ${name}!`
    console.log(`and the winner is: ${name}`)
  }, [name]) // dependency array - only gets fired when the name changes

  return (
    <>
      <p>Cogratulations {name}!</p>
      <button onClick={() => setName('Bar')}>Change</button>
    </>
  )
}

export default ComponentWithEffect

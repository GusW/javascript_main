import { useContext, useState } from 'react'
import { CounterContext } from './CounterContext'

export const CounterContextButton = () => {
  const { numberOfClicks, increment } = useContext(CounterContext)
  const [incrementBy, setIncrementBy] = useState(1)

  return (
    <>
      <p>You have clicked the button {numberOfClicks} times.</p>
      <label>
        Increment By:
        <input
          value={incrementBy}
          onChange={(e) => setIncrementBy(parseInt(e.target.value))}
          type="number"
        />
      </label>
      <button onClick={() => increment(incrementBy)}>Click</button>
    </>
  )
}

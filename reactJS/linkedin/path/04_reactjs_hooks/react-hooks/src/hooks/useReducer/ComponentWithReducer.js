import { useReducer } from 'react'

const initialState = { message: 'hi' }

const reducer = (state, action) => {
  switch (action.type) {
    case 'yell':
      return {
        message: 'HEY',
      }
    case 'whisper':
      return {
        message: 'excuse me',
      }
    default:
      return state
  }
}

const ComponentWithReducer = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <>
      <button onClick={() => dispatch({ type: 'yell' })}>YELL</button>
      <button onClick={() => dispatch({ type: 'whisper' })}>whisper</button>
      <p>Message: {state.message}</p>
    </>
  )
}

export default ComponentWithReducer

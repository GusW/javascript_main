import useInput from './useInput'

const UseInputComponent = (props) => {
  const [titleProps, resetTitle] = useInput('')
  const [colorProps, resetColor] = useInput('#000000')

  const submit = (e) => {
    e.preventDefault()
    alert(`${titleProps.value} sounds like ${colorProps.value}`)
    resetTitle()
    resetColor()
  }

  return (
    <>
      <form onSubmit={submit}>
        <input {...titleProps} type="text" placeholder="custom sound..." />
        <input {...colorProps} type="color" />
        <button>ADD</button>
      </form>
    </>
  )
}

export default UseInputComponent

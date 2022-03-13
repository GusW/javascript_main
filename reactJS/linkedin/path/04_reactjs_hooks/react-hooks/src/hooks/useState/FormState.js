import { useState } from 'react'

const Form = () => {
  const [sound, setSound] = useState('')
  const [color, setColor] = useState('#000000')

  const submit = (e) => {
    e.preventDefault()
    alert(`Sound: ${sound} - Color ${color}`)
    setSound('000000')
    setColor('#000000')
  }

  return (
    <form onSubmit={submit}>
      <input
        onChange={(e) => setSound(e.target.value)}
        value={sound}
        type="text"
        placeholder="Sound..."
      />
      <input
        onChange={(e) => setColor(e.target.value)}
        value={color}
        type="color"
      />
      <button>ADD</button>
    </form>
  )
}

export default Form

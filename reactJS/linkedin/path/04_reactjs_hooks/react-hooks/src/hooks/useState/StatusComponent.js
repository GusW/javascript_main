import { useState } from 'react'

const StatusComponent = (props) => {
  const [status, setStatus] = useState(false)

  return (
    <>
      <h4>Status: {status ? 'Delivered' : 'Not Delivered'}</h4>
      <button onClick={() => setStatus(!status)}>Toggle Status</button>
    </>
  )
}

export default StatusComponent

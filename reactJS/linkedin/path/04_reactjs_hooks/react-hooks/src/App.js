import { useReducer } from 'react'
import ComponentWithContext, {
  ComponentWithCustomContext,
} from './hooks/context/ComponentWithContext'
import ComponentWithEffect from './hooks/useEffect/ComponentWithEffect'
import ComponentWithFetch from './hooks/useEffect/ComponentWithFetch'
import ComponentWithReducer from './hooks/useReducer/ComponentWithReducer'
import FormRef from './hooks/useRef/FormRef'
import FormState from './hooks/useState/FormState'
import StarRating from './hooks/useState/Star'
import StatusComponent from './hooks/useState/StatusComponent'
import UseFetchComponent from './hooks/custom/UseFetchComponent'
import UseInputComponent from './hooks/custom/UseInputComponent'
import UserTypeComponent from './hooks/useEffect/UserTypeComponent'

import './App.css'

const App = () => {
  // useReducer (naive useState implementation)
  const [checked, toggleChecked] = useReducer((checked) => !checked, false)

  return (
    <>
      <div>
        <FormRef />
      </div>
      <div style={{ marginTop: '2rem' }}>
        <FormState />
      </div>
      <div style={{ marginTop: '2rem' }}>
        <UseInputComponent />
      </div>
      <div style={{ marginTop: '2rem' }}>
        <StatusComponent />
      </div>
      <div style={{ marginTop: '2rem' }}>
        <input type="checkbox" value={checked} onChange={toggleChecked} />
        <p>{checked ? 'checked' : 'nothing here'}</p>
      </div>
      <div style={{ marginTop: '2rem' }}>
        <StarRating totalStars={10} />
      </div>
      <div style={{ marginTop: '2rem' }}>
        <ComponentWithEffect />
      </div>
      <div style={{ marginTop: '2rem' }}>
        <UserTypeComponent />
      </div>
      <div style={{ marginTop: '2rem' }}>
        <ComponentWithFetch />
      </div>
      <div style={{ marginTop: '2rem' }}>
        <ComponentWithReducer />
      </div>
      <div style={{ marginTop: '2rem' }}>
        <ComponentWithContext />
      </div>
      <div style={{ marginTop: '2rem' }}>
        <ComponentWithCustomContext />
      </div>
      <div style={{ marginTop: '2rem' }}>
        <UseFetchComponent login="gusw" />
      </div>
    </>
  )
}

export default App

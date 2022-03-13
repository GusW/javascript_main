import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import { TreesContext, trees } from './hooks/context/ContextComponent'
import reportWebVitals from './reportWebVitals'

ReactDOM.render(
  // Replaced by created context
  // <React.StrictMode>
  //   <App />
  // </React.StrictMode>,
  <TreesContext.Provider value={{ trees }}>
    <App />
  </TreesContext.Provider>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()

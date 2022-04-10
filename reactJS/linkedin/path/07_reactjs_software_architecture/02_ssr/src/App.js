import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import styled from 'styled-components'
import { About, Articles, Home } from './pages'

const BigGreenHeading = styled.h1`
  color: green;
  font-size: 96px;
`

const App = () => (
  <>
    <BigGreenHeading>Server-Side Rendering Example</BigGreenHeading>
    <ul>
      <li>
        <Link to="/">Home</Link>
      </li>
      <li>
        <Link to="/about">About</Link>
      </li>
      <li>
        <Link to="/articles">Articles</Link>
      </li>
    </ul>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/articles" element={<Articles />} />
    </Routes>
  </>
)

export default App

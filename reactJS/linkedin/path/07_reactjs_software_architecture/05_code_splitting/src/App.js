import React, { lazy, Suspense } from 'react'
import { Routes, Route, Link } from 'react-router-dom'

const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))
const Articles = lazy(() => import('./pages/Articles'))

const App = () => (
  <>
    <h1>Server-Side Rendering Example</h1>
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
    <Suspense fallback={<p>Loading...</p>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/articles" element={<Articles />} />
      </Routes>
    </Suspense>
  </>
)

export default App

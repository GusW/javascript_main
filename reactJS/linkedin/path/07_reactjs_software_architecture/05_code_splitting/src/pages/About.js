import React, { useState, lazy, Suspense } from 'react'
import ErrorBoundary from '../ErrorBoundary'

const One = lazy(() => import('./One'))
const Two = lazy(() => import('./Two'))
const Three = lazy(() => import('./Three'))

export const About = () => {
  const [showComponents, setShowComponents] = useState(false)

  return (
    <>
      <h1>About</h1>
      {showComponents && (
        <Suspense fallback={<p>Loading Components...</p>}>
          <ErrorBoundary>
            <One />
          </ErrorBoundary>
          <ErrorBoundary>
            <Two />
          </ErrorBoundary>
          <ErrorBoundary>
            <Three />
          </ErrorBoundary>
        </Suspense>
      )}
      <button onClick={() => setShowComponents(!showComponents)}>
        {showComponents ? 'Hide' : 'Show'}
      </button>
    </>
  )
}

export default About

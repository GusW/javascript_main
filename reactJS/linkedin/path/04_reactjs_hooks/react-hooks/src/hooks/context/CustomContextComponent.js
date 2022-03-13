import { createContext, useContext } from 'react'

const trees = [
  { id: 1, type: 'Maple' },
  { id: 2, type: 'Oak' },
  { id: 3, type: 'Family' },
  { id: 4, type: 'Component' },
]

const TreesContext = createContext({ trees }) // no need to wrap App into Context.Provider

export const useTrees = () => useContext(TreesContext)

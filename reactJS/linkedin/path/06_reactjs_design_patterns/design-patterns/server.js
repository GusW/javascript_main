import express, { json } from 'express'
import { people, products } from './src/utils/dummyData.js'

const app = express()

app.use(json())

let users = [...people]
let currentUser = [...users].shift()

app.get('/current-user', (req, res) => {
  res.json(currentUser)
})

app.get('/users/:id', (req, res) => {
  const { id } = req.params

  res.json(users.find((user) => user.id === parseInt(id)))
})

app.post('/users/:id', (req, res) => {
  const { id } = req.params
  const { user: updatedUser } = req.body

  users = users.map((user) => (user.id === parseInt(id) ? updatedUser : user))

  res.json(users.find((user) => user.id === id))
})

app.get('/users', (req, res) => {
  res.json(users)
})

app.get('/products/:id', (req, res) => {
  const { id } = req.params

  res.json(products.find((product) => product.id === parseInt(id)))
})

app.get('/products', (req, res) => {
  res.json(products)
})

app.listen(8080, () => {
  console.log('Server is listening on port 8080')
})

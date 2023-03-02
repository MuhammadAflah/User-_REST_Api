const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')

const app = express()
app.use(bodyParser.json())

const usersPath = './data/data.json'

// GET /users - returns list of all users
app.get('/users', (req, res) => {
  const users = getUsers()
  res.json(users)
})


// POST /users - creates a new user
app.post('/users', (req, res) => {
  const users = getUsers()
  const newUser = req.body
  newUser.id = generateId(users)
  newUser.createdOn = new Date().toISOString()
  newUser.modifiedOn = newUser.createdOn
  users.push(newUser)
  saveUsers(users)
  res.json(newUser)
})

// PUT /users/:id - updates an existing user
app.put('/users/:id', (req, res) => {
  const users = getUsers()
  const userId = parseInt(req.params.id)
  const userIndex = users.findIndex(user => user.id === userId)
  if (userIndex < 0) {
    res.sendStatus(404)
  } else {
    const oldUser = users[userIndex]
    const newUser = req.body
    newUser.id = oldUser.id
    newUser.createdOn = oldUser.createdOn
    newUser.modifiedOn = new Date().toISOString()
    users[userIndex] = newUser
    saveUsers(users)
    res.json(newUser)
  }
})

// DELETE /users/:id - deletes an existing user
app.delete('/users/:id', (req, res) => {
  const users = getUsers()
  const userId = parseInt(req.params.id)
  const userIndex = users.findIndex(user => user.id === userId)
  if (userIndex < 0) {
    res.sendStatus(404)
  } else {
    users.splice(userIndex, 1)
    saveUsers(users)
    res.sendStatus(204)
  }
})

// Utility functions

function getUsers() {
  const data = fs.readFileSync(usersPath)
  return JSON.parse(data).users
}

function saveUsers(users) {
  const data = JSON.stringify({ users })
  fs.writeFileSync(usersPath, data)
}

function generateId(users) {
  const ids = users.map(user => user.id)
  const maxId = Math.max(...ids)
  return maxId + 1
}

// Start the server
const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Server started on port ${port}`)
})

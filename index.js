const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api/auth', require('./routes/auth'))

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Nisalavila API is running!' })
})

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
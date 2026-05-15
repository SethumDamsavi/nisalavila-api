
const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) return res.status(400).json({ message: 'Email already exists' })
    const hashed = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: { name, email, password: hashed }
    })
    res.status(201).json({ message: 'User created successfully', userId: user.id })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return res.status(404).json({ message: 'User not found' })
    const valid = await bcrypt.compare(password, user.password)
    if (!valid) return res.status(401).json({ message: 'Wrong password' })
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )
    res.json({ message: 'Login successful', token, role: user.role })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

module.exports = router
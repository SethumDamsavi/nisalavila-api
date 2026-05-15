const express = require('express')
const router = express.Router()
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// Get all charities
router.get('/', async (req, res) => {
  try {
    const charities = await prisma.charity.findMany({
      orderBy: { createdAt: 'desc' }
    })
    res.json(charities)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Get single charity by ID
router.get('/:id', async (req, res) => {
  try {
    const charity = await prisma.charity.findUnique({
      where: { id: parseInt(req.params.id) }
    })
    if (!charity) return res.status(404).json({ message: 'Charity not found' })
    res.json(charity)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Create a charity (admin only for now)
router.post('/', async (req, res) => {
  try {
    const { name, description, target } = req.body
    const charity = await prisma.charity.create({
      data: { name, description, target: parseFloat(target) }
    })
    res.status(201).json({ message: 'Charity created', charity })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Follow a charity
router.post('/:id/follow', async (req, res) => {
  try {
    const { userId } = req.body
    const charityId = parseInt(req.params.id)

    const charity = await prisma.charity.findUnique({
      where: { id: charityId }
    })
    if (!charity) return res.status(404).json({ message: 'Charity not found' })

    res.json({ message: `User ${userId} is now following charity ${charityId}` })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

module.exports = router
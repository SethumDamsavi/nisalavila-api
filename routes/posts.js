const express = require('express')
const router = express.Router()
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: 'desc' }
    })
    res.json(posts)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Create a post
router.post('/', async (req, res) => {
  try {
    const { title, content, charityId } = req.body
    const post = await prisma.post.create({
      data: {
        title,
        content,
        charityId: parseInt(charityId)
      }
    })
    res.status(201).json({ message: 'Post created', post })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Get posts by charity
router.get('/charity/:charityId', async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      where: { charityId: parseInt(req.params.charityId) },
      orderBy: { createdAt: 'desc' }
    })
    res.json(posts)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

module.exports = router
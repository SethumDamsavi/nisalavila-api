const express = require('express')
const router = express.Router()
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// Toggle like on a post
router.post('/toggle', async (req, res) => {
  try {
    const { postId, userId } = req.body

    const existing = await prisma.like.findFirst({
      where: {
        postId: parseInt(postId),
        userId: parseInt(userId)
      }
    })

    if (existing) {
      await prisma.like.delete({ where: { id: existing.id } })
      res.json({ liked: false, message: 'Post unliked' })
    } else {
      await prisma.like.create({
        data: {
          postId: parseInt(postId),
          userId: parseInt(userId)
        }
      })
      res.json({ liked: true, message: 'Post liked' })
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Get like count for a post
router.get('/post/:postId', async (req, res) => {
  try {
    const count = await prisma.like.count({
      where: { postId: parseInt(req.params.postId) }
    })
    res.json({ count })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Check if user liked a post
router.get('/check/:postId/:userId', async (req, res) => {
  try {
    const like = await prisma.like.findFirst({
      where: {
        postId: parseInt(req.params.postId),
        userId: parseInt(req.params.userId)
      }
    })
    res.json({ liked: !!like })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

module.exports = router
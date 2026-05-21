const express = require('express')
const router = express.Router()
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// Get all comments for a post
router.get('/post/:postId', async (req, res) => {
  try {
    const comments = await prisma.comment.findMany({
      where: { postId: parseInt(req.params.postId) },
      orderBy: { createdAt: 'desc' }
    })
    res.json(comments)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Add a comment
router.post('/', async (req, res) => {
  try {
    const { content, postId, userId, userName } = req.body
    const comment = await prisma.comment.create({
      data: {
        content,
        postId: parseInt(postId),
        userId: parseInt(userId),
        userName
      }
    })
    res.status(201).json({ message: 'Comment added', comment })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Delete a comment
router.delete('/:id', async (req, res) => {
  try {
    await prisma.comment.delete({
      where: { id: parseInt(req.params.id) }
    })
    res.json({ message: 'Comment deleted' })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

module.exports = router
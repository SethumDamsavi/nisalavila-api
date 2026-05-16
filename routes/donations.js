const express = require('express')
const router = express.Router()
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// Create an online donation
router.post('/', async (req, res) => {
  try {
    const { amount, userId, charityId } = req.body
    const donation = await prisma.donation.create({
      data: {
        amount: parseFloat(amount),
        userId: parseInt(userId),
        charityId: parseInt(charityId),
        type: 'online',
        status: 'pending'
      }
    })
    res.status(201).json({ message: 'Donation created', donation })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Get all donations for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const donations = await prisma.donation.findMany({
      where: { userId: parseInt(req.params.userId) },
      orderBy: { createdAt: 'desc' }
    })
    res.json(donations)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Get all donations for a charity
router.get('/charity/:charityId', async (req, res) => {
  try {
    const donations = await prisma.donation.findMany({
      where: { charityId: parseInt(req.params.charityId) },
      orderBy: { createdAt: 'desc' }
    })
    res.json(donations)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Upload bank slip (offline donation)
router.post('/offline', async (req, res) => {
  try {
    const { amount, userId, charityId } = req.body
    const donation = await prisma.donation.create({
      data: {
        amount: parseFloat(amount),
        userId: parseInt(userId),
        charityId: parseInt(charityId),
        type: 'offline',
        status: 'pending'
      }
    })
    res.status(201).json({
      message: 'Offline donation submitted, awaiting admin approval',
      donation
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Admin approve or reject donation
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body
    const donation = await prisma.donation.update({
      where: { id: parseInt(req.params.id) },
      data: { status }
    })
    res.json({ message: `Donation ${status}`, donation })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})
// Create Stripe payment intent
router.post('/create-payment-intent', async (req, res) => {
  try {
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
    const { amount } = req.body

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe uses cents
      currency: 'lkr',
      payment_method_types: ['card'],
    })

    res.json({
      clientSecret: paymentIntent.client_secret,
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
    })
  } catch (error) {
    res.status(500).json({ message: 'Payment error', error: error.message })
  }
})
module.exports = router
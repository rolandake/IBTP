// routes/interactions.js
import express from 'express'
import Interaction from '../models/Interaction.js'

const router = express.Router()

// GET all interactions
router.get('/', async (req, res) => {
  try {
    const interactions = await Interaction.find().sort({ createdAt: -1 })
    res.json(interactions)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// POST a new interaction
router.post('/', async (req, res) => {
  const newInteraction = new Interaction({
    question: req.body.question,
    response: req.body.response
  })

  try {
    const savedInteraction = await newInteraction.save()
    res.status(201).json(savedInteraction)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

export default router

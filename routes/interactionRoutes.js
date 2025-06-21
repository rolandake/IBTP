import express from 'express';
import { createInteraction, getHistory, deleteHistory } from '../controllers/interactionController.js';

const router = express.Router();

// POST créer interaction
router.post('/', createInteraction);

// GET historique
router.get('/history', getHistory);

// DELETE historique
router.delete('/history', deleteHistory);

export default router;

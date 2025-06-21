// routes/userRoutes.js

import express from 'express';
import { protect } from '../middlewares/auth.js';
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile
} from '../controllers/UserController.js';

const router = express.Router();

// Inscription et connexion ne nécessitent pas de token
router.post('/register', registerUser);
router.post('/login', loginUser);

// Routes protégées
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

export default router;

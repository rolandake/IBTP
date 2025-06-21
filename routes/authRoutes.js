// authRoutes.js
import express from 'express';
import { inscription, connexion } from './authController.js';

const router = express.Router();

router.post('/inscription', inscription);
router.post('/connexion', connexion);

export default router;

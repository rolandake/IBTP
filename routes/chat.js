// routes/chat.js

import express from 'express';
import { protect } from '../middlewares/auth.js';
import { chatHandler } from '../controllers/chatController.js';

const router = express.Router();

router.post('/', protect, chatHandler);

export default router;

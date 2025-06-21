// routes/projectRoutes.js

import express from 'express';
import { protect } from '../middlewares/auth.js';
import {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject
} from '../controllers/ProjectController.js';

const router = express.Router();

router.get('/', protect, getAllProjects);
router.get('/:id', protect, getProjectById);
router.post('/', protect, createProject);
router.put('/:id', protect, updateProject);
router.delete('/:id', protect, deleteProject);

export default router;

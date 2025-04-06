import express from 'express';
import upload from '../middleware/upload.middleware.js';
import authMiddleware from '../middleware/auth.middleware.js';

import {
  getUserById,
  getAllUsers,
  getStarted,
  updateUser,
  updateProfile,
  deleteUser,
  uploadImage,
} from '../controller/user.controller.js';

const router = express.Router();

router.get('/', getAllUsers);

router.post('/upload-img', authMiddleware, upload.single('file'), uploadImage);
router.post('/get-started', authMiddleware, getStarted);
router.get('/:userId', authMiddleware, getUserById);
router.put('/', authMiddleware, updateUser);
router.put('/profile-pic', authMiddleware, updateProfile);
router.delete('/', authMiddleware, deleteUser);

export default router;

import express from 'express';

import { createAnnouncement, editAnnouncement, deleteAnnouncement, likeAnnouncement, deleteLikeAnnouncement, getAnnouncementById, getAnnouncements } from '../controller/announcement.controller.js';
import { announcementSchema, updateAnnouncementSchema } from '../validations/announcement.validation.js';

import validate from '../middleware/validation.middleware.js';
import authMiddleware from '../middleware/auth.middleware.js';
import roleMiddleware from '../middleware/role.middleware.js'

const router = express.Router();

router.post('/', authMiddleware, roleMiddleware('leader'), validate(announcementSchema), createAnnouncement);
router.put('/:id', authMiddleware, roleMiddleware('leader'), validate(updateAnnouncementSchema), editAnnouncement);
router.delete('/:id', authMiddleware, roleMiddleware('leader'), deleteAnnouncement);

router.get('/add-like/:id', authMiddleware, likeAnnouncement);
router.get('/delete-like/:id', authMiddleware, deleteLikeAnnouncement);

router.get('/:id', getAnnouncementById);
router.get('/', getAnnouncements);

export default router;
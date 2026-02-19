import express from 'express'
import {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventsByOrganizer,
} from '../controllers/eventController.js'
import { verifyFirebaseToken } from '../middleware/auth.js'
import { requireAdmin, requireUser } from '../middleware/roleCheck.js'
import upload from '../config/multer.js'

const router = express.Router()

// Public routes
router.get('/', getEvents)
router.get('/:id', getEvent)
router.get('/organizer/:organizerId', getEventsByOrganizer)

// Protected routes - Admin only
router.post('/', verifyFirebaseToken, requireAdmin, upload.single('image'), createEvent)
router.put('/:id', verifyFirebaseToken, requireAdmin, upload.single('image'), updateEvent)
router.delete('/:id', verifyFirebaseToken, requireAdmin, deleteEvent)

export default router

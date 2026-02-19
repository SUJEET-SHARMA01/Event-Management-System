import express from 'express'
import {
  createBooking,
  getMyBookings,
  getBooking,
  cancelBooking,
  getAllBookings,
} from '../controllers/bookingController.js'
import { verifyFirebaseToken } from '../middleware/auth.js'
import { requireUser, requireAdmin } from '../middleware/roleCheck.js'

const router = express.Router()

// User routes
router.post('/', verifyFirebaseToken, requireUser, createBooking)
router.get('/my-bookings', verifyFirebaseToken, requireUser, getMyBookings)
router.get('/:id', verifyFirebaseToken, requireUser, getBooking)
router.put('/:id/cancel', verifyFirebaseToken, requireUser, cancelBooking)

// Admin routes
router.get('/', verifyFirebaseToken, requireAdmin, getAllBookings)

export default router

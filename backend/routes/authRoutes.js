import express from 'express'
import {
  register,
  getMe,
  updateProfile,
} from '../controllers/authController.js'
import { authenticate, verifyFirebaseToken } from '../middleware/auth.js'
import { requireUser } from '../middleware/roleCheck.js'

const router = express.Router()

// Public routes
router.post('/register', register)

// Protected routes
router.get('/me', verifyFirebaseToken, requireUser, getMe)
router.put('/profile', verifyFirebaseToken, requireUser, updateProfile)

export default router

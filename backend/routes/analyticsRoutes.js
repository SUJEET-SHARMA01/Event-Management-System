import express from 'express'
import {
  getDashboardAnalytics,
  getEventAnalytics,
} from '../controllers/analyticsController.js'
import { verifyFirebaseToken } from '../middleware/auth.js'
import { requireAdmin } from '../middleware/roleCheck.js'

const router = express.Router()

// All routes require admin access
router.get('/dashboard', verifyFirebaseToken, requireAdmin, getDashboardAnalytics)
router.get('/events', verifyFirebaseToken, requireAdmin, getEventAnalytics)

export default router

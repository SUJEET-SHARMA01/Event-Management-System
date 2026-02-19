import express from 'express'
import {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getUserStats,
} from '../controllers/userController.js'
import { verifyFirebaseToken } from '../middleware/auth.js'
import { requireAdmin } from '../middleware/roleCheck.js'

const router = express.Router()

// All routes require admin access
router.get('/', verifyFirebaseToken, requireAdmin, getUsers)
router.get('/:id', verifyFirebaseToken, requireAdmin, getUser)
router.get('/:id/stats', verifyFirebaseToken, requireAdmin, getUserStats)
router.put('/:id', verifyFirebaseToken, requireAdmin, updateUser)
router.delete('/:id', verifyFirebaseToken, requireAdmin, deleteUser)

export default router

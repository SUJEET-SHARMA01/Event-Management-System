import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import { notFound, errorHandler } from './middleware/errorHandler.js'

// Import routes
import authRoutes from './routes/authRoutes.js'
import eventRoutes from './routes/eventRoutes.js'
import bookingRoutes from './routes/bookingRoutes.js'
import userRoutes from './routes/userRoutes.js'
import analyticsRoutes from './routes/analyticsRoutes.js'

// Load environment variables
dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Serve uploaded files statically (if using local storage)
if (!process.env.CLOUDINARY_CLOUD_NAME) {
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
}

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  })
})

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/events', eventRoutes)
app.use('/api/bookings', bookingRoutes)
app.use('/api/users', userRoutes)
app.use('/api/analytics', analyticsRoutes)

// Error handling middleware (must be last)
app.use(notFound)
app.use(errorHandler)

export default app

import app from './app.js'
import connectDB from './config/database.js'
import initializeFirebase from './config/firebase.js'

const PORT = process.env.PORT || 5000

// Connect to MongoDB
connectDB()

// Initialize Firebase Admin
try {
  initializeFirebase()
} catch (error) {
  console.error('Firebase initialization failed:', error.message)
  console.log('Continuing without Firebase...')
}

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`)
})

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err.message)
  server.close(() => {
    process.exit(1)
  })
})

// Handle SIGTERM
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...')
  server.close(() => {
    console.log('Process terminated')
  })
})

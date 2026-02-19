import jwt from 'jsonwebtoken'
import { getFirebaseAdmin } from '../config/firebase.js'
import User from '../models/User.js'

// Verify Firebase ID token and create/update user in database
export const verifyFirebaseToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided. Authorization header must be: Bearer <token>',
      })
    }

    const idToken = authHeader.split('Bearer ')[1]

    // Verify Firebase token
    const firebaseAdmin = getFirebaseAdmin()
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken)

    // Find or create user in database
    let user = await User.findOne({ firebaseUID: decodedToken.uid })

    if (!user) {
      // Create new user
      user = await User.create({
        firebaseUID: decodedToken.uid,
        email: decodedToken.email,
        name: decodedToken.name || decodedToken.email.split('@')[0],
        avatar: decodedToken.picture,
        lastLogin: new Date(),
      })
    } else {
      // Update last login
      user.lastLogin = new Date()
      await user.save()
    }

    // Generate JWT token for backend use
    const jwtToken = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRE || '7d',
      }
    )

    req.user = user
    req.token = jwtToken
    req.firebaseUser = decodedToken

    next()
  } catch (error) {
    console.error('Firebase token verification error:', error.message)
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
      error: error.message,
    })
  }
}

// Verify JWT token (for backend-to-backend communication)
export const verifyJWT = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided',
      })
    }

    const token = authHeader.split('Bearer ')[1]

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const user = await User.findById(decoded.userId)

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'User not found or inactive',
      })
    }

    req.user = user
    req.token = token

    next()
  } catch (error) {
    console.error('JWT verification error:', error.message)
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
      error: error.message,
    })
  }
}

// Use Firebase token verification by default
export const authenticate = verifyFirebaseToken

import User from '../models/User.js'
import jwt from 'jsonwebtoken'
import { asyncHandler } from '../middleware/asyncHandler.js'

// @desc    Register/Login user (creates user in DB after Firebase auth)
// @route   POST /api/auth/register
// @access  Public
export const register = asyncHandler(async (req, res) => {
  // This endpoint is called after Firebase authentication
  // Firebase UID and user info should be in req.body from Firebase client
  const { firebaseUID, email, name, avatar } = req.body

  if (!firebaseUID || !email) {
    return res.status(400).json({
      success: false,
      message: 'Firebase UID and email are required',
    })
  }

  // Check if user already exists
  let user = await User.findOne({ firebaseUID })

  if (user) {
    // Update last login
    user.lastLogin = new Date()
    await user.save()

    const token = jwt.sign(
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

    return res.status(200).json({
      success: true,
      message: 'User logged in successfully',
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          avatar: user.avatar,
        },
        token,
      },
    })
  }

  // Create new user
  user = await User.create({
    firebaseUID,
    email,
    name: name || email.split('@')[0],
    avatar,
    lastLogin: new Date(),
  })

  const token = jwt.sign(
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

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
      },
      token,
    },
  })
})

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-__v')

  res.status(200).json({
    success: true,
    data: {
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
        phone: user.phone,
        createdAt: user.createdAt,
      },
    },
  })
})

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone, avatar } = req.body

  const user = await User.findById(req.user._id)

  if (name) user.name = name
  if (phone) user.phone = phone
  if (avatar) user.avatar = avatar

  await user.save()

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: {
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
        phone: user.phone,
      },
    },
  })
})

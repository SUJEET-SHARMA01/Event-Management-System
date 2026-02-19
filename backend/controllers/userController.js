import User from '../models/User.js'
import Booking from '../models/Booking.js'
import { asyncHandler } from '../middleware/asyncHandler.js'

// @desc    Get all users (Admin)
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, role, search } = req.query

  const query = {}

  if (role) {
    query.role = role
  }

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ]
  }

  const users = await User.find(query)
    .select('-__v')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec()

  const total = await User.countDocuments(query)

  res.status(200).json({
    success: true,
    count: users.length,
    total,
    pages: Math.ceil(total / limit),
    currentPage: page,
    data: users,
  })
})

// @desc    Get single user (Admin)
// @route   GET /api/users/:id
// @access  Private/Admin
export const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-__v')

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    })
  }

  res.status(200).json({
    success: true,
    data: user,
  })
})

// @desc    Update user (Admin)
// @route   PUT /api/users/:id
// @access  Private/Admin
export const updateUser = asyncHandler(async (req, res) => {
  const { name, email, role, phone, isActive } = req.body

  const user = await User.findById(req.params.id)

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    })
  }

  if (name) user.name = name
  if (email) user.email = email
  if (role) user.role = role
  if (phone !== undefined) user.phone = phone
  if (isActive !== undefined) user.isActive = isActive

  await user.save()

  res.status(200).json({
    success: true,
    message: 'User updated successfully',
    data: user,
  })
})

// @desc    Delete user (Admin)
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    })
  }

  // Prevent deleting yourself
  if (user._id.toString() === req.user._id.toString()) {
    return res.status(400).json({
      success: false,
      message: 'Cannot delete your own account',
    })
  }

  // Soft delete - set isActive to false
  user.isActive = false
  await user.save()

  res.status(200).json({
    success: true,
    message: 'User deleted successfully',
  })
})

// @desc    Get user statistics
// @route   GET /api/users/:id/stats
// @access  Private/Admin
export const getUserStats = asyncHandler(async (req, res) => {
  const userId = req.params.id

  const totalBookings = await Booking.countDocuments({ user: userId })
  const confirmedBookings = await Booking.countDocuments({ user: userId, status: 'confirmed' })
  const cancelledBookings = await Booking.countDocuments({ user: userId, status: 'cancelled' })

  const bookings = await Booking.find({ user: userId })
  const totalSpent = bookings.reduce((sum, booking) => {
    return booking.status === 'cancelled' ? sum : sum + booking.totalPrice
  }, 0)

  res.status(200).json({
    success: true,
    data: {
      totalBookings,
      confirmedBookings,
      cancelledBookings,
      totalSpent,
    },
  })
})

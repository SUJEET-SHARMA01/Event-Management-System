import Booking from '../models/Booking.js'
import Event from '../models/Event.js'
import { asyncHandler } from '../middleware/asyncHandler.js'

// @desc    Create booking
// @route   POST /api/bookings
// @access  Private
export const createBooking = asyncHandler(async (req, res) => {
  const { eventId, tickets } = req.body

  if (!eventId || !tickets || tickets < 1) {
    return res.status(400).json({
      success: false,
      message: 'Event ID and valid ticket count are required',
    })
  }

  const event = await Event.findById(eventId)

  if (!event || !event.isActive) {
    return res.status(404).json({
      success: false,
      message: 'Event not found',
    })
  }

  // Check availability
  const availableTickets = event.capacity - event.bookedTickets
  if (tickets > availableTickets) {
    return res.status(400).json({
      success: false,
      message: `Only ${availableTickets} tickets available`,
    })
  }

  const totalPrice = event.price * tickets

  const booking = await Booking.create({
    user: req.user._id,
    event: eventId,
    tickets,
    totalPrice,
    status: 'confirmed',
    paymentStatus: 'paid',
  })

  // Populate event details
  await booking.populate('event', 'title date location image')
  await booking.populate('user', 'name email')

  res.status(201).json({
    success: true,
    message: 'Booking created successfully',
    data: booking,
  })
})

// @desc    Get user bookings
// @route   GET /api/bookings/my-bookings
// @access  Private
export const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate('event', 'title date time location image price')
    .sort({ createdAt: -1 })

  res.status(200).json({
    success: true,
    count: bookings.length,
    data: bookings,
  })
})

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
export const getBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate('event', 'title date time location image price')
    .populate('user', 'name email')

  if (!booking) {
    return res.status(404).json({
      success: false,
      message: 'Booking not found',
    })
  }

  // Check if user owns the booking or is admin
  if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to view this booking',
    })
  }

  res.status(200).json({
    success: true,
    data: booking,
  })
})

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
export const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)

  if (!booking) {
    return res.status(404).json({
      success: false,
      message: 'Booking not found',
    })
  }

  // Check if user owns the booking or is admin
  if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to cancel this booking',
    })
  }

  if (booking.status === 'cancelled') {
    return res.status(400).json({
      success: false,
      message: 'Booking is already cancelled',
    })
  }

  // Update booking status
  booking.status = 'cancelled'
  booking.paymentStatus = 'refunded'

  // Decrease booked tickets count
  const event = await Event.findById(booking.event)
  event.bookedTickets -= booking.tickets
  await event.save()

  await booking.save()

  await booking.populate('event', 'title date location')
  await booking.populate('user', 'name email')

  res.status(200).json({
    success: true,
    message: 'Booking cancelled successfully',
    data: booking,
  })
})

// @desc    Get all bookings (Admin)
// @route   GET /api/bookings
// @access  Private/Admin
export const getAllBookings = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status, eventId, userId } = req.query

  const query = {}

  if (status) {
    query.status = status
  }

  if (eventId) {
    query.event = eventId
  }

  if (userId) {
    query.user = userId
  }

  const bookings = await Booking.find(query)
    .populate('event', 'title date location image')
    .populate('user', 'name email')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec()

  const total = await Booking.countDocuments(query)

  res.status(200).json({
    success: true,
    count: bookings.length,
    total,
    pages: Math.ceil(total / limit),
    currentPage: page,
    data: bookings,
  })
})

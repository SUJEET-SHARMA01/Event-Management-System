import Event from '../models/Event.js'
import Booking from '../models/Booking.js'
import { asyncHandler } from '../middleware/asyncHandler.js'

// @desc    Get all events
// @route   GET /api/events
// @access  Public
export const getEvents = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search, category, dateFrom, dateTo } = req.query

  const query = { isActive: true }

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { location: { $regex: search, $options: 'i' } },
    ]
  }

  if (category) {
    query.category = category
  }

  if (dateFrom || dateTo) {
    query.date = {}
    if (dateFrom) query.date.$gte = new Date(dateFrom)
    if (dateTo) query.date.$lte = new Date(dateTo)
  }

  const events = await Event.find(query)
    .populate('organizer', 'name email')
    .sort({ date: 1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec()

  const total = await Event.countDocuments(query)

  res.status(200).json({
    success: true,
    count: events.length,
    total,
    pages: Math.ceil(total / limit),
    currentPage: page,
    data: events,
  })
})

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
export const getEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id).populate('organizer', 'name email')

  if (!event || !event.isActive) {
    return res.status(404).json({
      success: false,
      message: 'Event not found',
    })
  }

  res.status(200).json({
    success: true,
    data: event,
  })
})

// @desc    Create event
// @route   POST /api/events
// @access  Private/Admin
export const createEvent = asyncHandler(async (req, res) => {
  req.body.organizer = req.user._id

  // Handle image upload
  if (req.file) {
    req.body.image = req.file.path || req.file.url
  }

  const event = await Event.create(req.body)

  res.status(201).json({
    success: true,
    message: 'Event created successfully',
    data: event,
  })
})

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private/Admin
export const updateEvent = asyncHandler(async (req, res) => {
  let event = await Event.findById(req.params.id)

  if (!event) {
    return res.status(404).json({
      success: false,
      message: 'Event not found',
    })
  }

  // Check if user is the organizer or admin
  if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update this event',
    })
  }

  // Handle image upload
  if (req.file) {
    req.body.image = req.file.path || req.file.url
  }

  event = await Event.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  res.status(200).json({
    success: true,
    message: 'Event updated successfully',
    data: event,
  })
})

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private/Admin
export const deleteEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id)

  if (!event) {
    return res.status(404).json({
      success: false,
      message: 'Event not found',
    })
  }

  // Check if user is the organizer or admin
  if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to delete this event',
    })
  }

  // Soft delete - set isActive to false
  event.isActive = false
  await event.save()

  res.status(200).json({
    success: true,
    message: 'Event deleted successfully',
  })
})

// @desc    Get events by organizer
// @route   GET /api/events/organizer/:organizerId
// @access  Public
export const getEventsByOrganizer = asyncHandler(async (req, res) => {
  const events = await Event.find({
    organizer: req.params.organizerId,
    isActive: true,
  })
    .populate('organizer', 'name email')
    .sort({ date: 1 })

  res.status(200).json({
    success: true,
    count: events.length,
    data: events,
  })
})

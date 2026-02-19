import Event from '../models/Event.js'
import Booking from '../models/Booking.js'
import User from '../models/User.js'
import { asyncHandler } from '../middleware/asyncHandler.js'

// @desc    Get dashboard analytics
// @route   GET /api/analytics/dashboard
// @access  Private/Admin
export const getDashboardAnalytics = asyncHandler(async (req, res) => {
  // Total events
  const totalEvents = await Event.countDocuments({ isActive: true })

  // Total bookings
  const totalBookings = await Booking.countDocuments()

  // Total revenue
  const bookings = await Booking.find({ status: 'confirmed', paymentStatus: 'paid' })
  const totalRevenue = bookings.reduce((sum, booking) => sum + booking.totalPrice, 0)

  // Total users
  const totalUsers = await User.countDocuments({ isActive: true })

  // Recent bookings (last 10)
  const recentBookings = await Booking.find()
    .populate('event', 'title date')
    .populate('user', 'name email')
    .sort({ createdAt: -1 })
    .limit(10)

  // Upcoming events (next 5)
  const upcomingEvents = await Event.find({
    isActive: true,
    date: { $gte: new Date() },
  })
    .sort({ date: 1 })
    .limit(5)

  // Events by status
  const eventsByStatus = {
    active: await Event.countDocuments({ isActive: true }),
    inactive: await Event.countDocuments({ isActive: false }),
  }

  // Bookings by status
  const bookingsByStatus = {
    confirmed: await Booking.countDocuments({ status: 'confirmed' }),
    pending: await Booking.countDocuments({ status: 'pending' }),
    cancelled: await Booking.countDocuments({ status: 'cancelled' }),
  }

  // Revenue by month (last 6 months)
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

  const monthlyRevenue = await Booking.aggregate([
    {
      $match: {
        status: 'confirmed',
        paymentStatus: 'paid',
        createdAt: { $gte: sixMonthsAgo },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
        },
        revenue: { $sum: '$totalPrice' },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { '_id.year': 1, '_id.month': 1 },
    },
  ])

  res.status(200).json({
    success: true,
    data: {
      overview: {
        totalEvents,
        totalBookings,
        totalRevenue,
        totalUsers,
      },
      eventsByStatus,
      bookingsByStatus,
      recentBookings,
      upcomingEvents,
      monthlyRevenue,
    },
  })
})

// @desc    Get event analytics
// @route   GET /api/analytics/events
// @access  Private/Admin
export const getEventAnalytics = asyncHandler(async (req, res) => {
  const { eventId } = req.query

  if (eventId) {
    // Single event analytics
    const event = await Event.findById(eventId)
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      })
    }

    const bookings = await Booking.find({ event: eventId })
    const confirmedBookings = await Booking.find({ event: eventId, status: 'confirmed' })

    const revenue = confirmedBookings.reduce((sum, booking) => sum + booking.totalPrice, 0)
    const attendanceRate = (event.bookedTickets / event.capacity) * 100

    return res.status(200).json({
      success: true,
      data: {
        event: {
          id: event._id,
          title: event.title,
          capacity: event.capacity,
          bookedTickets: event.bookedTickets,
          availableTickets: event.capacity - event.bookedTickets,
        },
        bookings: {
          total: bookings.length,
          confirmed: confirmedBookings.length,
          cancelled: bookings.filter((b) => b.status === 'cancelled').length,
        },
        revenue,
        attendanceRate: attendanceRate.toFixed(2),
      },
    })
  }

  // All events analytics
  const events = await Event.find({ isActive: true })
  const eventsWithStats = await Promise.all(
    events.map(async (event) => {
      const bookings = await Booking.find({ event: event._id })
      const confirmedBookings = await Booking.find({ event: event._id, status: 'confirmed' })
      const revenue = confirmedBookings.reduce((sum, booking) => sum + booking.totalPrice, 0)

      return {
        id: event._id,
        title: event.title,
        capacity: event.capacity,
        bookedTickets: event.bookedTickets,
        availableTickets: event.capacity - event.bookedTickets,
        totalBookings: bookings.length,
        revenue,
        attendanceRate: ((event.bookedTickets / event.capacity) * 100).toFixed(2),
      }
    })
  )

  res.status(200).json({
    success: true,
    count: eventsWithStats.length,
    data: eventsWithStats,
  })
})

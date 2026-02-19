import api from '../config/api.js'

export async function fetchUserBookings() {
  try {
    const response = await api.get('/bookings/my-bookings')
    
    // Transform backend response to match frontend format
    return response.data.map(booking => ({
      id: booking._id,
      eventId: booking.event._id || booking.event,
      eventTitle: typeof booking.event === 'object' ? booking.event.title : 'Event',
      date: booking.event?.date 
        ? new Date(booking.event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : new Date(booking.bookingDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      tickets: booking.tickets,
      status: booking.status.charAt(0).toUpperCase() + booking.status.slice(1),
      totalPrice: booking.totalPrice,
    }))
  } catch (error) {
    console.error('Fetch user bookings error:', error)
    throw error
  }
}

export async function fetchAllBookings() {
  try {
    const response = await api.get('/bookings')
    
    // Transform backend response to match frontend format
    return response.data.map(booking => ({
      id: booking._id,
      eventId: booking.event._id || booking.event,
      eventTitle: typeof booking.event === 'object' ? booking.event.title : 'Event',
      date: booking.event?.date 
        ? new Date(booking.event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : new Date(booking.bookingDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      tickets: booking.tickets,
      status: booking.status.charAt(0).toUpperCase() + booking.status.slice(1),
      user: typeof booking.user === 'object' ? booking.user.name : 'User',
      totalPrice: booking.totalPrice,
    }))
  } catch (error) {
    console.error('Fetch all bookings error:', error)
    throw error
  }
}

export async function createBooking(eventId, eventTitle, tickets = 1) {
  try {
    const response = await api.post('/bookings', {
      eventId,
      tickets,
    })
    
    const booking = response.data
    
    return {
      id: booking._id,
      eventId: booking.event._id || booking.event,
      eventTitle: typeof booking.event === 'object' ? booking.event.title : eventTitle,
      date: booking.event?.date 
        ? new Date(booking.event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      tickets: booking.tickets,
      status: booking.status.charAt(0).toUpperCase() + booking.status.slice(1),
    }
  } catch (error) {
    console.error('Create booking error:', error)
    throw error
  }
}

export async function cancelBooking(id) {
  try {
    const response = await api.put(`/bookings/${id}/cancel`)
    const booking = response.data
    
    return {
      id: booking._id,
      eventId: booking.event._id || booking.event,
      eventTitle: typeof booking.event === 'object' ? booking.event.title : 'Event',
      date: booking.event?.date 
        ? new Date(booking.event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : new Date(booking.bookingDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      tickets: booking.tickets,
      status: booking.status.charAt(0).toUpperCase() + booking.status.slice(1),
    }
  } catch (error) {
    console.error('Cancel booking error:', error)
    throw error
  }
}

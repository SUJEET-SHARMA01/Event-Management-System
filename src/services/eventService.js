import api from '../config/api.js'

export async function fetchEvents(params = {}) {
  try {
    const queryParams = new URLSearchParams()
    
    if (params.page) queryParams.append('page', params.page)
    if (params.limit) queryParams.append('limit', params.limit)
    if (params.search) queryParams.append('search', params.search)
    if (params.category) queryParams.append('category', params.category)
    if (params.dateFrom) queryParams.append('dateFrom', params.dateFrom)
    if (params.dateTo) queryParams.append('dateTo', params.dateTo)

    const queryString = queryParams.toString()
    const endpoint = queryString ? `/events?${queryString}` : '/events'

    const response = await api.get(endpoint)
    
    // Transform backend response to match frontend format
    return response.data.map(event => ({
      id: event._id,
      title: event.title,
      description: event.description,
      date: new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: event.time,
      location: event.location,
      price: event.price === 0 ? 'Free' : `$${event.price}`,
      image: event.image,
      capacity: event.capacity,
      bookedTickets: event.bookedTickets || 0,
      availableTickets: event.availableTickets || event.capacity,
      category: event.category,
      organizer: event.organizer,
    }))
  } catch (error) {
    console.error('Fetch events error:', error)
    throw error
  }
}

export async function fetchEventById(id) {
  try {
    const response = await api.get(`/events/${id}`)
    const event = response.data
    
    // Transform backend response to match frontend format
    return {
      id: event._id,
      title: event.title,
      description: event.description,
      date: new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: event.time,
      location: event.location,
      price: event.price === 0 ? 'Free' : `$${event.price}`,
      image: event.image,
      capacity: event.capacity,
      bookedTickets: event.bookedTickets || 0,
      availableTickets: event.availableTickets || event.capacity,
      category: event.category,
      organizer: event.organizer,
    }
  } catch (error) {
    console.error('Fetch event by ID error:', error)
    throw error
  }
}

export async function createEvent(payload) {
  try {
    const formData = new FormData()
    
    // Add all fields to FormData
    formData.append('title', payload.title)
    formData.append('description', payload.description)
    formData.append('date', payload.date)
    formData.append('time', payload.time)
    formData.append('location', payload.location)
    formData.append('price', payload.price || 0)
    formData.append('capacity', payload.capacity)
    if (payload.category) formData.append('category', payload.category)
    if (payload.image && payload.image instanceof File) {
      formData.append('image', payload.image)
    } else if (payload.image) {
      formData.append('image', payload.image) // URL string
    }

    const response = await api.post('/events', formData)
    const event = response.data
    
    return {
      id: event._id,
      title: event.title,
      description: event.description,
      date: new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: event.time,
      location: event.location,
      price: event.price === 0 ? 'Free' : `$${event.price}`,
      image: event.image,
      capacity: event.capacity,
    }
  } catch (error) {
    console.error('Create event error:', error)
    throw error
  }
}

export async function updateEvent(id, payload) {
  try {
    const formData = new FormData()
    
    // Add all fields to FormData
    if (payload.title) formData.append('title', payload.title)
    if (payload.description) formData.append('description', payload.description)
    if (payload.date) formData.append('date', payload.date)
    if (payload.time) formData.append('time', payload.time)
    if (payload.location) formData.append('location', payload.location)
    if (payload.price !== undefined) formData.append('price', payload.price)
    if (payload.capacity) formData.append('capacity', payload.capacity)
    if (payload.category) formData.append('category', payload.category)
    if (payload.image && payload.image instanceof File) {
      formData.append('image', payload.image)
    } else if (payload.image) {
      formData.append('image', payload.image)
    }

    const response = await api.put(`/events/${id}`, formData)
    const event = response.data
    
    return {
      id: event._id,
      title: event.title,
      description: event.description,
      date: new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: event.time,
      location: event.location,
      price: event.price === 0 ? 'Free' : `$${event.price}`,
      image: event.image,
      capacity: event.capacity,
    }
  } catch (error) {
    console.error('Update event error:', error)
    throw error
  }
}

export async function deleteEvent(id) {
  try {
    await api.delete(`/events/${id}`)
    return { id }
  } catch (error) {
    console.error('Delete event error:', error)
    throw error
  }
}

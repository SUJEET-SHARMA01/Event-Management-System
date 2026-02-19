import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react'
import * as bookingService from '../services/bookingService'
import { useAuth } from './AuthContext'

const BookingsContext = createContext(null)

export function BookingsProvider({ children }) {
  const { isAdmin } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState(null)

  // Fetch bookings (user or admin)
  const fetchBookings = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = isAdmin ? await bookingService.fetchAllBookings() : await bookingService.fetchUserBookings()
      setBookings(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [isAdmin])

  // Create booking
  const createBooking = useCallback(async (eventId, eventTitle, tickets = 1) => {
    setActionLoading(true)
    setError(null)
    try {
      const newBooking = await bookingService.createBooking(eventId, eventTitle, tickets)
      setBookings((prev) => [...prev, newBooking])
      return newBooking
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setActionLoading(false)
    }
  }, [])

  // Cancel booking
  const cancelBooking = useCallback(async (id) => {
    setActionLoading(true)
    setError(null)
    try {
      const updatedBooking = await bookingService.cancelBooking(id)
      setBookings((prev) => prev.map((b) => (b.id === id ? updatedBooking : b)))
      return updatedBooking
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setActionLoading(false)
    }
  }, [])

  // Clear error
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  // Load bookings on mount
  useEffect(() => {
    fetchBookings()
  }, [fetchBookings])

  const value = useMemo(
    () => ({
      bookings,
      loading,
      actionLoading,
      error,
      fetchBookings,
      createBooking,
      cancelBooking,
      clearError,
    }),
    [bookings, loading, actionLoading, error, fetchBookings, createBooking, cancelBooking, clearError]
  )

  return <BookingsContext.Provider value={value}>{children}</BookingsContext.Provider>
}

export function useBookings() {
  const context = useContext(BookingsContext)
  if (!context) {
    throw new Error('useBookings must be used within BookingsProvider')
  }
  return context
}

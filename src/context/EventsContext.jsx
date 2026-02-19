import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react'
import * as eventService from '../services/eventService'

const EventsContext = createContext(null)

export function EventsProvider({ children }) {
  const [events, setEvents] = useState([])
  const [currentEvent, setCurrentEvent] = useState(null)
  const [loading, setLoading] = useState(false)
  const [loadingOne, setLoadingOne] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState(null)

  // Fetch all events
  const fetchEvents = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await eventService.fetchEvents()
      setEvents(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch single event by ID
  const fetchEventById = useCallback(async (id) => {
    setLoadingOne(true)
    setError(null)
    try {
      const data = await eventService.fetchEventById(id)
      setCurrentEvent(data)
      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoadingOne(false)
    }
  }, [])

  // Create new event
  const createEvent = useCallback(async (payload) => {
    setActionLoading(true)
    setError(null)
    try {
      const newEvent = await eventService.createEvent(payload)
      setEvents((prev) => [...prev, newEvent])
      return newEvent
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setActionLoading(false)
    }
  }, [])

  // Update event
  const updateEvent = useCallback(async (id, payload) => {
    setActionLoading(true)
    setError(null)
    try {
      const updatedEvent = await eventService.updateEvent(id, payload)
      setEvents((prev) => prev.map((e) => (e.id === id ? updatedEvent : e)))
      if (currentEvent?.id === id) {
        setCurrentEvent(updatedEvent)
      }
      return updatedEvent
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setActionLoading(false)
    }
  }, [currentEvent])

  // Delete event
  const deleteEvent = useCallback(async (id) => {
    setActionLoading(true)
    setError(null)
    try {
      await eventService.deleteEvent(id)
      setEvents((prev) => prev.filter((e) => e.id !== id))
      if (currentEvent?.id === id) {
        setCurrentEvent(null)
      }
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setActionLoading(false)
    }
  }, [currentEvent])

  // Clear current event
  const clearCurrentEvent = useCallback(() => {
    setCurrentEvent(null)
    setError(null)
  }, [])

  // Clear error
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  // Load events on mount
  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  const value = useMemo(
    () => ({
      events,
      currentEvent,
      loading,
      loadingOne,
      actionLoading,
      error,
      fetchEvents,
      fetchEventById,
      createEvent,
      updateEvent,
      deleteEvent,
      clearCurrentEvent,
      clearError,
    }),
    [
      events,
      currentEvent,
      loading,
      loadingOne,
      actionLoading,
      error,
      fetchEvents,
      fetchEventById,
      createEvent,
      updateEvent,
      deleteEvent,
      clearCurrentEvent,
      clearError,
    ]
  )

  return <EventsContext.Provider value={value}>{children}</EventsContext.Provider>
}

export function useEvents() {
  const context = useContext(EventsContext)
  if (!context) {
    throw new Error('useEvents must be used within EventsProvider')
  }
  return context
}

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useEvents } from '../../context/EventsContext'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'

export default function CreateEventPage() {
  const navigate = useNavigate()
  const { createEvent, actionLoading } = useEvents()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    price: '',
    capacity: '',
    image: '',
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        date: new Date(formData.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        time: formData.time ? `${formData.time} - ${formData.time}` : 'TBD',
        location: formData.location,
        price: formData.price ? Number(formData.price) : 0,
        capacity: parseInt(formData.capacity) || 100,
        image: formData.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
      }
      await createEvent(payload)
      navigate('/admin/events')
    } catch (error) {
      // Error handled by context
    }
  }

  return (
    <div>
      <div className="mb-8">
        <Link to="/admin/events" className="text-sm text-gray-600 hover:text-primary-600 flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to events
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">Create Event</h1>
        <p className="text-gray-600">Add a new event to your platform.</p>
      </div>
      <Card>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Event title *</label>
            <input
              type="text"
              placeholder="e.g. Tech Summit 2025"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              rows={4}
              placeholder="Describe your event..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none resize-none"
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              placeholder="Venue name and address"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
              <input
                type="number"
                placeholder="0 for free"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
              <input
                type="number"
                placeholder="Max attendees"
                min="1"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Event image URL</label>
            <input
              type="url"
              placeholder="https://example.com/image.jpg"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            />
            <p className="mt-1 text-xs text-gray-500">Leave empty to use default image</p>
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={actionLoading}>
              {actionLoading ? 'Creating...' : 'Create Event'}
            </Button>
            <Link to="/admin/events">
              <Button variant="secondary" type="button">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </Card>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'

export default function ProfilePage() {
  const { user, updateProfile } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      })
    }
  }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      await updateProfile(formData)
      setSuccess('Profile updated successfully!')
    } catch (err) {
      setError(err.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
        <p className="mt-1 text-gray-600">Manage your account details.</p>
      </div>
      <Card>
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <img
            src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name || 'User')}&background=0284c7&color=fff`}
            alt={formData.name}
            className="w-24 h-24 rounded-full object-cover border-4 border-gray-100"
          />
          <div className="flex-1 w-full text-center sm:text-left">
            <h2 className="text-xl font-semibold text-gray-900">{formData.name || 'User'}</h2>
            <p className="text-gray-500">{formData.email}</p>
            {formData.phone && <p className="text-gray-500">{formData.phone}</p>}
            <Button variant="outline" size="sm" className="mt-4" disabled>
              Change Photo
            </Button>
          </div>
        </div>
      </Card>
      <Card className="mt-6">
        <h3 className="font-semibold text-gray-900 mb-4">Edit profile</h3>
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200 text-green-600 text-sm">
            {success}
          </div>
        )}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              disabled
              className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
            />
            <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            />
          </div>
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save changes'}
          </Button>
        </form>
      </Card>
    </div>
  )
}

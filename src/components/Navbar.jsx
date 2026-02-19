import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Button from './ui/Button'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/events', label: 'Events' },
  { to: '/bookings', label: 'My Bookings' },
  { to: '/profile', label: 'Profile' },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated, isAdmin, login, logout, user } = useAuth()

  const handleLogin = () => {
    navigate('/login')
  }

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-gray-100">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-primary-600">EventFlow</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`text-sm font-medium transition-colors ${
                  location.pathname === to ? 'text-primary-600' : 'text-gray-600 hover:text-primary-600'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-gray-600">{user?.name || user?.email}</span>
                {isAdmin && (
                  <Link to="/admin/dashboard">
                    <Button variant="ghost" size="sm">Admin Panel</Button>
                  </Link>
                )}
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={handleLogin}>
                  Login
                </Button>
                <Link to="/events">
                  <Button size="sm">Browse Events</Button>
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col gap-2">
              {navLinks.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    location.pathname === to ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {label}
                </Link>
              ))}
              <div className="mt-2 pt-2 border-t border-gray-100 space-y-2">
                {isAuthenticated ? (
                  <>
                    <div className="px-4 py-2 text-sm text-gray-600">{user?.name || user?.email}</div>
                    {isAdmin && (
                      <Link to="/admin/dashboard" onClick={() => setMobileOpen(false)}>
                        <Button variant="ghost" size="sm" className="w-full">Admin Panel</Button>
                      </Link>
                    )}
                    <Button variant="ghost" size="sm" className="w-full" onClick={() => { handleLogout(); setMobileOpen(false); }}>
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" size="sm" className="w-full" onClick={() => { handleLogin(); setMobileOpen(false); }}>
                      Login
                    </Button>
                    <Link to="/events" onClick={() => setMobileOpen(false)}>
                      <Button size="sm" className="w-full">Browse Events</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

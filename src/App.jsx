import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import UserLayout from './layouts/UserLayout'
import AdminLayout from './layouts/AdminLayout'

// User routes
import LandingPage from './pages/user/LandingPage'
import EventsPage from './pages/user/EventsPage'
import EventDetailsPage from './pages/user/EventDetailsPage'
import MyBookingsPage from './pages/user/MyBookingsPage'
import ProfilePage from './pages/user/ProfilePage'
import LoginPage from './pages/auth/LoginPage'

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard'
import CreateEventPage from './pages/admin/CreateEventPage'
import ManageEventsPage from './pages/admin/ManageEventsPage'
import ManageBookingsPage from './pages/admin/ManageBookingsPage'

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* User routes with layout */}
      <Route element={<UserLayout />}>
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/:id" element={<EventDetailsPage />} />
        <Route
          path="/bookings"
          element={
            <ProtectedRoute>
              <MyBookingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Admin routes with protected layout */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requireAdmin>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="events/create" element={<CreateEventPage />} />
        <Route path="events" element={<ManageEventsPage />} />
        <Route path="bookings" element={<ManageBookingsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App

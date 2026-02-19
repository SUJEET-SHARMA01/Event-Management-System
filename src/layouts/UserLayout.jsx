import { Outlet, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

export default function UserLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <footer className="bg-gray-900 text-gray-400 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <span className="font-semibold text-white">EventFlow</span>
          <div className="flex gap-6 text-sm">
            <Link to="/events" className="hover:text-white">Events</Link>
            <Link to="/bookings" className="hover:text-white">My Bookings</Link>
            <Link to="/profile" className="hover:text-white">Profile</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

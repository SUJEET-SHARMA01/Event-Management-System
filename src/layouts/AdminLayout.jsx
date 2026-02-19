import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      <div className="pl-64 min-h-screen">
        <header className="sticky top-0 z-20 bg-gray-100 border-b border-gray-200 px-8 py-4">
          <h1 className="text-lg font-semibold text-gray-800">Admin Panel</h1>
        </header>
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

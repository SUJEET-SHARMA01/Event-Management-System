import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { EventsProvider } from './context/EventsContext'
import { BookingsProvider } from './context/BookingsContext'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <EventsProvider>
          <BookingsProvider>
            <App />
          </BookingsProvider>
        </EventsProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)

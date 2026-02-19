import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Button from '../../components/ui/Button'

const sliderImages = [
  {
    url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80',
    alt: 'Tech Summit',
  },
  {
    url: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=1200&q=80',
    alt: 'Jazz Night',
  },
  {
    url: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1200&q=80',
    alt: 'Startup Pitch',
  },
  {
    url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200&q=80',
    alt: 'Wellness Retreat',
  },
]

export default function LandingPage() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length)
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(interval)
  }, [])

  const goToSlide = (index) => {
    setCurrentSlide(index)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main>
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-primary-100/50" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-28 lg:pt-28 lg:pb-36">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight">
                Discover & book
                <span className="text-primary-600"> events</span> that matter
              </h1>
              <p className="mt-6 text-lg text-gray-600">
                From conferences to concerts, find the perfect event and secure your spot in seconds.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/events">
                  <Button size="lg" className="w-full sm:w-auto">
                    Browse Events
                  </Button>
                </Link>
                <Link to="/events">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    View Upcoming
                  </Button>
                </Link>
              </div>
            </div>
            <div className="mt-16 lg:mt-24 flex justify-center">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-100 max-w-4xl w-full aspect-video bg-gray-100 group">
                {/* Slider Container */}
                <div className="relative w-full h-full overflow-hidden">
                  {sliderImages.map((image, index) => (
                    <div
                      key={index}
                      className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                        index === currentSlide ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      <img
                        src={image.url}
                        alt={image.alt}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>

                {/* Navigation Dots */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                  {sliderImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        index === currentSlide
                          ? 'w-8 bg-white'
                          : 'w-2 bg-white/50 hover:bg-white/75'
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>

                {/* Previous/Next Buttons */}
                <button
                  onClick={() => setCurrentSlide((prev) => (prev - 1 + sliderImages.length) % sliderImages.length)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
                  aria-label="Previous slide"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => setCurrentSlide((prev) => (prev + 1) % sliderImages.length)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
                  aria-label="Next slide"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </section>
        <section className="py-20 bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900">Why EventFlow?</h2>
            <p className="mt-2 text-center text-gray-600 max-w-2xl mx-auto">
              We make event discovery and booking simple and secure.
            </p>
            <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { title: 'Easy booking', desc: 'Book tickets in a few clicks. No hassle.', icon: '🎫' },
                { title: 'Secure payments', desc: 'Your data and payments are protected.', icon: '🔒' },
                { title: 'Manage bookings', desc: 'View and manage all your bookings in one place.', icon: '📋' },
              ].map((item) => (
                <div key={item.title} className="text-center p-6 rounded-xl bg-gray-50 border border-gray-100">
                  <span className="text-4xl">{item.icon}</span>
                  <h3 className="mt-4 font-semibold text-gray-900">{item.title}</h3>
                  <p className="mt-2 text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="py-20 bg-primary-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white">Ready to find your next event?</h2>
            <p className="mt-2 text-primary-100">Join thousands of attendees. Start exploring today.</p>
            <Link to="/events" className="inline-block mt-8">
              <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-100">
                Get Started
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <footer className="bg-gray-900 text-gray-400 py-12">
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

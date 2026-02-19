import { Link } from 'react-router-dom'
import Card from './ui/Card'
import Button from './ui/Button'

export default function EventCard({ event }) {
  const { id, image, title, date, location, price } = event
  return (
    <Card padding={false} className="group hover:shadow-md transition-shadow">
      <Link to={`/events/${id}`} className="block">
        <div className="aspect-[4/3] overflow-hidden rounded-t-xl bg-gray-100">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </Link>
      <div className="p-5">
        <Link to={`/events/${id}`}>
          <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2">
            {title}
          </h3>
        </Link>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {date}
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {location}
          </span>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-lg font-semibold text-primary-600">{price}</span>
          <Link to={`/events/${id}`} onClick={(e) => e.stopPropagation()}>
            <Button size="sm">Book Now</Button>
          </Link>
        </div>
      </div>
    </Card>
  )
}

# Event Management System

A full-stack event management application with React frontend and Node.js/Express backend.

## Features

### Frontend
- React with React Router
- Context API for state management
- Tailwind CSS for styling
- Firebase Authentication (Email/Password + Google)
- Responsive design
- Image slider on landing page

### Backend
- Node.js + Express.js
- MongoDB with Mongoose
- Firebase Admin SDK for authentication
- JWT token generation
- Role-based access control (Admin/User)
- Image upload support (Cloudinary/Local)
- RESTful API

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Firebase project with Authentication enabled

### Installation

1. **Install all dependencies** (frontend + backend):
```bash
npm run install:all
```

2. **Set up environment variables**:

**Frontend** - Create `.env` file in root:
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

**Backend** - Create `backend/.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/event-management
JWT_SECRET=your-jwt-secret
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-service-account-email
FRONTEND_URL=http://localhost:5173
```

See `backend/.env.example` for all backend environment variables.

### Running the Application

**Run separately:**

Frontend only:
```bash
npm run dev:frontend
```

Backend only:
```bash
npm run dev:backend
```

## Project Structure

```
event-management-system/
├── backend/                 # Backend API
│   ├── config/             # Configuration files
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Express middleware
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── server.js          # Server entry point
│   └── app.js             # Express app
├── src/                    # Frontend React app
│   ├── components/        # React components
│   ├── context/           # Context providers
│   ├── pages/            # Page components
│   ├── services/         # API services
│   └── config/           # Configuration
└── package.json
```

## Available Scripts

- `npm run dev` / `npm start` - Run frontend (Vite)
- `npm run dev:frontend` - Run frontend only
- `npm run dev:backend` - Run backend only
- `npm run install:all` - Install dependencies for both frontend and backend
- `npm run build` - Build frontend for production
- `npm run preview` - Preview production build

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register/Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get single event
- `POST /api/events` - Create event (Admin)
- `PUT /api/events/:id` - Update event (Admin)
- `DELETE /api/events/:id` - Delete event (Admin)

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/my-bookings` - Get user bookings
- `PUT /api/bookings/:id/cancel` - Cancel booking
- `GET /api/bookings` - Get all bookings (Admin)

### Users (Admin)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Analytics (Admin)
- `GET /api/analytics/dashboard` - Dashboard analytics
- `GET /api/analytics/events` - Event analytics

## Authentication Flow

1. User authenticates with Firebase (Email/Password or Google)
2. Frontend receives Firebase ID token
3. Frontend sends token to backend `/api/auth/register`
4. Backend verifies token and creates/updates user in MongoDB
5. Backend returns JWT token
6. Frontend stores tokens and user is authenticated

## Development

### Frontend Development
- Uses Vite for fast development
- Hot module replacement enabled
- Tailwind CSS for styling

### Backend Development
- Uses nodemon for auto-reload
- MongoDB for database
- Express.js for API

## Production Deployment

1. Set `NODE_ENV=production`
2. Build frontend: `npm run build`
3. Configure production environment variables
4. Deploy backend to hosting service (Heroku, Railway, Render, etc.)
5. Deploy frontend to hosting service (Vercel, Netlify, etc.)
6. Update `VITE_API_BASE_URL` to production backend URL

## License

ISC

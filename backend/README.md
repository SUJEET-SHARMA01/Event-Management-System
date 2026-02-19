# Event Management System - Backend API

A comprehensive backend API for managing events, bookings, and users built with Node.js, Express.js, MongoDB, and Firebase Authentication.

## Features

- **Authentication**: Firebase Authentication (Email/Password + Google Login)
- **Authorization**: JWT-based role-based access control (Admin/User)
- **Event Management**: Create, read, update, delete events
- **Booking System**: Book events, view bookings, cancel bookings
- **User Management**: Admin can manage users
- **Analytics Dashboard**: Comprehensive analytics for admins
- **Image Upload**: Support for event images via Cloudinary or local storage

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **Authentication**: Firebase Admin SDK
- **File Upload**: Multer + Cloudinary
- **Validation**: Express Validator

## Project Structure

```
backend/
├── config/
│   ├── database.js       # MongoDB connection
│   ├── firebase.js       # Firebase Admin initialization
│   └── multer.js         # File upload configuration
├── controllers/
│   ├── authController.js      # Authentication logic
│   ├── eventController.js     # Event CRUD operations
│   ├── bookingController.js   # Booking operations
│   ├── userController.js      # User management
│   └── analyticsController.js # Analytics & dashboard
├── middleware/
│   ├── auth.js           # Authentication middleware
│   ├── roleCheck.js      # Role-based access control
│   ├── errorHandler.js   # Error handling middleware
│   └── asyncHandler.js   # Async error wrapper
├── models/
│   ├── User.js           # User schema
│   ├── Event.js          # Event schema
│   └── Booking.js        # Booking schema
├── routes/
│   ├── authRoutes.js     # Auth endpoints
│   ├── eventRoutes.js    # Event endpoints
│   ├── bookingRoutes.js  # Booking endpoints
│   ├── userRoutes.js     # User endpoints
│   └── analyticsRoutes.js # Analytics endpoints
├── app.js                # Express app configuration
├── server.js             # Server entry point
├── package.json
└── .env.example          # Environment variables template
```

## Installation

1. **Install dependencies**:
```bash
cd backend
npm install
```

2. **Set up environment variables**:
```bash
cp .env.example .env
```

3. **Configure `.env` file**:
   - MongoDB URI
   - Firebase Admin credentials
   - JWT secret
   - Cloudinary credentials (optional)
   - Frontend URL for CORS

4. **Start the server**:
```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

## Environment Variables

See `.env.example` for all required environment variables:

- `PORT`: Server port (default: 5000)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `FIREBASE_*`: Firebase Admin SDK credentials
- `CLOUDINARY_*`: Cloudinary credentials (optional)
- `FRONTEND_URL`: Frontend URL for CORS

## API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register/Login user (after Firebase auth)
- `GET /me` - Get current user
- `PUT /profile` - Update user profile

### Events (`/api/events`)
- `GET /` - Get all events (with pagination, search, filters)
- `GET /:id` - Get single event
- `POST /` - Create event (Admin only)
- `PUT /:id` - Update event (Admin only)
- `DELETE /:id` - Delete event (Admin only)
- `GET /organizer/:organizerId` - Get events by organizer

### Bookings (`/api/bookings`)
- `POST /` - Create booking (User)
- `GET /my-bookings` - Get user's bookings (User)
- `GET /:id` - Get single booking
- `PUT /:id/cancel` - Cancel booking (User)
- `GET /` - Get all bookings (Admin)

### Users (`/api/users`)
- `GET /` - Get all users (Admin)
- `GET /:id` - Get single user (Admin)
- `GET /:id/stats` - Get user statistics (Admin)
- `PUT /:id` - Update user (Admin)
- `DELETE /:id` - Delete user (Admin)

### Analytics (`/api/analytics`)
- `GET /dashboard` - Get dashboard analytics (Admin)
- `GET /events` - Get event analytics (Admin)

## Authentication Flow

1. **Frontend**: User authenticates with Firebase (Email/Password or Google)
2. **Frontend**: Receives Firebase ID token
3. **Frontend**: Sends Firebase ID token to backend in `Authorization: Bearer <token>` header
4. **Backend**: Verifies Firebase token using Firebase Admin SDK
5. **Backend**: Creates/updates user in MongoDB
6. **Backend**: Generates JWT token for backend use
7. **Backend**: Returns user data and JWT token

## Role-Based Access Control

- **User**: Can view events, create bookings, manage own bookings
- **Admin**: Full access including event management, user management, analytics

## Image Upload

The system supports two upload methods:

1. **Cloudinary** (Recommended): Configure Cloudinary credentials in `.env`
2. **Local Storage**: Files saved to `uploads/` directory (if Cloudinary not configured)

## Database Models

### User
- Firebase UID, email, name, role, phone, avatar
- Tracks last login and active status

### Event
- Title, description, date, time, location, price, capacity
- Image URL, category, organizer reference
- Tracks booked tickets count

### Booking
- User reference, event reference, tickets count
- Total price, status (pending/confirmed/cancelled)
- Payment status

## Error Handling

All errors are handled by centralized error middleware:
- Validation errors
- Authentication errors
- Authorization errors
- Database errors
- File upload errors

## Security Features

- Firebase token verification
- JWT token validation
- Role-based access control
- Input validation
- CORS configuration
- File type and size restrictions

## Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Run in production mode
npm start
```

## Testing

Use tools like Postman or Thunder Client to test API endpoints. Make sure to:

1. Authenticate with Firebase first
2. Include Firebase ID token in `Authorization` header
3. Use appropriate role (admin/user) for protected routes

## Production Deployment

1. Set `NODE_ENV=production`
2. Use secure MongoDB connection string
3. Configure Firebase Admin SDK properly
4. Set strong JWT secret
5. Configure Cloudinary for image uploads
6. Set up proper CORS origins
7. Use environment variables for all sensitive data

## License

ISC

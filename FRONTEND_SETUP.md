# Frontend to Backend Integration Guide

## Setup Steps

### 1. Install Firebase Dependencies

```bash
npm install firebase
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory (copy from `.env.example`):

```env
# Backend API URL
VITE_API_BASE_URL=http://localhost:5000/api

# Firebase Configuration (get from Firebase Console)
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

### 3. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing
3. Enable Authentication:
   - Go to **Authentication** > **Sign-in method**
   - Enable **Email/Password**
   - Enable **Google** sign-in provider
4. Get Web App Configuration:
   - Go to **Project Settings** > **General**
   - Scroll to **Your apps** section
   - Click **Web** icon (`</>`)
   - Copy the Firebase configuration object
   - Add values to `.env` file

### 4. Start Backend Server

Make sure the backend is running:

```bash
cd backend
npm install
npm run dev
```

Backend should be running on `http://localhost:5000`

### 5. Start Frontend

```bash
npm install
npm run dev
```

Frontend should be running on `http://localhost:5173`

## Authentication Flow

1. **User clicks Login** → Redirects to `/login`
2. **User signs in** with Email/Password or Google
3. **Firebase authenticates** → Returns Firebase ID token
4. **Frontend sends token** to backend `/api/auth/register`
5. **Backend verifies token** → Creates/updates user in MongoDB
6. **Backend returns JWT** → Stored in localStorage
7. **User is authenticated** → Can access protected routes

## API Integration

All API calls are now connected to the backend:

- **Events**: `/api/events`
- **Bookings**: `/api/bookings`
- **Auth**: `/api/auth`
- **Users**: `/api/users` (Admin only)
- **Analytics**: `/api/analytics` (Admin only)

## Features Connected

✅ **Authentication**
- Email/Password login
- Google Sign-in
- User registration
- Logout

✅ **Events**
- View all events
- View event details
- Create event (Admin)
- Update event (Admin)
- Delete event (Admin)

✅ **Bookings**
- Create booking
- View user bookings
- Cancel booking
- View all bookings (Admin)

✅ **User Management**
- Update profile
- View profile
- Manage users (Admin)

## Testing

1. **Start both servers** (backend and frontend)
2. **Navigate to** `http://localhost:5173`
3. **Click Login** → Sign up or sign in
4. **Browse events** → View and book events
5. **Check bookings** → View your bookings

## Troubleshooting

### CORS Errors
- Ensure `FRONTEND_URL` in backend `.env` matches frontend URL
- Default: `http://localhost:5173`

### Authentication Errors
- Check Firebase configuration in `.env`
- Verify Firebase Authentication is enabled
- Check browser console for errors

### API Connection Errors
- Verify backend is running on port 5000
- Check `VITE_API_BASE_URL` in frontend `.env`
- Check network tab in browser DevTools

### Token Errors
- Clear localStorage and try logging in again
- Check Firebase token expiration
- Verify backend Firebase Admin SDK configuration

## Next Steps

1. Test all features end-to-end
2. Add error handling UI
3. Add loading states
4. Add form validation
5. Deploy to production

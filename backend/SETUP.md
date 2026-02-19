# Backend Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Environment Setup

Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 3. Configure MongoDB

**Option A: Local MongoDB**
- Install MongoDB locally
- Update `MONGODB_URI=mongodb://localhost:27017/event-management`

**Option B: MongoDB Atlas (Cloud)**
- Create account at https://www.mongodb.com/cloud/atlas
- Create cluster and database
- Get connection string
- Update `MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/event-management`

### 4. Configure Firebase Authentication

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use existing
3. Enable Authentication:
   - Go to Authentication > Sign-in method
   - Enable Email/Password
   - Enable Google Sign-in
4. Get Service Account credentials:
   - Go to Project Settings > Service Accounts
   - Click "Generate new private key"
   - Download JSON file
5. Copy values from JSON to `.env`:
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_PRIVATE_KEY_ID`
   - `FIREBASE_PRIVATE_KEY` (keep the `\n` characters)
   - `FIREBASE_CLIENT_EMAIL`
   - `FIREBASE_CLIENT_ID`
   - Other Firebase URLs

### 5. Configure JWT Secret

Generate a strong secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Add to `.env`:
```
JWT_SECRET=your-generated-secret-here
```

### 6. Configure Image Upload (Optional)

**Option A: Cloudinary (Recommended)**
1. Sign up at https://cloudinary.com/
2. Get credentials from dashboard
3. Add to `.env`:
   ```
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```

**Option B: Local Storage**
- Leave Cloudinary variables empty
- Images will be saved to `uploads/` folder
- Make sure `uploads/` folder exists (created automatically)

### 7. Start the Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

Server will run on `http://localhost:5000` (or PORT from .env)

## Testing the API

### Health Check
```bash
curl http://localhost:5000/health
```

### Test Authentication Flow

1. **Frontend**: User logs in with Firebase
2. **Frontend**: Gets Firebase ID token
3. **Frontend**: Sends token to backend:
   ```javascript
   fetch('http://localhost:5000/api/auth/me', {
     headers: {
       'Authorization': `Bearer ${firebaseIdToken}`
     }
   })
   ```

## Common Issues

### MongoDB Connection Error
- Check MongoDB is running
- Verify connection string in `.env`
- Check network/firewall settings

### Firebase Initialization Error
- Verify all Firebase credentials in `.env`
- Check private key format (should include `\n` for newlines)
- Ensure Firebase Admin SDK is properly configured

### Image Upload Not Working
- If using Cloudinary: Check credentials
- If using local: Ensure `uploads/` folder exists and is writable
- Check file size (max 5MB)

### CORS Errors
- Update `FRONTEND_URL` in `.env` to match your frontend URL
- Default: `http://localhost:5173` (Vite default)

## Next Steps

1. Integrate with frontend
2. Update frontend API calls to use backend endpoints
3. Test all endpoints with Postman/Thunder Client
4. Set up production environment variables
5. Deploy backend to hosting service (Heroku, Railway, Render, etc.)

## API Documentation

See `README.md` for complete API endpoint documentation.

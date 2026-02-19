# Quick Start Guide

## One Command Setup

### 1. Install All Dependencies
```bash
npm run install:all
```

This installs dependencies for both frontend and backend.

### 2. Configure Environment Variables

**Frontend** - Create `.env` in root:
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_FIREBASE_API_KEY=your-key
VITE_FIREBASE_AUTH_DOMAIN=your-domain
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

**Backend** - Create `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/event-management
JWT_SECRET=your-secret-key
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
FRONTEND_URL=http://localhost:5173
```

### 3. Run Frontend + Backend (two terminals)

Frontend:

```bash
npm run dev:frontend
```

Backend:

```bash
npm run dev:backend
```

## Available Commands

| Command | Description |
|---------|-------------|
| `npm start` | Run frontend (same as `npm run dev`) |
| `npm run dev:frontend` | Run frontend only |
| `npm run dev:backend` | Run backend only |
| `npm run install:all` | Install all dependencies |
| `npm run build` | Build frontend for production |

## Troubleshooting

### Port Already in Use
If port 5000 or 5173 is already in use:
- Change `PORT` in `backend/.env`
- Change Vite port: `vite --port 3000`

### MongoDB Connection Error
- Make sure MongoDB is running
- Check `MONGODB_URI` in `backend/.env`
- For MongoDB Atlas, use connection string format

### Firebase Errors
- Verify all Firebase credentials in `.env` files
- Check Firebase Authentication is enabled
- Ensure Firebase Admin SDK is configured correctly

## Next Steps

1. Open `http://localhost:5173` in your browser
2. Click "Login" to create an account
3. Start using the application!

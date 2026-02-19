import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import createUploadsDir from '../utils/createUploadsDir.js'

// Create uploads directory if using local storage
if (!process.env.CLOUDINARY_CLOUD_NAME) {
  createUploadsDir()
}

// Configure Cloudinary if credentials are provided
if (process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  })
}

// Configure multer storage
let storage

if (process.env.CLOUDINARY_CLOUD_NAME) {
  // Use Cloudinary storage
  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
      return {
        folder: 'event-management',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [{ width: 1200, height: 800, crop: 'limit' }],
        public_id: `event-${Date.now()}-${Math.round(Math.random() * 1e9)}`,
      }
    },
  })
} else {
  // Use local storage
  storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
      cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop())
    },
  })
}

// Configure multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Only image files are allowed'), false)
    }
  },
})

export default upload

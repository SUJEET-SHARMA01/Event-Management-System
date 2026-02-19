import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const createUploadsDir = () => {
  const uploadsDir = path.join(__dirname, '..', 'uploads')

  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true })
    console.log('✅ Uploads directory created')
  } else {
    console.log('📁 Uploads directory already exists')
  }
}

export default createUploadsDir

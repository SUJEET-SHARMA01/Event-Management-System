import admin from 'firebase-admin'

let firebaseAdmin = null

const initializeFirebase = () => {
  if (!firebaseAdmin) {
    try {
      const serviceAccount = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKeyId: process.env.FIREBASE_PRIVATE_KEY_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        clientId: process.env.FIREBASE_CLIENT_ID,
        authUri: process.env.FIREBASE_AUTH_URI,
        tokenUri: process.env.FIREBASE_TOKEN_URI,
        authProviderX509CertUrl: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
        clientX509CertUrl: process.env.FIREBASE_CLIENT_X509_CERT_URL,
      }

      firebaseAdmin = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      })

      console.log('Firebase Admin initialized successfully')
    } catch (error) {
      console.error('Firebase initialization error:', error.message)
      throw error
    }
  }

  return firebaseAdmin
}

export const getFirebaseAdmin = () => {
  if (!firebaseAdmin) {
    return initializeFirebase()
  }
  return firebaseAdmin
}

export default initializeFirebase

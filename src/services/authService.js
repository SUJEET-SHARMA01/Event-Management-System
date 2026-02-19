import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth'
import { auth, googleProvider } from '../config/firebase.js'
import api from '../config/api.js'

// Register user with email/password
export const registerWithEmail = async (email, password, name) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const firebaseToken = await userCredential.user.getIdToken()

    // Register user in backend
    const response = await api.post('/auth/register', {
      firebaseUID: userCredential.user.uid,
      email: userCredential.user.email,
      name: name || userCredential.user.displayName || email.split('@')[0],
      avatar: userCredential.user.photoURL,
    })

    // Store tokens
    localStorage.setItem('firebaseToken', firebaseToken)
    if (response.data?.token) {
      localStorage.setItem('jwtToken', response.data.token)
    }

    return {
      user: response.data.user,
      token: firebaseToken,
    }
  } catch (error) {
    console.error('Registration error:', error)
    throw new Error(error.message || 'Registration failed')
  }
}

// Login with email/password
export const loginWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const firebaseToken = await userCredential.user.getIdToken()

    // Register/login user in backend
    const response = await api.post('/auth/register', {
      firebaseUID: userCredential.user.uid,
      email: userCredential.user.email,
      name: userCredential.user.displayName || email.split('@')[0],
      avatar: userCredential.user.photoURL,
    })

    // Store tokens
    localStorage.setItem('firebaseToken', firebaseToken)
    if (response.data?.token) {
      localStorage.setItem('jwtToken', response.data.token)
    }

    return {
      user: response.data.user,
      token: firebaseToken,
    }
  } catch (error) {
    console.error('Login error:', error)
    throw new Error(error.message || 'Login failed')
  }
}

// Login with Google
export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider)
    const firebaseToken = await result.user.getIdToken()

    // Register/login user in backend
    const response = await api.post('/auth/register', {
      firebaseUID: result.user.uid,
      email: result.user.email,
      name: result.user.displayName || result.user.email.split('@')[0],
      avatar: result.user.photoURL,
    })

    // Store tokens
    localStorage.setItem('firebaseToken', firebaseToken)
    if (response.data?.token) {
      localStorage.setItem('jwtToken', response.data.token)
    }

    return {
      user: response.data.user,
      token: firebaseToken,
    }
  } catch (error) {
    console.error('Google login error:', error)
    throw new Error(error.message || 'Google login failed')
  }
}

// Logout
export const logout = async () => {
  try {
    await firebaseSignOut(auth)
    localStorage.removeItem('firebaseToken')
    localStorage.removeItem('jwtToken')
  } catch (error) {
    console.error('Logout error:', error)
    throw error
  }
}

// Get current user from backend
export const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth/me')
    return response.data.user
  } catch (error) {
    console.error('Get current user error:', error)
    return null
  }
}

// Update user profile
export const updateProfile = async (profileData) => {
  try {
    const response = await api.put('/auth/profile', profileData)
    return response.data.user
  } catch (error) {
    console.error('Update profile error:', error)
    throw new Error(error.message || 'Failed to update profile')
  }
}

// Auth state observer
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      try {
        // Refresh token
        const firebaseToken = await firebaseUser.getIdToken()
        localStorage.setItem('firebaseToken', firebaseToken)

        // Get user from backend
        const backendUser = await getCurrentUser()
        callback(backendUser || { email: firebaseUser.email, name: firebaseUser.displayName })
      } catch (error) {
        console.error('Auth state change error:', error)
        callback(null)
      }
    } else {
      localStorage.removeItem('firebaseToken')
      localStorage.removeItem('jwtToken')
      callback(null)
    }
  })
}

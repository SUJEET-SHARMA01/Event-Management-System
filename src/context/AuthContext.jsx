import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react'
import {
  loginWithEmail,
  loginWithGoogle,
  registerWithEmail,
  logout as authLogout,
  getCurrentUser,
  onAuthStateChange,
  updateProfile as updateUserProfile,
} from '../services/authService'

const AuthContext = createContext(null)

const ROLES = { USER: 'user', ADMIN: 'admin' }

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Initialize auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const backendUser = await getCurrentUser()
          if (backendUser) {
            setUser({
              id: backendUser.id,
              email: backendUser.email,
              name: backendUser.name,
              role: backendUser.role,
              avatar: backendUser.avatar,
              phone: backendUser.phone,
            })
          } else {
            setUser({
              email: firebaseUser.email,
              name: firebaseUser.name || firebaseUser.email.split('@')[0],
              role: ROLES.USER,
            })
          }
        } catch (error) {
          console.error('Error fetching user:', error)
          setUser(null)
        }
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const login = useCallback(async (email, password, loginRole = null) => {
    try {
      const result = await loginWithEmail(email, password)
      setUser(result.user)
      return result
    } catch (error) {
      throw error
    }
  }, [])

  const register = useCallback(async (email, password, name) => {
    try {
      const result = await registerWithEmail(email, password, name)
      setUser(result.user)
      return result
    } catch (error) {
      throw error
    }
  }, [])

  const loginWithGoogleAuth = useCallback(async () => {
    try {
      const result = await loginWithGoogle()
      setUser(result.user)
      return result
    } catch (error) {
      throw error
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await authLogout()
      setUser(null)
    } catch (error) {
      console.error('Logout error:', error)
      throw error
    }
  }, [])

  const updateProfile = useCallback(async (profileData) => {
    try {
      const updatedUser = await updateUserProfile(profileData)
      setUser((prev) => ({ ...prev, ...updatedUser }))
      return updatedUser
    } catch (error) {
      throw error
    }
  }, [])

  const isAuthenticated = !!user
  const isAdmin = user?.role === ROLES.ADMIN

  const value = useMemo(
    () => ({
      user,
      role: user?.role,
      isAuthenticated,
      isAdmin,
      loading,
      login,
      register,
      loginWithGoogle: loginWithGoogleAuth,
      logout,
      updateProfile,
      ROLES,
    }),
    [user, isAuthenticated, isAdmin, loading, login, register, loginWithGoogleAuth, logout, updateProfile]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

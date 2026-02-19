import { createContext, useContext, useEffect, useState } from 'react'
import api from '../services/api'

const UsersContext = createContext()

export const UsersProvider = ({ children }) => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/users')
        setUsers(res.data)
      } catch (error) {
        console.error('Error fetching users:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  return (
    <UsersContext.Provider value={{ users, loading }}>
      {children}
    </UsersContext.Provider>
  )
}

export const useUsers = () => useContext(UsersContext)

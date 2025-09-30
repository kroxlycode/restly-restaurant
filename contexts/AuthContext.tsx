'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import Cookies from 'js-cookie'

interface AuthContextType {
  isAuthenticated: boolean
  login: (username: string, password: string) => boolean
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    const token = Cookies.get('admin-token')
    if (token === 'admin-authenticated') {
      setIsAuthenticated(true)
    }
    setLoading(false)
  }, [])

  const login = (username: string, password: string): boolean => {

    const adminUsername = process.env.NEXT_PUBLIC_ADMIN_USERNAME || 'admin'
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123'


    if (username === adminUsername && password === adminPassword) {
      setIsAuthenticated(true)
      Cookies.set('admin-token', 'admin-authenticated', { expires: 1 }) // 1 day
      return true
    }
    return false
  }

  const logout = () => {
    setIsAuthenticated(false)
    Cookies.remove('admin-token')
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}


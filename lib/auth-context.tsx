"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { api, getAuthToken, setAuthToken, removeAuthToken } from "@/lib/api"

export type UserRole =
  | "admin"
  | "president"
  | "vice-president"
  | "secretary"
  | "sponsor-manager"
  | "events-organizer"
  | "media-responsable"
  | "member"
  | "guest"

export interface User {
  username: string
  _id: string
  id: string
  firstName: string
  lastName: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  photo?: string
  field: string
  year: number
  points: number
  status: "online" | "offline"
  isBureau?: boolean
  phone?: string
  motivation?: string
  projects?: string
  skills?: string
  isOnline: boolean
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  signup: (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    field: string,
    year: number,
    phone?: string
  ) => Promise<void>
  logout: () => void
  updateUser: (updates: Partial<User>) => void
  refreshUser: () => Promise<void>
  isAuthenticated: boolean
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Format API user to match our User interface
  const formatUser = (apiUser: any): User => {
    return {
      _id: apiUser._id,
      id: apiUser._id,
      firstName: apiUser.firstName,
      lastName: apiUser.lastName,
      username: apiUser.username || apiUser.email.split("@")[0],
      name: `${apiUser.firstName} ${apiUser.lastName}`,
      email: apiUser.email,
      role: apiUser.role,
      avatar: apiUser.avatar,
      photo: apiUser.avatar,
      field: apiUser.field,
      year: apiUser.year,
      points: apiUser.points || 0,
      status: apiUser.status || 'offline',
      isBureau: apiUser.isBureau || false,
      phone: apiUser.phone,
      motivation: apiUser.motivation,
      projects: apiUser.projects,
      skills: apiUser.skills,
      isOnline: apiUser.status === 'online',
    }
  }

  useEffect(() => {
    // Check for existing session with JWT token
    const checkAuth = async () => {
      const token = getAuthToken()
      if (token) {
        try {
          const response = await api.auth.me()
          if (response.success && response.user) {
            const formattedUser = formatUser(response.user)
            setUser(formattedUser)
            // Also store in localStorage for quick access
            localStorage.setItem("radio-istic-user", JSON.stringify(formattedUser))
          }
        } catch (error) {
          console.error("Auth check failed:", error)
          removeAuthToken()
          localStorage.removeItem("radio-istic-user")
        }
      } else {
        // Fallback to localStorage user (for offline)
        const storedUser = localStorage.getItem("radio-istic-user")
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        }
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const response = await api.auth.login({ email, password })

      if (response.success && response.token && response.user) {
        // Store JWT token
        setAuthToken(response.token)

        // Format and store user
        const formattedUser = formatUser(response.user)
        setUser(formattedUser)
        localStorage.setItem("radio-istic-user", JSON.stringify(formattedUser))
      } else {
        throw new Error(response.message || "Login failed")
      }
    } catch (error) {
      console.error("Login error:", error)
      if (error instanceof Error) {
        throw new Error(error.message || "Email ou mot de passe incorrect")
      }
      throw new Error("Email ou mot de passe incorrect")
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    field: string,
    year: number,
    phone?: string
  ) => {
    setIsLoading(true)
    try {
      const response = await api.auth.register({
        firstName,
        lastName,
        email,
        password,
        field: field as any,
        year: year as any,
        phone,
      })

      if (response.success && response.token && response.user) {
        // Store JWT token
        setAuthToken(response.token)

        // Format and store user
        const formattedUser = formatUser(response.user)
        setUser(formattedUser)
        localStorage.setItem("radio-istic-user", JSON.stringify(formattedUser))
      } else {
        throw new Error(response.message || "Registration failed")
      }
    } catch (error) {
      console.error("Signup error:", error)
      if (error instanceof Error) {
        throw new Error(error.message || "Échec de l'inscription")
      }
      throw new Error("Échec de l'inscription")
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    removeAuthToken()
    localStorage.removeItem("radio-istic-user")
  }

  const updateUser = async (updates: Partial<User>) => {
    if (user) {
      // Optimistic update for instant UI feedback
      const updatedUser = { ...user, ...updates }
      setUser(updatedUser)
      localStorage.setItem("radio-istic-user", JSON.stringify(updatedUser))

      // Sync with backend
      try {
        const response = await api.auth.updateProfile(updates as any)
        if (response.success && response.user) {
          const formattedUser = formatUser(response.user)
          setUser(formattedUser)
          localStorage.setItem("radio-istic-user", JSON.stringify(formattedUser))
        }
      } catch (error) {
        console.error("Failed to sync profile with backend:", error)
        // Keep optimistic update even if backend fails
      }
    }
  }

  const refreshUser = async () => {
    const token = getAuthToken()
    if (token) {
      try {
        const response = await api.auth.me()
        if (response.success && response.user) {
          const formattedUser = formatUser(response.user)
          setUser(formattedUser)
          localStorage.setItem("radio-istic-user", JSON.stringify(formattedUser))
        }
      } catch (error) {
        console.error("Failed to refresh user data:", error)
      }
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        updateUser,
        refreshUser,
        isAuthenticated: !!user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

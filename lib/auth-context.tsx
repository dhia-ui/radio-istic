"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { members } from "@/lib/members-data"

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
  id: string
  name: string
  email: string
  role: UserRole
  photo?: string
  isOnline: boolean
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  updateUser: (updates: Partial<User>) => void
  isAuthenticated: boolean
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem("radio-istic-user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const member = members.find((m) => m.email.toLowerCase() === email.toLowerCase())

      if (!member) {
        throw new Error("Email non trouvé dans la base des membres")
      }

      const userRole: UserRole = member.isBureau
        ? member.role === "Président"
          ? "president"
          : member.role === "Vice-président"
            ? "vice-president"
            : member.role === "Secrétaire Générale"
              ? "secretary"
              : member.role === "Responsable Sponsors"
                ? "sponsor-manager"
                : member.role === "Responsable Événements"
                  ? "events-organizer"
                  : member.role === "Responsable Média"
                    ? "media-responsable"
                    : "member"
        : "member"

      const authenticatedUser: User = {
        id: member.id,
        name: member.name,
        email: member.email,
        role: userRole,
        photo: member.avatar,
        isOnline: true,
      }

      setUser(authenticatedUser)
      localStorage.setItem("radio-istic-user", JSON.stringify(authenticatedUser))
    } catch (error) {
      throw new Error("Email ou mot de passe incorrect")
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const newUser: User = {
        id: Date.now().toString(),
        name,
        email,
        role: "member",
        isOnline: true,
      }

      setUser(newUser)
      localStorage.setItem("radio-istic-user", JSON.stringify(newUser))
    } catch (error) {
      console.error("[v0] Signup error:", error)
      throw new Error("Échec de l'inscription")
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("radio-istic-user")
  }

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates }
      setUser(updatedUser)
      localStorage.setItem("radio-istic-user", JSON.stringify(updatedUser))
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

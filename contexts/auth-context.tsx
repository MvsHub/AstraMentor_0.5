"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"

export interface UserProfile {
  name: string
  email: string
  userType: "student" | "teacher"
  registrationNumber: string
  avatar?: string
}

interface AuthContextType {
  user: UserProfile | null
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Verificar se o usuário já está autenticado
    const checkAuth = async () => {
      try {
        // Verificar se há perfil salvo
        const storedProfile = localStorage.getItem("userProfile")
        const token = localStorage.getItem("authToken")

        if (storedProfile) {
          try {
            const profile = JSON.parse(storedProfile) as UserProfile
            setUser(profile)

            // Se temos um perfil mas não um token, vamos criar um token
            if (!token && profile.email) {
              const result = await api.login(profile.email, "senha123")
              if (result) {
                localStorage.setItem("authToken", result.token)
              }
            }
          } catch (error) {
            console.error("Erro ao recuperar perfil do usuário:", error)
            localStorage.removeItem("userProfile")
          }
        } else if (token) {
          try {
            const userData = await api.getCurrentUser(token)

            if (userData) {
              const userProfile: UserProfile = {
                name: userData.name,
                email: userData.email,
                userType: userData.userType,
                registrationNumber: userData.registrationNumber,
                avatar: userData.avatar,
              }

              setUser(userProfile)
              localStorage.setItem("userProfile", JSON.stringify(userProfile))
            } else {
              // Token inválido ou expirado
              localStorage.removeItem("authToken")
            }
          } catch (error) {
            console.error("Erro ao verificar autenticação:", error)
            localStorage.removeItem("authToken")
          }
        }

        setIsLoading(false)
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error)
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const result = await api.login(email, password)

      if (!result) {
        return { success: false, message: "Email ou senha incorretos." }
      }

      const { user, token } = result

      // Criar objeto de perfil do usuário
      const userProfile: UserProfile = {
        name: user.name,
        email: user.email,
        userType: user.userType,
        registrationNumber: user.registrationNumber,
        avatar: user.avatar,
      }

      // Armazenar informações do usuário e token
      localStorage.setItem("authToken", token)
      localStorage.setItem("userProfile", JSON.stringify(userProfile))

      // Definir o usuário no estado imediatamente
      setUser(userProfile)

      return {
        success: true,
        message: `Bem-vindo, ${user.userType === "student" ? "Aluno" : "Professor"} ${user.name}!`,
      }
    } catch (error) {
      console.error("Erro durante login:", error)
      return {
        success: false,
        message: "Ocorreu um erro durante o login. Tente novamente.",
      }
    }
  }

  const logout = () => {
    localStorage.removeItem("authToken")
    localStorage.removeItem("userProfile")
    setUser(null)
    router.push("/")
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}


"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

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
        // Verificar se há uma sessão ativa no Supabase
        const { data: sessionData } = await supabase.auth.getSession()
        
        if (sessionData.session) {
          // Buscar perfil do usuário
          const { data: userData } = await supabase.auth.getUser()
          
          if (userData.user) {
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', userData.user.id)
              .single()
            
            if (!profileError && profileData) {
              // Criar objeto de perfil do usuário
              const userProfile: UserProfile = {
                name: profileData.name,
                email: profileData.email,
                userType: profileData.user_type,
                registrationNumber: profileData.registration_number,
                avatar: profileData.avatar_url,
              }
              
              setUser(userProfile)
              localStorage.setItem("userProfile", JSON.stringify(userProfile))
            }
          }
        } else {
          // Verificar se há perfil salvo no localStorage
          const storedProfile = localStorage.getItem("userProfile")
          if (storedProfile) {
            try {
              const profile = JSON.parse(storedProfile) as UserProfile
              setUser(profile)
            } catch (error) {
              console.error("Erro ao recuperar perfil do usuário:", error)
              localStorage.removeItem("userProfile")
            }
          }
        }
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()

    // Configurar listener para mudanças de autenticação
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        // Buscar perfil do usuário quando a sessão mudar
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
        
        if (!profileError && profileData) {
          const userProfile: UserProfile = {
            name: profileData.name,
            email: profileData.email,
            userType: profileData.user_type,
            registrationNumber: profileData.registration_number,
            avatar: profileData.avatar_url,
          }
          
          setUser(userProfile)
          localStorage.setItem("userProfile", JSON.stringify(userProfile))
        }
      } else {
        setUser(null)
        localStorage.removeItem("userProfile")
      }
      setIsLoading(false)
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return { success: false, message: error.message }
      }

      // Buscar perfil do usuário
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single()

      if (profileError) {
        return { 
          success: false, 
          message: "Erro ao buscar perfil de usuário. Verifique se o registro foi concluído corretamente." 
        }
      }

      // Criar objeto de perfil do usuário
      const userProfile: UserProfile = {
        name: profileData.name,
        email: profileData.email,
        userType: profileData.user_type,
        registrationNumber: profileData.registration_number,
        avatar: profileData.avatar_url,
      }
      
      setUser(userProfile)
      localStorage.setItem("userProfile", JSON.stringify(userProfile))

      return {
        success: true,
        message: `Bem-vindo, ${profileData.user_type === "student" ? "Aluno" : "Professor"} ${profileData.name}!`,
      }
    } catch (error) {
      console.error("Erro durante login:", error)
      return {
        success: false,
        message: "Ocorreu um erro durante o login. Tente novamente.",
      }
    }
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    localStorage.removeItem("userProfile")
    router.push("/")
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider")
  }
  return context
}

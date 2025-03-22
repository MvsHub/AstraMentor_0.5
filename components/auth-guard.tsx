"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Verificar se o usuário está autenticado
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (!session) {
          console.log("Usuário não autenticado, redirecionando para login...")
          window.location.href = "/login"
          return
        }

        // Se chegou aqui, o usuário está autenticado
        setAuthenticated(true)
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error)
        window.location.href = "/login"
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Carregando...</h2>
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-teal mx-auto"></div>
        </div>
      </div>
    )
  }

  if (!authenticated) {
    return null // Não renderiza nada enquanto redireciona
  }

  return <>{children}</>
}


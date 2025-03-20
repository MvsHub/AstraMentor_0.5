"use server"

import { api } from "@/lib/api"

export async function login(email: string, password: string) {
  try {
    const result = await api.login(email, password)

    if (!result) {
      return { success: false, message: "Email ou senha incorretos." }
    }

    return {
      success: true,
      message: `Bem-vindo, ${result.user.userType === "student" ? "Aluno" : "Professor"} ${result.user.name}!`,
    }
  } catch (error) {
    console.error("Erro durante login:", error)
    return {
      success: false,
      message: "Ocorreu um erro durante o login. Tente novamente.",
    }
  }
}


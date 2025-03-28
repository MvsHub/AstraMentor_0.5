"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { ArrowLeft, Eye, EyeOff } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { Logo } from "@/components/logo"
import { supabase } from "@/lib/supabase"

const loginSchema = z.object({
  email: z.string().email({
    message: "Email inválido.",
  }),
  password: z.string().min(1, {
    message: "Senha é obrigatória.",
  }),
})

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)

  // Verificar se o usuário já está autenticado
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()
      if (data.session) {
        console.log("Usuário já autenticado, redirecionando...")
        window.location.href = "/dashboard"
      }
    }

    checkSession()
  }, [router])

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setIsLoading(true)
    setLoginError(null)

    try {
      console.log("Tentando login com:", values.email)

      // Fazer login com Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      })

      if (error) {
        console.error("Erro de login:", error)
        setLoginError(error.message)
        setIsLoading(false)
        return
      }

      console.log("Login bem-sucedido:", data)

      // Buscar perfil do usuário
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .single()

      if (profileError) {
        console.error("Erro ao buscar perfil:", profileError)

        // Tentar criar um perfil básico se não existir
        const { error: insertError } = await supabase.from("profiles").insert([
          {
            id: data.user.id,
            email: data.user.email,
            name: data.user.user_metadata.fullName || "Usuário",
            user_type: data.user.user_metadata.userType || "student",
            registration_number:
              data.user.user_metadata.registration_number || `A${Math.floor(1000 + Math.random() * 9000)}`,
          },
        ])

        if (insertError) {
          console.error("Erro ao criar perfil:", insertError)
          setLoginError("Erro ao buscar ou criar perfil de usuário")
          setIsLoading(false)
          return
        }

        // Buscar o perfil recém-criado
        const { data: newProfileData, error: newProfileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.user.id)
          .single()

        if (newProfileError) {
          console.error("Erro ao buscar novo perfil:", newProfileError)
          setLoginError("Erro ao buscar perfil de usuário")
          setIsLoading(false)
          return
        }

        // Usar o novo perfil
        const userProfile = {
          name: newProfileData.name,
          email: newProfileData.email,
          userType: newProfileData.user_type,
          registrationNumber: newProfileData.registration_number,
          avatar: newProfileData.avatar_url,
        }

        // Armazenar informações do usuário
        localStorage.setItem("authToken", data.session.access_token)
        localStorage.setItem("userProfile", JSON.stringify(userProfile))

        toast({
          title: "Login realizado com sucesso!",
          description: `Bem-vindo, ${userProfile.name}!`,
        })

        // Redirecionar para dashboard - FORÇANDO REDIRECIONAMENTO
        console.log("Redirecionando para dashboard...")
        window.location.href = "/dashboard"
        return
      }

      // Se chegou aqui, o perfil foi encontrado
      const userProfile = {
        name: profileData.name,
        email: profileData.email,
        userType: profileData.user_type,
        registrationNumber: profileData.registration_number,
        avatar: profileData.avatar_url,
      }

      // Armazenar informações do usuário
      localStorage.setItem("authToken", data.session.access_token)
      localStorage.setItem("userProfile", JSON.stringify(userProfile))

      toast({
        title: "Login realizado com sucesso!",
        description: `Bem-vindo, ${profileData.user_type === "student" ? "Aluno" : "Professor"} ${profileData.name}!`,
      })

      // Redirecionar para dashboard - FORÇANDO REDIRECIONAMENTO
      console.log("Redirecionando para dashboard...")
      window.location.href = "/dashboard"
    } catch (error) {
      console.error("Erro durante login:", error)
      setLoginError("Ocorreu um erro durante o login. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="absolute left-4 top-4 md:left-8 md:top-8 flex items-center gap-4">
        <Button variant="ghost" size="sm" className="flex items-center gap-1" onClick={() => router.push("/")}>
          <ArrowLeft className="h-4 w-4" />
          Voltar para Homepage
        </Button>
        <Logo size="sm" />
      </div>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Entrar na plataforma</h1>
          <p className="text-sm text-muted-foreground">Digite seu email e senha para acessar</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="exemplo@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input type={showPassword ? "text" : "password"} placeholder="********" {...field} />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        <span className="sr-only">{showPassword ? "Esconder senha" : "Mostrar senha"}</span>
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {loginError && <div className="text-sm font-medium text-destructive">{loginError}</div>}
            <Button type="submit" className="w-full bg-brand-teal hover:bg-brand-teal/90" disabled={isLoading}>
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </Form>
        <p className="px-8 text-center text-sm text-muted-foreground">
          Não possui uma conta?{" "}
          <Link href="/register" className="underline underline-offset-4 hover:text-primary">
            Registre-se
          </Link>
        </p>
      </div>
    </div>
  )
}




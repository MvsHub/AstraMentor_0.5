"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { ArrowLeft, Eye, EyeOff } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "@/components/ui/use-toast"
import { Logo } from "@/components/logo"
import { supabase } from "@/lib/supabase"

const registerSchema = z
  .object({
    fullName: z.string().min(3, {
      message: "Nome completo deve ter pelo menos 3 caracteres.",
    }),
    birthDate: z.string().refine(
      (date) => {
        const birthDate = new Date(date)
        const today = new Date()
        const age = today.getFullYear() - birthDate.getFullYear()
        return age >= 13
      },
      {
        message: "Você deve ter pelo menos 13 anos para se registrar.",
      },
    ),
    email: z.string().email({
      message: "Email inválido.",
    }),
    password: z.string().min(8, {
      message: "Senha deve ter pelo menos 8 caracteres.",
    }),
    confirmPassword: z.string(),
    userType: z.enum(["student", "teacher"], {
      required_error: "Você deve selecionar um tipo de usuário.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"],
  })

export default function RegisterPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      birthDate: "",
      email: "",
      password: "",
      confirmPassword: "",
      userType: "student",
    },
  })

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    setIsLoading(true)
    
    try {
      console.log("Iniciando registro com:", { 
        email: values.email, 
        userType: values.userType,
        fullName: values.fullName
      });
      
      // Registrar usuário no Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            // Enviamos tanto fullName quanto full_name para compatibilidade
            fullName: values.fullName,
            full_name: values.fullName,
            // Enviamos tanto userType quanto user_type para compatibilidade
            userType: values.userType,
            user_type: values.userType,
            birth_date: values.birthDate
          }
        }
      })

      if (error) {
        console.error("Erro no registro:", error)
        toast({
          title: "Erro no registro",
          description: error.message,
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      console.log("Registro bem-sucedido:", data);
      
      toast({
        title: "Registro realizado com sucesso!",
        description: "Você será redirecionado para a página de login.",
      })

      // Redirecionar para login após registro bem-sucedido
      setTimeout(() => {
        router.push("/login")
      }, 2000)
    } catch (error) {
      console.error("Erro durante registro:", error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro durante o registro. Tente novamente.",
        variant: "destructive",
      })
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
          <h1 className="text-2xl font-semibold tracking-tight">Criar uma conta</h1>
          <p className="text-sm text-muted-foreground">Preencha os campos abaixo para se registrar</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Completo</FormLabel>
                  <FormControl>
                    <Input placeholder="João da Silva" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="birthDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de Nascimento</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                  <FormDescription>Mínimo de 8 caracteres</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmar Senha</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input type={showConfirmPassword ? "text" : "password"} placeholder="********" {...field} />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        <span className="sr-only">{showConfirmPassword ? "Esconder senha" : "Mostrar senha"}</span>
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="userType"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Tipo de Usuário</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="student" />
                        </FormControl>
                        <FormLabel className="font-normal">Aluno</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="teacher" />
                        </FormControl>
                        <FormLabel className="font-normal">Professor</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-brand-teal hover:bg-brand-teal/90" disabled={isLoading}>
              {isLoading ? "Registrando..." : "Registrar"}
            </Button>
          </form>
        </Form>
        <p className="px-8 text-center text-sm text-muted-foreground">
          Já possui uma conta?{" "}
          <Link href="/login" className="underline underline-offset-4 hover:text-primary">
            Faça login
          </Link>
        </p>
      </div>
    </div>
  )
}

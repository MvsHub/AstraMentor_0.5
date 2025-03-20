"use client"

import type React from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { api } from "@/lib/api"
import { useAuth } from "@/contexts/auth-context"

const postSchema = z.object({
  title: z.string().min(3, {
    message: "O título deve ter pelo menos 3 caracteres.",
  }),
  description: z.string().min(10, {
    message: "A descrição deve ter pelo menos 10 caracteres.",
  }),
  status: z.enum(["draft", "published"]),
})

export default function CreatePostPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    if (user.userType !== "teacher") {
      toast({
        title: "Acesso negado",
        description: "Apenas professores podem criar postagens.",
        variant: "destructive",
      })
      router.push("/dashboard")
    }
  }, [user, router])

  const form = useForm<z.infer<typeof postSchema>>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "draft",
    },
  })

  function onSubmit(values: z.infer<typeof postSchema>) {
    setIsSubmitting(true)

    // Preparar dados para envio
    const postData = {
      title: values.title,
      description: values.description.substring(0, 200), // Limitar descrição
      content: values.description,
      status: "published" as const,
      author: {
        name: user?.name || "Autor Desconhecido",
        image: user?.avatar || "/placeholder.svg?height=40&width=40",
        role: user?.userType === "teacher" ? "Professor" : "Aluno",
      },
      image: imagePreview || undefined,
    }

    // Enviar para a API
    api
      .createPost(postData)
      .then(() => {
        toast({
          title: "Post criado com sucesso!",
          description: "Seu post foi publicado e já está disponível para visualização.",
        })

        // Redirecionar para o feed após a criação do post
        setTimeout(() => {
          router.push("/feed")
        }, 1500)
      })
      .catch((error) => {
        console.error("Erro ao criar post:", error)
        toast({
          title: "Erro",
          description: "Não foi possível criar o post. Tente novamente.",
          variant: "destructive",
        })
      })
      .finally(() => {
        setIsSubmitting(false)
      })
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setImagePreview(null)
    }
  }

  return (
    <div className="container max-w-4xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-4">Criar Nova Postagem</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título</FormLabel>
                <FormControl>
                  <Input placeholder="Título da postagem" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <Textarea placeholder="Escreva uma descrição para a postagem..." className="resize-none" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div>
            <FormLabel>Imagem da Postagem</FormLabel>
            <Input type="file" accept="image/*" onChange={handleImageChange} />
            {imagePreview && (
              <img src={imagePreview || "/placeholder.svg"} alt="Preview da Imagem" className="mt-2 max-h-40" />
            )}
          </div>
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="draft">Rascunho</SelectItem>
                    <SelectItem value="published">Publicado</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Publicando..." : "Publicar Postagem"}
          </Button>
        </form>
      </Form>
    </div>
  )
}


"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Loader2 } from "lucide-react"

import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { api } from "@/lib/api"

const postSchema = z.object({
  title: z
    .string()
    .min(3, {
      message: "O título deve ter pelo menos 3 caracteres.",
    })
    .max(150, {
      message: "O título não pode ter mais de 150 caracteres.",
    }),
  description: z.string().min(10, {
    message: "A descrição deve ter pelo menos 10 caracteres.",
  }),
  content: z.string().min(10, {
    message: "O conteúdo deve ter pelo menos 10 caracteres.",
  }),
  status: z.enum(["draft", "published"]),
  image: z.any().optional(),
})

export default function EditPostPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  // Verificar se o usuário está autenticado e é professor
  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    if (user.userType !== "teacher") {
      toast({
        title: "Acesso negado",
        description: "Apenas professores podem editar postagens.",
        variant: "destructive",
      })
      router.push("/dashboard")
      return
    }
  }, [user, router])

  const form = useForm<z.infer<typeof postSchema>>({
    resolver: zodResolver(postSchema),
    defaultValues: async () => {
      setIsLoading(true)
      try {
        const post = await api.getPost(params.id)

        if (!post) {
          toast({
            title: "Erro",
            description: "Post não encontrado.",
            variant: "destructive",
          })
          router.push("/admin")
          return {
            title: "",
            description: "",
            content: "",
            status: "draft",
          }
        }

        // Configurar preview da imagem se existir
        if (post.image) {
          setImagePreview(post.image)
        }

        setIsLoading(false)
        return {
          title: post.title,
          description: post.description,
          content: post.content,
          status: post.status,
        }
      } catch (error) {
        console.error("Erro ao buscar post:", error)
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados do post.",
          variant: "destructive",
        })
        router.push("/admin")
        return {
          title: "",
          description: "",
          content: "",
          status: "draft",
        }
      }
    },
  })

  async function onSubmit(values: z.infer<typeof postSchema>) {
    setIsLoading(true)

    try {
      const updatedPost = {
        ...values,
        image: imagePreview,
      }

      await api.updatePost(params.id, updatedPost)

      toast({
        title: "Sucesso",
        description: "Post atualizado com sucesso!",
      })

      router.push("/admin")
    } catch (error) {
      console.error("Erro ao atualizar post:", error)
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o post.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Criar preview da imagem
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  if (isLoading && !form.formState.isSubmitting) {
    return (
      <>
        <DashboardHeader />
        <DashboardShell>
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </DashboardShell>
      </>
    )
  }

  return (
    <>
      <DashboardHeader />
      <DashboardShell>
        <div className="mx-auto max-w-2xl">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold tracking-tight">Editar Post</h1>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o título do seu post" {...field} />
                    </FormControl>
                    <FormDescription>Máximo de 150 caracteres.</FormDescription>
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
                      <Textarea placeholder="Digite uma breve descrição do seu post" className="resize-y" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Conteúdo</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Digite o conteúdo do seu post"
                        className="min-h-[200px] resize-y"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        {...field}
                      >
                        <option value="draft">Rascunho</option>
                        <option value="published">Publicado</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormItem>
                <FormLabel>Imagem</FormLabel>
                <FormControl>
                  <div className="grid w-full gap-2">
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="cursor-pointer"
                    />
                    {imagePreview && (
                      <div className="relative aspect-video overflow-hidden rounded-md">
                        <img
                          src={imagePreview || "/placeholder.svg"}
                          alt="Preview"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>

              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {form.formState.isSubmitting ? "Salvando..." : "Salvar Alterações"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DashboardShell>
    </>
  )
}


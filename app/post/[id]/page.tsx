"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Heart } from "lucide-react"

import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { api, type Post, type Comment } from "@/lib/api"
import { useAuth } from "@/contexts/auth-context"

export default function PostPage({ params }: { params: { id: string } }) {
  const { user } = useAuth()
  const [post, setPost] = useState<Post | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [newComment, setNewComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchPostData = async () => {
      setIsLoading(true)
      try {
        const postData = await api.getPost(params.id)
        if (postData) {
          setPost(postData)
          const commentsData = await api.getComments(params.id)
          setComments(commentsData)
        }
      } catch (error) {
        console.error("Erro ao buscar dados do post:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPostData()
  }, [params.id])

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !newComment.trim()) return

    setIsSubmitting(true)
    try {
      const commentData = {
        author: {
          name: user.name,
          image: user.avatar || "/placeholder.svg?height=32&width=32",
        },
        content: newComment,
      }

      const addedComment = await api.addComment(params.id, commentData)
      setComments([...comments, addedComment])
      setNewComment("")
    } catch (error) {
      console.error("Erro ao adicionar comentário:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
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

  if (!post) {
    return (
      <>
        <DashboardHeader />
        <DashboardShell>
          <div className="text-center py-8">
            <h2 className="text-2xl font-bold">Post não encontrado</h2>
            <p className="text-muted-foreground mt-2">O post que você está procurando não existe ou foi removido.</p>
          </div>
        </DashboardShell>
      </>
    )
  }

  const timeAgo = formatDistanceToNow(new Date(post.publishedAt), {
    addSuffix: true,
    locale: ptBR,
  })

  return (
    <>
      <DashboardHeader />
      <DashboardShell>
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Avatar className="h-10 w-10">
              <AvatarImage src={post.author.image} alt={post.author.name} />
              <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold">{post.author.name}</div>
              <div className="text-sm text-muted-foreground flex items-center gap-1">
                <span>{post.author.role}</span>
                <span>•</span>
                <span>{timeAgo}</span>
              </div>
            </div>
          </div>

          <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
          <p className="text-muted-foreground mb-6">{post.description}</p>

          {post.image && (
            <div className="mb-6 aspect-video overflow-hidden rounded-lg">
              <img src={post.image || "/placeholder.svg"} alt={post.title} className="h-full w-full object-cover" />
            </div>
          )}

          <div
            className="prose prose-sm sm:prose lg:prose-lg dark:prose-invert max-w-none mb-6"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className="flex items-center gap-4 mb-6">
            <Button variant="outline" size="sm" className="gap-1">
              <Heart className="h-4 w-4" />
              <span>{post.likes}</span>
            </Button>
            <span className="text-sm text-muted-foreground">{post.comments} comentários</span>
          </div>

          <Separator className="my-6" />

          <div className="space-y-6">
            <h2 className="text-xl font-bold">Comentários ({comments.length})</h2>

            <Card>
              <form onSubmit={handleSubmitComment}>
                <CardContent className="p-4">
                  <Textarea
                    placeholder={user ? "Adicione um comentário..." : "Faça login para comentar"}
                    className="resize-none"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    disabled={!user || isSubmitting}
                  />
                </CardContent>
                <CardFooter className="flex justify-end p-4 pt-0">
                  <Button type="submit" disabled={!user || !newComment.trim() || isSubmitting}>
                    {isSubmitting ? "Enviando..." : "Comentar"}
                  </Button>
                </CardFooter>
              </form>
            </Card>

            <div className="space-y-4">
              {comments.map((comment) => (
                <Card key={comment.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={comment.author.image} alt={comment.author.name} />
                        <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="grid gap-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{comment.author.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(comment.publishedAt), {
                              addSuffix: true,
                              locale: ptBR,
                            })}
                          </span>
                        </div>
                        <p>{comment.content}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Button variant="ghost" size="sm" className="h-8 gap-1 px-2">
                            <Heart className="h-3.5 w-3.5" />
                            <span className="text-xs">{comment.likes}</span>
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
                            Responder
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </DashboardShell>
    </>
  )
}


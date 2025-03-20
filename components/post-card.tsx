import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Heart, MessageCircle, Share2, Bookmark } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

interface PostCardProps {
  post: {
    id: string
    title: string
    description: string
    author: {
      name: string
      image: string
      role: string
    }
    publishedAt: string
    likes: number
    comments: number
    image?: string
  }
}

export function PostCard({ post }: PostCardProps) {
  const timeAgo = formatDistanceToNow(new Date(post.publishedAt), {
    addSuffix: true,
    locale: ptBR,
  })

  return (
    <Card>
      <CardHeader className="flex flex-row items-start gap-4 p-4">
        <Avatar className="h-10 w-10">
          <AvatarImage src={post.author.image} alt={post.author.name} />
          <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="grid gap-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold">{post.author.name}</span>
            <span className="text-xs text-muted-foreground">• {timeAgo}</span>
          </div>
          <p className="text-xs text-muted-foreground">{post.author.role}</p>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <Link href={`/post/${post.id}`}>
          <h3 className="text-xl font-bold mb-2 hover:text-primary transition-colors">{post.title}</h3>
        </Link>
        <p className="text-muted-foreground">{post.description}</p>
        {post.image && (
          <div className="mt-4 aspect-video overflow-hidden rounded-md">
            <img src={post.image || "/placeholder.svg"} alt={post.title} className="h-full w-full object-cover" />
          </div>
        )}
      </CardContent>
      <CardFooter className="flex items-center justify-between p-4 pt-0">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="gap-1 px-2">
            <Heart className="h-4 w-4" />
            <span className="text-xs">{post.likes}</span>
          </Button>
          <Button variant="ghost" size="sm" className="gap-1 px-2">
            <MessageCircle className="h-4 w-4" />
            <span className="text-xs">{post.comments}</span>
          </Button>
          <Button variant="ghost" size="sm" className="gap-1 px-2">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
        <Button variant="ghost" size="sm" className="gap-1 px-2">
          <Bookmark className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}


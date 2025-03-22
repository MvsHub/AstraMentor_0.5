import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PostCard } from "@/components/post-card"
import { AuthGuard } from "@/components/auth-guard"

export const metadata: Metadata = {
  title: "Dashboard | AstraMentor",
  description: "Dashboard da plataforma AstraMentor",
}

export default function DashboardPage() {
  // Dados simulados para demonstração
  const posts = [
    {
      id: "1",
      title: "Introdução à Física Quântica",
      description: "Uma introdução aos conceitos básicos da física quântica e suas aplicações no mundo moderno.",
      author: {
        name: "Prof. Carlos Silva",
        image: "/placeholder.svg?height=40&width=40",
        role: "Professor de Física",
      },
      publishedAt: "2024-03-15T10:00:00Z",
      likes: 42,
      comments: 8,
      image: "/placeholder.svg?height=300&width=600",
    },
    {
      id: "2",
      title: "Literatura Brasileira: Modernismo",
      description: "Análise das principais obras e autores do movimento modernista na literatura brasileira.",
      author: {
        name: "Profa. Ana Oliveira",
        image: "/placeholder.svg?height=40&width=40",
        role: "Professora de Literatura",
      },
      publishedAt: "2024-03-14T14:30:00Z",
      likes: 35,
      comments: 12,
      image: "/placeholder.svg?height=300&width=600",
    },
    {
      id: "3",
      title: "Matemática Aplicada: Funções Exponenciais",
      description: "Estudo das funções exponenciais e suas aplicações em problemas do cotidiano.",
      author: {
        name: "Prof. Roberto Martins",
        image: "/placeholder.svg?height=40&width=40",
        role: "Professor de Matemática",
      },
      publishedAt: "2024-03-13T09:15:00Z",
      likes: 28,
      comments: 5,
      image: "/placeholder.svg?height=300&width=600",
    },
  ]

  return (
    <AuthGuard>
      <DashboardHeader />
      <DashboardShell>
        <div className="grid gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
              <p className="text-muted-foreground">Bem-vindo à plataforma AstraMentor</p>
            </div>
            <div className="flex items-center gap-2">
              <Button>Buscar Conteúdo</Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Conexões</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">+4 desde a semana passada</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Grupos Seguidos</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M8 6v12" />
                  <path d="M20 12H8" />
                  <path d="M8 12L3 7" />
                  <path d="M8 12l-5 5" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5</div>
                <p className="text-xs text-muted-foreground">+2 desde o mês passado</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Conteúdos Salvos</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">18</div>
                <p className="text-xs text-muted-foreground">+7 desde a semana passada</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Interações</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <rect width="20" height="14" x="2" y="5" rx="2" />
                  <path d="M2 10h20" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">42</div>
                <p className="text-xs text-muted-foreground">+12 desde ontem</p>
              </CardContent>
            </Card>
          </div>

          <h3 className="text-2xl font-bold tracking-tight mt-6">Feed de Conteúdos</h3>

          <div className="grid gap-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </DashboardShell>
    </AuthGuard>
  )
}



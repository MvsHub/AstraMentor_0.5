// Simulação de API para o projeto
// Em uma implementação real, isso seria substituído por chamadas reais à API

// Tipos
export interface Post {
  id: string
  title: string
  description: string
  content: string
  author: {
    name: string
    image: string
    role: string
  }
  publishedAt: string
  updatedAt: string
  status: "published" | "draft"
  likes: number
  comments: number
  image?: string
}

export interface Comment {
  id: string
  author: {
    name: string
    image: string
  }
  content: string
  publishedAt: string
  likes: number
}

export interface User {
  id: string
  name: string
  email: string
  userType: "student" | "teacher"
  registrationNumber: string
  avatar?: string
}

// Dados simulados
const posts: Post[] = [
  {
    id: "1",
    title: "Introdução à Física Quântica",
    description: "Uma introdução aos conceitos básicos da física quântica e suas aplicações no mundo moderno.",
    content: `
      <p>A física quântica é um dos campos mais fascinantes e revolucionários da ciência moderna. Surgida no início do século XX, ela desafiou nossa compreensão tradicional do universo e abriu caminho para inúmeras tecnologias que utilizamos hoje.</p>
      
      <h2>Origens da Física Quântica</h2>
      
      <p>A física quântica começou a tomar forma quando cientistas perceberam que as leis da física clássica não conseguiam explicar certos fenômenos observados em escalas muito pequenas. Max Planck, em 1900, propôs que a energia era emitida em "pacotes" discretos, ou quanta, em vez de um fluxo contínuo. Esta ideia revolucionária marcou o nascimento da teoria quântica.</p>
    `,
    author: {
      name: "Prof. Carlos Silva",
      image: "/placeholder.svg?height=40&width=40",
      role: "Professor de Física",
    },
    publishedAt: "2024-03-15T10:00:00Z",
    updatedAt: "2024-03-15T10:00:00Z",
    status: "published",
    likes: 42,
    comments: 8,
    image: "/placeholder.svg?height=300&width=600",
  },
  {
    id: "2",
    title: "Literatura Brasileira: Modernismo",
    description: "Análise das principais obras e autores do movimento modernista na literatura brasileira.",
    content: `
      <p>O Modernismo foi um movimento artístico e cultural que revolucionou a literatura brasileira no início do século XX. Iniciado oficialmente com a Semana de Arte Moderna de 1922, em São Paulo, o movimento buscava romper com as tradições acadêmicas e criar uma arte genuinamente brasileira.</p>
      
      <h2>Principais Autores</h2>
      
      <p>Entre os principais autores modernistas brasileiros, destacam-se Mário de Andrade, Oswald de Andrade, Manuel Bandeira, Carlos Drummond de Andrade e Clarice Lispector, cada um com sua contribuição única para a renovação da literatura nacional.</p>
    `,
    author: {
      name: "Profa. Ana Oliveira",
      image: "/placeholder.svg?height=40&width=40",
      role: "Professora de Literatura",
    },
    publishedAt: "2024-03-14T14:30:00Z",
    updatedAt: "2024-03-14T16:45:00Z",
    status: "published",
    likes: 35,
    comments: 12,
    image: "/placeholder.svg?height=300&width=600",
  },
  {
    id: "3",
    title: "Matemática Aplicada: Funções Exponenciais",
    description: "Estudo das funções exponenciais e suas aplicações em problemas do cotidiano.",
    content: `
      <p>As funções exponenciais são fundamentais na matemática e possuem inúmeras aplicações práticas, desde o cálculo de juros compostos até a modelagem de crescimento populacional e decaimento radioativo.</p>
      
      <h2>Definição</h2>
      
      <p>Uma função exponencial é definida como f(x) = a^x, onde a é uma constante positiva diferente de 1. Quando a > 1, a função é crescente, e quando 0 < a < 1, a função é decrescente.</p>
    `,
    author: {
      name: "Prof. Roberto Martins",
      image: "/placeholder.svg?height=40&width=40",
      role: "Professor de Matemática",
    },
    publishedAt: "2024-03-13T09:15:00Z",
    updatedAt: "2024-03-13T11:30:00Z",
    status: "draft",
    likes: 28,
    comments: 5,
    image: "/placeholder.svg?height=300&width=600",
  },
]

const comments: Record<string, Comment[]> = {
  "1": [
    {
      id: "1",
      author: {
        name: "Maria Souza",
        image: "/placeholder.svg?height=32&width=32",
      },
      content: "Excelente explicação! Finalmente consegui entender o princípio da incerteza de Heisenberg.",
      publishedAt: "2024-03-15T11:30:00Z",
      likes: 5,
    },
    {
      id: "2",
      author: {
        name: "João Pereira",
        image: "/placeholder.svg?height=32&width=32",
      },
      content:
        "Professor, você poderia elaborar mais sobre as aplicações da computação quântica? Estou muito interessado nesse campo.",
      publishedAt: "2024-03-15T12:15:00Z",
      likes: 3,
    },
  ],
  "2": [
    {
      id: "1",
      author: {
        name: "Ana Lima",
        image: "/placeholder.svg?height=32&width=32",
      },
      content: "Esse conteúdo vai me ajudar muito na prova da semana que vem. Obrigada por compartilhar!",
      publishedAt: "2024-03-15T14:45:00Z",
      likes: 7,
    },
  ],
}

const users: User[] = [
  {
    id: "1",
    name: "Maria Silva",
    email: "aluno@exemplo.com",
    userType: "student",
    registrationNumber: "A1234",
    avatar: "/placeholder.svg?height=128&width=128",
  },
  {
    id: "2",
    name: "Carlos Santos",
    email: "professor@exemplo.com",
    userType: "teacher",
    registrationNumber: "P5678",
    avatar: "/placeholder.svg?height=128&width=128",
  },
]

// Funções da API
export const api = {
  // Posts
  getPosts: async (query?: string): Promise<Post[]> => {
    await new Promise((resolve) => setTimeout(resolve, 800)) // Simular latência

    if (!query) return posts

    const lowercaseQuery = query.toLowerCase()
    return posts.filter(
      (post) =>
        post.title.toLowerCase().includes(lowercaseQuery) ||
        post.description.toLowerCase().includes(lowercaseQuery) ||
        post.author.name.toLowerCase().includes(lowercaseQuery),
    )
  },

  getPost: async (id: string): Promise<Post | null> => {
    await new Promise((resolve) => setTimeout(resolve, 800)) // Simular latência

    const post = posts.find((p) => p.id === id)
    return post || null
  },

  createPost: async (data: Omit<Post, "id" | "publishedAt" | "updatedAt" | "likes" | "comments">): Promise<Post> => {
    await new Promise((resolve) => setTimeout(resolve, 1200)) // Simular latência

    const newPost: Post = {
      id: String(posts.length + 1),
      ...data,
      publishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      likes: 0,
      comments: 0,
    }

    posts.unshift(newPost)
    return newPost
  },

  updatePost: async (id: string, data: Partial<Post>): Promise<Post | null> => {
    await new Promise((resolve) => setTimeout(resolve, 1200)) // Simular latência

    const index = posts.findIndex((p) => p.id === id)
    if (index === -1) return null

    const updatedPost = {
      ...posts[index],
      ...data,
      updatedAt: new Date().toISOString(),
    }

    posts[index] = updatedPost
    return updatedPost
  },

  deletePost: async (id: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 800)) // Simular latência

    const index = posts.findIndex((p) => p.id === id)
    if (index === -1) return false

    posts.splice(index, 1)
    return true
  },

  // Comentários
  getComments: async (postId: string): Promise<Comment[]> => {
    await new Promise((resolve) => setTimeout(resolve, 800)) // Simular latência

    return comments[postId] || []
  },

  addComment: async (postId: string, data: Omit<Comment, "id" | "publishedAt" | "likes">): Promise<Comment> => {
    await new Promise((resolve) => setTimeout(resolve, 1000)) // Simular latência

    const newComment: Comment = {
      id: String(comments[postId]?.length + 1 || 1),
      ...data,
      publishedAt: new Date().toISOString(),
      likes: 0,
    }

    if (!comments[postId]) {
      comments[postId] = []
    }

    comments[postId].push(newComment)

    // Atualizar contador de comentários do post
    const postIndex = posts.findIndex((p) => p.id === postId)
    if (postIndex !== -1) {
      posts[postIndex].comments += 1
    }

    return newComment
  },

  // Autenticação
  login: async (email: string, password: string): Promise<{ user: User; token: string } | null> => {
    await new Promise((resolve) => setTimeout(resolve, 1000)) // Simular latência

    // Aceitar as credenciais de teste específicas
    if (email === "aluno@exemplo.com" && password === "senha123") {
      const user = users.find((u) => u.email === "aluno@exemplo.com")
      if (user) {
        const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(JSON.stringify({ id: user.id, email: user.email, userType: user.userType }))}.signature`
        return { user, token }
      }
    }

    if (email === "professor@exemplo.com" && password === "senha123") {
      const user = users.find((u) => u.email === "professor@exemplo.com")
      if (user) {
        const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(JSON.stringify({ id: user.id, email: user.email, userType: user.userType }))}.signature`
        return { user, token }
      }
    }

    // Para outros usuários, verificar no array de usuários
    const user = users.find((u) => u.email === email)
    if (!user) return null

    // Simular token JWT
    const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(JSON.stringify({ id: user.id, email: user.email, userType: user.userType }))}.signature`

    return { user, token }
  },

  getCurrentUser: async (token: string): Promise<User | null> => {
    await new Promise((resolve) => setTimeout(resolve, 500)) // Simular latência

    // Em uma implementação real, verificaria o token JWT
    try {
      const payload = JSON.parse(atob(token.split(".")[1]))
      const user = users.find((u) => u.id === payload.id)
      return user || null
    } catch (error) {
      return null
    }
  },

  register: async (data: Omit<User, "id">): Promise<User> => {
    await new Promise((resolve) => setTimeout(resolve, 1200)) // Simular latência

    const newUser: User = {
      id: String(users.length + 1),
      ...data,
    }

    users.push(newUser)
    return newUser
  },
}


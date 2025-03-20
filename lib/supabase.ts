import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Usar as variáveis de ambiente configuradas
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

// Verificar se as variáveis de ambiente estão configuradas
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase URL ou Anon Key não configurados. A aplicação não funcionará corretamente.")
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Funções auxiliares para autenticação
export const auth = {
  signUp: async (email: string, password: string) => {
    return await supabase.auth.signUp({
      email,
      password,
    })
  },

  signIn: async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({
      email,
      password,
    })
  },

  signOut: async () => {
    return await supabase.auth.signOut()
  },

  getSession: async () => {
    return await supabase.auth.getSession()
  },

  getUser: async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    return session?.user || null
  },
}

// Funções auxiliares para posts
export const postsService = {
  getPosts: async (query?: string) => {
    let queryBuilder = supabase.from("posts").select("*, author:profiles(*)").order("created_at", { ascending: false })

    if (query) {
      queryBuilder = queryBuilder.or(`title.ilike.%${query}%,description.ilike.%${query}%`)
    }

    const { data, error } = await queryBuilder

    if (error) {
      console.error("Erro ao buscar posts:", error)
      return []
    }

    return data
  },

  getPost: async (id: string) => {
    const { data, error } = await supabase.from("posts").select("*, author:profiles(*)").eq("id", id).single()

    if (error) {
      console.error("Erro ao buscar post:", error)
      return null
    }

    return data
  },

  createPost: async (postData: any) => {
    const { data, error } = await supabase.from("posts").insert(postData).select()

    if (error) {
      console.error("Erro ao criar post:", error)
      throw error
    }

    return data[0]
  },

  updatePost: async (id: string, postData: any) => {
    const { data, error } = await supabase.from("posts").update(postData).eq("id", id).select()

    if (error) {
      console.error("Erro ao atualizar post:", error)
      throw error
    }

    return data[0]
  },

  deletePost: async (id: string) => {
    const { error } = await supabase.from("posts").delete().eq("id", id)

    if (error) {
      console.error("Erro ao excluir post:", error)
      throw error
    }

    return true
  },
}

// Funções auxiliares para comentários
export const commentsService = {
  getComments: async (postId: string) => {
    const { data, error } = await supabase
      .from("comments")
      .select("*, author:profiles(*)")
      .eq("post_id", postId)
      .order("created_at", { ascending: true })

    if (error) {
      console.error("Erro ao buscar comentários:", error)
      return []
    }

    return data
  },

  addComment: async (commentData: any) => {
    const { data, error } = await supabase.from("comments").insert(commentData).select()

    if (error) {
      console.error("Erro ao adicionar comentário:", error)
      throw error
    }

    return data[0]
  },
}

// Funções auxiliares para upload de imagens
export const storageService = {
  uploadImage: async (bucket: string, path: string, file: File) => {
    const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
      cacheControl: "3600",
      upsert: true,
    })

    if (error) {
      console.error("Erro ao fazer upload de imagem:", error)
      throw error
    }

    // Retornar URL pública da imagem
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(path)

    return publicUrl
  },

  deleteImage: async (bucket: string, path: string) => {
    const { error } = await supabase.storage.from(bucket).remove([path])

    if (error) {
      console.error("Erro ao excluir imagem:", error)
      throw error
    }

    return true
  },
}


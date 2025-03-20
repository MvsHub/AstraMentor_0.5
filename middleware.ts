import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Rotas que requerem autenticação
const protectedRoutes = ["/dashboard", "/profile", "/admin", "/create-post", "/edit-post"]

// Rotas que requerem ser professor
const teacherRoutes = ["/admin", "/create-post", "/edit-post"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Verificar se a rota atual precisa de proteção
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))
  const isTeacherRoute = teacherRoutes.some((route) => pathname.startsWith(route))

  if (!isProtectedRoute) {
    return NextResponse.next()
  }

  // Verificar se o usuário está autenticado
  const authToken = request.cookies.get("authToken")?.value
  const userProfileCookie = request.cookies.get("userProfile")?.value

  // Se não tiver token nem perfil, redirecionar para login
  if (!authToken && !userProfileCookie) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Verificar se é uma rota de professor
  if (isTeacherRoute && userProfileCookie) {
    try {
      const userProfile = JSON.parse(userProfileCookie)
      if (userProfile.userType !== "teacher") {
        // Redirecionar para dashboard se não for professor
        return NextResponse.redirect(new URL("/dashboard", request.url))
      }
    } catch (error) {
      // Se não conseguir parsear o perfil, permitir o acesso mesmo assim
      // para evitar loops de redirecionamento
      console.error("Erro ao verificar perfil:", error)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/admin/:path*", "/create-post/:path*", "/edit-post/:path*"],
}


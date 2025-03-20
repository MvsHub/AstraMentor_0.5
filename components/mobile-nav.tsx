"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, BookOpen, User, Settings, FileText, Users, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAuth } from "@/contexts/auth-context"

export function MobileNav() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const routes = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: Home,
    },
    {
      href: "/feed",
      label: "Feed",
      icon: BookOpen,
    },
    {
      href: "/my-content",
      label: "Meus Conteúdos",
      icon: FileText,
    },
    {
      href: "/profile",
      label: "Perfil",
      icon: User,
    },
    {
      href: "/settings",
      label: "Configurações",
      icon: Settings,
    },
  ]

  // Adicionar rota administrativa apenas para professores
  if (user?.userType === "teacher") {
    routes.push({
      href: "/admin",
      label: "Área Administrativa",
      icon: Users,
    })
  }

  return (
    <div className="flex flex-col gap-6 p-4">
      <Link href="/" className="flex items-center gap-2 px-2">
        <span className="font-bold text-xl">AstraMentor</span>
      </Link>
      <ScrollArea className="h-[calc(100vh-8rem)]">
        <div className="flex flex-col gap-2 px-2">
          {routes.map((route) => (
            <Button
              key={route.href}
              asChild
              variant={pathname === route.href ? "secondary" : "ghost"}
              className="justify-start"
            >
              <Link href={route.href}>
                <route.icon className="mr-2 h-4 w-4" />
                {route.label}
              </Link>
            </Button>
          ))}
          <Button variant="ghost" className="justify-start mt-4" onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </div>
      </ScrollArea>
    </div>
  )
}


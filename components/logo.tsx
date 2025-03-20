import Link from "next/link"
import { cn } from "@/lib/utils"

interface LogoProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

export function Logo({ size = "md", className }: LogoProps) {
  const sizeClasses = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl",
  }

  return (
    <Link href="/" className={cn("font-bold text-primary", sizeClasses[size], className)}>
      <span className="flex items-center gap-1">
        <span className="text-primary">Astra</span>
        <span className="text-foreground">Mentor</span>
      </span>
    </Link>
  )
}


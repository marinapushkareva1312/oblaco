"use client"

import { Home, Heart, MessageCircle, User } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/language-context"
import { CloudLogo } from "@/components/cloud-logo"

const navItems = [
  { id: "home", labelKey: "home" as const, icon: Home, href: "/" },
  { id: "saved", labelKey: "saved" as const, icon: Heart, href: "/" },
  { id: "chats", labelKey: "chats" as const, icon: MessageCircle, href: "/chats" },
  { id: "profile", labelKey: "profile" as const, icon: User, href: "/profile" },
]

type DesktopNavProps = {
  active: string
  favoritesCount?: number
}

export function DesktopNav({ active, favoritesCount = 0 }: DesktopNavProps) {
  const { t } = useLanguage()
  return (
    <div className="hidden items-center justify-between rounded-2xl border border-border/60 bg-card px-6 py-4 shadow-sm md:mt-6 md:flex">
      <Link href="/" className="flex items-center gap-1.5">
        <CloudLogo className="h-[18px] w-[18px] shrink-0" />
        <span className="text-lg font-semibold text-foreground">Oblaco</span>
      </Link>

      <nav className="flex items-center gap-6">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = active === item.id
          return (
            <Link key={item.id} href={item.href}>
              <button
                type="button"
                className={cn(
                  "relative flex items-center gap-1.5 text-sm font-medium transition-colors",
                  isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className={cn("h-4 w-4", isActive && "text-primary")} />
                {t(item.labelKey)}
                {item.id === "saved" && favoritesCount > 0 && (
                  <span className="ml-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                    {favoritesCount}
                  </span>
                )}
              </button>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

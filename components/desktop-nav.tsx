"use client"

import { Home, Heart, MessageCircle, User } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/language-context"

const navItems = [
  { id: "home", labelKey: "home" as const, icon: Home, href: "/" },
  { id: "saved", labelKey: "saved" as const, icon: Heart, href: "/" },
  { id: "chats", labelKey: "chats" as const, icon: MessageCircle, href: "/chat" },
  { id: "profile", labelKey: "profile" as const, icon: User, href: "/profile" },
]

type DesktopNavProps = {
  active: string
  favoritesCount?: number
}

export function DesktopNav({ active, favoritesCount = 0 }: DesktopNavProps) {
  const { t } = useLanguage()
  return (
    <div
      className="hidden items-center justify-between rounded-2xl px-6 py-4 shadow-lg md:mt-6 md:flex"
      style={{ background: "linear-gradient(135deg, #1E3A5F 0%, #2563EB 100%)" }}
    >
      <Link href="/" className="text-lg font-black tracking-widest text-white">
        OBLACO
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
                  isActive ? "text-white" : "text-white/70 hover:text-white",
                )}
              >
                <Icon className="h-4 w-4" />
                {t(item.labelKey)}
                {item.id === "saved" && favoritesCount > 0 && (
                  <span className="ml-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-white px-1 text-[10px] font-bold text-[#2563EB]">
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

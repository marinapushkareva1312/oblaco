"use client"

import { Search, SlidersHorizontal, Bell, Home, Heart, MessageCircle, User, Plus } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/language-context"

interface MarketplaceHeaderProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  activeNav?: string
  onNavSelect?: (id: string) => void
  favoritesCount?: number
}

const navItems = [
  { id: "home", label: "Home", icon: Home, href: "/" },
  { id: "saved", label: "Saved", icon: Heart, href: "/" },
  { id: "chats", label: "Chats", icon: MessageCircle, href: "/chat" },
  { id: "profile", label: "Profile", icon: User, href: "/profile" },
]

export function MarketplaceHeader({
  searchQuery,
  onSearchChange,
  activeNav,
  onNavSelect,
  favoritesCount = 0,
}: MarketplaceHeaderProps) {
  const { t } = useLanguage()
  return (
    <header
      className="rounded-b-3xl px-5 pb-6 pt-7 text-white shadow-lg md:rounded-2xl md:px-8 md:py-5"
      style={{ background: "linear-gradient(135deg, #1E3A5F 0%, #2563EB 100%)" }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6">
        <div className="flex items-center gap-10">
          <div>
            <p className="hidden text-xs font-medium text-white/70 md:block">Your home under the same sky</p>
            <h1 className="text-2xl font-black tracking-widest text-white drop-shadow-lg md:text-xl">OBLACO</h1>
          </div>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-6 md:flex">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = activeNav === item.id
              return (
                <Link key={item.id} href={item.href}>
                  <button
                    type="button"
                    onClick={() => onNavSelect?.(item.id)}
                    className={cn(
                      "relative flex items-center gap-1.5 text-sm font-medium transition-colors",
                      isActive ? "text-white" : "text-white/70 hover:text-white",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.id === "home" ? t("home") : item.id === "saved" ? t("saved") : item.id === "chats" ? t("chats") : t("profile")}
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

        <div className="hidden items-center gap-3 md:flex md:flex-1 md:max-w-md">
          <div className="flex flex-1 items-center gap-2.5 rounded-2xl bg-white/15 px-4 py-2.5 backdrop-blur-sm">
            <Search className="h-4 w-4 shrink-0 text-white/80" />
            <input
              type="search"
              placeholder={t("searchPlaceholder")}
              aria-label={t("searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-transparent text-sm text-white placeholder:text-white/60 focus:outline-none"
            />
          </div>
          <Link href="/post">
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-2xl bg-white px-4 py-2.5 text-sm font-semibold text-[#1E3A5F] shadow-md transition-transform active:scale-95"
            >
              <Plus className="h-4 w-4" />
              {t("sell")}
            </button>
          </Link>
        </div>

        <button
          type="button"
          aria-label="Notifications"
          className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm transition-transform active:scale-90 md:hidden"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-white ring-2 ring-[#2563EB]" />
        </button>
      </div>

      {/* Mobile search bar */}
      <div className="mt-5 flex items-center gap-2.5 md:hidden">
        <div className="flex flex-1 items-center gap-2.5 rounded-2xl bg-white/15 px-4 py-3 backdrop-blur-sm">
          <Search className="h-5 w-5 text-white/80" />
          <input
            type="search"
            placeholder="Search marketplace"
            aria-label="Search marketplace"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-transparent text-sm text-white placeholder:text-white/60 focus:outline-none"
          />
        </div>
        <button
          type="button"
          aria-label="Filters"
          className="flex h-[46px] w-[46px] items-center justify-center rounded-2xl bg-white text-[#1E3A5F] shadow-md transition-transform active:scale-90"
        >
          <SlidersHorizontal className="h-5 w-5" />
        </button>
      </div>
    </header>
  )
}
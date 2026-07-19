"use client"

import { Search, SlidersHorizontal, Bell, Home, Heart, MessageCircle, User, Plus } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/language-context"
import { CloudLogo } from "@/components/cloud-logo"

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
  { id: "chats", label: "Chats", icon: MessageCircle, href: "/chats" },
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
    <header className="border-b border-border/60 bg-card px-5 pb-4 pt-6 md:rounded-2xl md:border md:px-8 md:py-4 md:shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6">
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-1.5">
            <CloudLogo className="h-5 w-5 shrink-0" />
            <h1 className="text-xl font-semibold text-foreground md:text-lg">Oblaco</h1>
          </Link>

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
                      isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <Icon className={cn("h-4 w-4", isActive && "text-primary")} />
                    {item.id === "home" ? t("home") : item.id === "saved" ? t("saved") : item.id === "chats" ? t("chats") : t("profile")}
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

        <div className="hidden items-center gap-3 md:flex md:flex-1 md:max-w-md">
          <div className="flex flex-1 items-center gap-2.5 rounded-full border border-border/60 bg-background px-4 py-2.5 shadow-sm">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              type="search"
              placeholder={t("searchPlaceholder")}
              aria-label={t("searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
          </div>
          <Link href="/post">
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-transform active:scale-95"
            >
              <Plus className="h-4 w-4" />
              {t("sell")}
            </button>
          </Link>
        </div>

        <button
          type="button"
          aria-label="Notifications"
          className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted transition-transform active:scale-90 md:hidden"
        >
          <Bell className="h-5 w-5 text-foreground" />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-primary ring-2 ring-card" />
        </button>
      </div>

      {/* Mobile search bar */}
      <div className="mt-4 flex items-center gap-2.5 md:hidden">
        <div className="flex flex-1 items-center gap-2.5 rounded-full border border-border/60 bg-background px-4 py-3 shadow-sm">
          <Search className="h-5 w-5 text-muted-foreground" />
          <input
            type="search"
            placeholder={t("searchPlaceholder")}
            aria-label={t("searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
        </div>
        <button
          type="button"
          aria-label="Filters"
          className="flex h-[46px] w-[46px] items-center justify-center rounded-full border border-border/60 bg-background text-foreground shadow-sm transition-transform active:scale-90"
        >
          <SlidersHorizontal className="h-5 w-5" />
        </button>
      </div>
    </header>
  )
}

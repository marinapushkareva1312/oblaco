"use client"

import { Home, Heart, MessageCircle, User, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

const items = [
  { id: "home", label: "Home", icon: Home, href: "/" },
  { id: "saved", label: "Saved", icon: Heart, href: "/" },
  { id: "chats", label: "Chats", icon: MessageCircle, href: "/chat" },
  { id: "profile", label: "Profile", icon: User, href: "/profile" },
]

type BottomNavProps = {
  active: string
  onSelect: (id: string) => void
  favoritesCount: number
}

export function BottomNav({ active, onSelect, favoritesCount }: BottomNavProps) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 mx-auto max-w-md md:hidden">
      <div className="relative border-t border-border/60 bg-card/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-4px_24px_rgba(0,0,0,0.06)] backdrop-blur-md">
        {/* Floating Sell button */}
        <Link href="/post">
          <button
            type="button"
            aria-label="Sell an item"
            className="absolute -top-7 left-1/2 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/40 ring-4 ring-background transition-transform active:scale-90"
          >
            <Plus className="h-7 w-7" />
          </button>
        </Link>

        <ul className="flex items-center justify-between">
          {items.map((item, i) => {
            const Icon = item.icon
            const isActive = active === item.id
            const spacer = i === 2 ? "ml-10" : i === 1 ? "mr-10" : ""
            return (
              <li key={item.id} className={cn("flex-1", spacer)}>
                <Link href={item.href}>
                  <button
                    type="button"
                    onClick={() => onSelect(item.id)}
                    className="relative flex w-full flex-col items-center gap-0.5 py-1"
                  >
                    <span className="relative">
                      <Icon
                        className={cn(
                          "h-[22px] w-[22px] transition-colors",
                          isActive ? "text-primary" : "text-muted-foreground",
                        )}
                      />
                      {item.id === "saved" && favoritesCount > 0 && (
                        <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-white">
                          {favoritesCount}
                        </span>
                      )}
                    </span>
                    <span
                      className={cn(
                        "text-[10px] font-medium transition-colors",
                        isActive ? "text-primary" : "text-muted-foreground",
                      )}
                    >
                      {item.label}
                    </span>
                  </button>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}
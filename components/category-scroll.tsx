"use client"

import { cn } from "@/lib/utils"
import { categories } from "@/lib/listings"
import { useLanguage } from "@/lib/language-context"

type CategoryScrollProps = {
  active: string
  onSelect: (id: string) => void
}

export function CategoryScroll({ active, onSelect }: CategoryScrollProps) {
  const { t } = useLanguage()
  return (
    <div className="-mx-5 overflow-x-auto px-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:overflow-visible md:px-0">
      <div className="flex w-max gap-4 py-1 md:w-full md:flex-wrap md:justify-center">
        {categories.map((cat) => {
          const isActive = active === cat.id
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelect(cat.id)}
              className="flex w-16 flex-col items-center gap-1.5"
            >
              <span
                className={cn(
                  "flex h-14 w-14 items-center justify-center rounded-2xl text-2xl shadow-sm transition-all duration-200",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/30 scale-105"
                    : "bg-card ring-1 ring-border/60",
                )}
              >
                {cat.emoji}
              </span>
              <span
                className={cn(
                  "text-[11px] font-medium transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground",
                )}
              >
                {t(cat.labelKey)}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

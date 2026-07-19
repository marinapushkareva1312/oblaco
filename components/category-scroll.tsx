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
              className={cn(
                "flex w-16 flex-col items-center gap-1.5 border-b-2 pb-2 transition-colors duration-200",
                isActive ? "border-foreground" : "border-transparent",
              )}
            >
              <span
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-full text-2xl transition-opacity duration-200",
                  isActive ? "opacity-100" : "opacity-60",
                )}
              >
                {cat.emoji}
              </span>
              <span
                className={cn(
                  "text-[11px] transition-colors",
                  isActive ? "font-semibold text-foreground" : "font-medium text-muted-foreground",
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

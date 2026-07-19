"use client"

import { Heart, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Listing } from "@/lib/listings"
import Link from "next/link"

type ListingCardProps = {
  listing: Listing
  isFavorite: boolean
  onToggleFavorite: (id: string) => void
}

export function ListingCard({ listing, isFavorite, onToggleFavorite }: ListingCardProps) {
  return (
    <Link href={`/${listing.id}`} className="block">
      <article className="group transition-transform duration-200 active:scale-[0.98]">
        <div className="relative aspect-square overflow-hidden rounded-xl shadow-sm">
          <img
            src={listing.image || "/placeholder.svg"}
            alt={listing.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {listing.featured && (
            <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-foreground shadow-sm">
              Featured
            </span>
          )}

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              onToggleFavorite(listing.id)
            }}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            aria-pressed={isFavorite}
            className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-foreground shadow-sm backdrop-blur-sm transition-transform active:scale-90"
          >
            <Heart
              className={cn(
                "h-[18px] w-[18px] transition-colors",
                isFavorite ? "fill-destructive text-destructive" : "text-muted-foreground",
              )}
            />
          </button>
        </div>

        {/* Details */}
        <div className="mt-2.5 flex flex-col gap-0.5 px-0.5">
          <h3 className="truncate text-sm font-medium leading-tight text-card-foreground text-pretty">
            {listing.title}
          </h3>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{listing.location}</span>
          </div>
          <div className="mt-0.5 flex items-baseline gap-1.5">
            <span className="text-sm font-semibold text-foreground">{listing.price}</span>
            <span className="text-[11px] text-muted-foreground/80">· {listing.postedAt}</span>
          </div>
        </div>
      </article>
    </Link>
  )
}
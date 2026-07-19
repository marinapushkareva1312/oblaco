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
    <Link href={`/${listing.id}`}>
      <article className="group overflow-hidden rounded-2xl bg-card shadow-sm ring-1 ring-border/60 transition-all duration-200 active:scale-[0.98] hover:shadow-lg hover:shadow-primary/10">
        {/* Photo — ~60% of card height */}
        <div className="relative aspect-[4/5]">
          <div className="relative h-[60%] w-full overflow-hidden">
            <img
              src={listing.image || "/placeholder.svg"}
              alt={listing.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />

            {listing.featured && (
              <span className="absolute left-3 top-3 rounded-full bg-accent px-2.5 py-1 text-[11px] font-semibold text-accent-foreground shadow-sm">
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
              className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-card/90 text-foreground shadow-md backdrop-blur-sm transition-transform active:scale-90"
            >
              <Heart
                className={cn(
                  "h-[18px] w-[18px] transition-colors",
                  isFavorite ? "fill-destructive text-destructive" : "text-muted-foreground",
                )}
              />
            </button>

            {/* Price badge — bottom left */}
            <span className="absolute bottom-3 left-3 rounded-xl bg-primary px-3 py-1.5 text-sm font-bold text-primary-foreground shadow-lg">
              {listing.price}
            </span>
          </div>

          {/* Details — remaining 40% */}
          <div className="flex h-[40%] flex-col justify-center gap-1 px-3.5">
            <h3 className="truncate text-sm font-semibold leading-tight text-card-foreground text-pretty">
              {listing.title}
            </h3>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{listing.location}</span>
            </div>
            <span className="text-[11px] text-muted-foreground/80">{listing.postedAt}</span>
          </div>
        </div>
      </article>
    </Link>
  )
}
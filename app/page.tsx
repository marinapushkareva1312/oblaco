"use client"

import { useMemo, useState, useEffect } from "react"
import { MarketplaceHeader } from "@/components/marketplace-header"
import { CategoryScroll } from "@/components/category-scroll"
import { ListingCard } from "@/components/listing-card"
import { BottomNav } from "@/components/bottom-nav"
import { listings as staticListings, fetchListings } from "@/lib/listings"
import type { Listing } from "@/lib/listings"

export default function Page() {
  const [activeCategory, setActiveCategory] = useState("all")
  const [activeNav, setActiveNav] = useState("home")
  const [favorites, setFavorites] = useState<string[]>(["1"])
  const [allListings, setAllListings] = useState<Listing[]>(staticListings)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadListings = async () => {
      try {
        const data = await fetchListings()
        setAllListings(data)
      } catch (error) {
        console.error('Error loading listings:', error)
        setAllListings(staticListings)
      } finally {
        setLoading(false)
      }
    }
    loadListings()
  }, [])

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]))
  }

  const visibleListings = useMemo(() => {
    let list = allListings
    if (activeCategory !== "all") {
      list = list.filter((l) => l.category === activeCategory)
    }
    if (activeNav === "saved") {
      list = list.filter((l) => favorites.includes(l.id))
    }
    return list
  }, [activeCategory, activeNav, favorites, allListings])

  return (
    <div className="mx-auto min-h-screen max-w-md bg-background pb-24">
      <MarketplaceHeader />

      <div className="px-5 pt-5">
        <CategoryScroll active={activeCategory} onSelect={setActiveCategory} />

        <div className="mt-6 flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">
            {activeNav === "saved" ? "Saved items" : "Recent listings"}
          </h2>
          <span className="text-xs font-medium text-muted-foreground">
            {loading ? "Loading..." : `${visibleListings.length} results`}
          </span>
        </div>

        {loading ? (
          <div className="mt-16 flex flex-col items-center text-center">
            <div className="w-8 h-8 border-2 border-[#2563EB] border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-sm text-muted-foreground">Loading listings...</p>
          </div>
        ) : visibleListings.length > 0 ? (
          <div className="mt-4 grid grid-cols-2 gap-4">
            {visibleListings.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                isFavorite={favorites.includes(listing.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        ) : (
          <div className="mt-16 flex flex-col items-center text-center">
            <p className="text-sm font-medium text-foreground">No listings here yet</p>
            <p className="mt-1 text-xs text-muted-foreground text-pretty">
              {activeNav === "saved" ? "Tap the heart on a listing to save it." : "Try a different category."}
            </p>
          </div>
        )}
      </div>

      <BottomNav active={activeNav} onSelect={setActiveNav} favoritesCount={favorites.length} />
    </div>
  )
}
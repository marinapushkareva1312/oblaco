"use client"

import { useMemo, useState, useEffect } from "react"
import { MarketplaceHeader } from "@/components/marketplace-header"
import { CategoryScroll } from "@/components/category-scroll"
import { ListingCard } from "@/components/listing-card"
import { BottomNav } from "@/components/bottom-nav"
import { listings as staticListings, fetchListings } from "@/lib/listings"
import type { Listing } from "@/lib/listings"
import { searchListings } from "@/lib/embeddings"
import { useLanguage } from "@/lib/language-context"
export default function Page() {
  const { t } = useLanguage()
  const [activeCategory, setActiveCategory] = useState("all")
  const [activeNav, setActiveNav] = useState("home")
  const [favorites, setFavorites] = useState<string[]>(["1"])
  const [allListings, setAllListings] = useState<Listing[]>(staticListings)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Listing[] | null>(null)
  const [searching, setSearching] = useState(false)

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

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults(null)
      return
    }

    const timeout = setTimeout(async () => {
      setSearching(true)
      const results = await searchListings(searchQuery)
      setSearchResults(results)
      setSearching(false)
    }, 500)

    return () => clearTimeout(timeout)
  }, [searchQuery])

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]))
  }

  const visibleListings = useMemo(() => {
    if (searchResults !== null) {
      return searchResults
    }

    let list = allListings
    if (activeCategory !== "all") {
      list = list.filter((l) => l.category === activeCategory)
    }
    if (activeNav === "saved") {
      list = list.filter((l) => favorites.includes(l.id))
    }
    return list
  }, [activeCategory, activeNav, favorites, allListings, searchResults])

  return (
    <div className="mx-auto min-h-screen max-w-md bg-background pb-24 md:max-w-6xl md:pb-10">
      <MarketplaceHeader
  searchQuery={searchQuery}
  onSearchChange={setSearchQuery}
  activeNav={activeNav}
  onNavSelect={setActiveNav}
  favoritesCount={favorites.length}
/>

      <div className="px-5 pt-5">
        <CategoryScroll active={activeCategory} onSelect={setActiveCategory} />

        <div className="mt-6 flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">
  {searchResults !== null
    ? t("searchResults")
    : activeNav === "saved"
    ? t("savedItems")
    : t("recentListings")}
</h2>
          <span className="text-xs font-medium text-muted-foreground">
  {loading || searching ? t("loading") : `${visibleListings.length} ${t("results")}`}
</span>
        </div>

        {loading || searching ? (
          <div className="mt-16 flex flex-col items-center text-center">
            <div className="w-8 h-8 border-2 border-[#2563EB] border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-sm text-muted-foreground">
  {searching ? t("searching") : t("loadingListings")}
</p>
          </div>
        ) : visibleListings.length > 0 ? (
          <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
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
            <p className="text-sm font-medium text-foreground">{t("noListingsYet")}</p>
<p className="mt-1 text-xs text-muted-foreground text-pretty">
  {searchResults !== null
    ? t("tryDifferentSearch")
    : activeNav === "saved"
    ? t("tapHeartToSave")
    : t("tryDifferentCategory")}
</p>
          </div>
        )}
      </div>

      <BottomNav active={activeNav} onSelect={setActiveNav} favoritesCount={favorites.length} />
    </div>
  )
}
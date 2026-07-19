"use client"

import { useMemo, useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { ArrowUp, ChevronDown } from "lucide-react"
import { MarketplaceHeader } from "@/components/marketplace-header"
import { AppShell } from "@/components/app-shell"
import { CategoryScroll } from "@/components/category-scroll"
import { ListingCard } from "@/components/listing-card"
import { BottomNav } from "@/components/bottom-nav"
import { listings as staticListings, fetchListings, getPriceValue } from "@/lib/listings"
import type { Listing } from "@/lib/listings"
import { searchListings } from "@/lib/embeddings"
import { useLanguage } from "@/lib/language-context"

type SortOption = "newest" | "price-asc" | "price-desc"

export default function Page() {
  return (
    <Suspense fallback={null}>
      <HomeContent />
    </Suspense>
  )
}

function HomeContent() {
  const { t } = useLanguage()
  const searchParams = useSearchParams()
  const [activeCategory, setActiveCategory] = useState("all")
  const [activeNav, setActiveNav] = useState("home")
  const [favorites, setFavorites] = useState<string[]>(["1"])
  const [allListings, setAllListings] = useState<Listing[]>(staticListings)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Listing[] | null>(null)
  const [searching, setSearching] = useState(false)
  const [sortBy, setSortBy] = useState<SortOption>("newest")
  const [showBackToTop, setShowBackToTop] = useState(false)

  useEffect(() => {
    if (searchParams.get("tab") === "saved") {
      setActiveNav("saved")
    }
  }, [searchParams])

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

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 400)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]))
  }

  const visibleListings = useMemo(() => {
    let list: Listing[]

    if (searchResults !== null) {
      list = searchResults
    } else {
      list = allListings
      if (activeCategory !== "all") {
        list = list.filter((l) => l.category === activeCategory)
      }
      if (activeNav === "saved") {
        list = list.filter((l) => favorites.includes(l.id))
      }
    }

    if (sortBy === "price-asc") {
      list = [...list].sort((a, b) => getPriceValue(a.price) - getPriceValue(b.price))
    } else if (sortBy === "price-desc") {
      list = [...list].sort((a, b) => getPriceValue(b.price) - getPriceValue(a.price))
    }

    return list
  }, [activeCategory, activeNav, favorites, allListings, searchResults, sortBy])

  return (
    <AppShell className="pb-24 md:pb-10">
      <MarketplaceHeader
  searchQuery={searchQuery}
  onSearchChange={setSearchQuery}
  activeNav={activeNav}
  onNavSelect={setActiveNav}
  favoritesCount={favorites.length}
/>

      <div className="px-5 pt-5">
        <CategoryScroll active={activeCategory} onSelect={setActiveCategory} />

        <div className="mt-6">
          <h2 className="text-lg font-bold text-foreground">
  {searchResults !== null
    ? t("searchResults")
    : activeNav === "saved"
    ? t("savedItems")
    : t("recentListings")}
</h2>
          <div className="mt-1 flex items-center justify-between gap-2">
            <span className="text-xs font-medium text-muted-foreground">
  {loading || searching ? t("loading") : `${visibleListings.length} ${t("results")}`}
</span>
            <div className="relative shrink-0">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                aria-label={t("sortBy")}
                className="appearance-none rounded-full border border-border/60 bg-card py-1.5 pl-3 pr-7 text-xs font-medium text-foreground shadow-sm outline-none"
              >
                <option value="newest">{t("sortNewest")}</option>
                <option value="price-asc">{t("sortPriceLowHigh")}</option>
                <option value="price-desc">{t("sortPriceHighLow")}</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>
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

      {showBackToTop && (
        <button
          type="button"
          onClick={scrollToTop}
          aria-label="Back to top"
          className="fixed bottom-28 right-4 z-30 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 transition-transform active:scale-90 md:bottom-8 md:right-8"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
    </AppShell>
  )
}
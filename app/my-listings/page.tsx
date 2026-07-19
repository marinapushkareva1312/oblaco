"use client"

import { useEffect, useState } from "react"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { fetchMyListings } from "@/lib/listings"
import type { Listing } from "@/lib/listings"
import { useLanguage } from "@/lib/language-context"
import { AppShell } from "@/components/app-shell"
import { DesktopNav } from "@/components/desktop-nav"
import { BottomNav } from "@/components/bottom-nav"
import { ListingCard } from "@/components/listing-card"

export default function MyListingsPage() {
  const { t } = useLanguage()
  const router = useRouter()
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [signedIn, setSignedIn] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data: userData } = await supabase.auth.getUser()

      if (!userData?.user) {
        setSignedIn(false)
        setLoading(false)
        return
      }

      const data = await fetchMyListings(userData.user.id)
      setListings(data)
      setLoading(false)
    }

    load()
  }, [])

  return (
    <AppShell className="pb-24 md:pb-10">

      <DesktopNav active="profile" />

      <div className="px-4 pt-12 pb-4 flex items-center justify-between border-b border-border/60 bg-card shadow-sm md:rounded-2xl md:border md:px-6 md:py-4 md:mt-4">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 rounded-full bg-muted flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <span className="text-foreground font-semibold text-lg">{t("myListings")}</span>
        <div className="w-10" />
      </div>

      <div className="px-5 pt-5">
        {loading ? (
          <div className="mt-16 flex flex-col items-center text-center">
            <div className="w-8 h-8 border-2 border-[#2563EB] border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-sm text-muted-foreground">{t("loadingListings")}</p>
          </div>
        ) : !signedIn ? (
          <div className="mt-16 flex flex-col items-center gap-3 text-center">
            <p className="text-sm font-medium text-foreground">{t("signInToViewListings")}</p>
            <button
              onClick={() => router.push("/auth")}
              className="rounded-2xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
            >
              {t("signIn")}
            </button>
          </div>
        ) : listings.length > 0 ? (
          <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
            {listings.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                isFavorite={false}
                onToggleFavorite={() => {}}
              />
            ))}
          </div>
        ) : (
          <div className="mt-16 flex flex-col items-center text-center">
            <p className="text-sm font-medium text-foreground">{t("noListingsYet")}</p>
            <p className="mt-1 text-xs text-muted-foreground text-pretty">{t("noMyListingsHint")}</p>
          </div>
        )}
      </div>

      <BottomNav active="profile" onSelect={() => {}} favoritesCount={0} />

    </AppShell>
  )
}

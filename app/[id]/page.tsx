"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Heart, Share2, MapPin, Clock, MessageCircle, Shield } from "lucide-react"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { useLanguage } from "@/lib/language-context"
import { BottomNav } from "@/components/bottom-nav"
import { DesktopNav } from "@/components/desktop-nav"

type Listing = {
  id: string
  title: string
  price: string
  description: string | null
  location: string | null
  category: string | null
  image: string | null
  created_at: string
  user_id: string | null
}

export default function ListingDetail() {
  const { t } = useLanguage()
  const [saved, setSaved] = useState(false)
  const [listing, setListing] = useState<Listing | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  useEffect(() => {
    const loadListing = async () => {
      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .eq("id", id)
        .single()

      if (error) {
        console.error("Ошибка загрузки объявления:", error)
      } else {
        setListing(data)
      }
      setLoading(false)
    }

    loadListing()
  }, [id])

  if (loading) {
    return (
      <div className="mx-auto flex min-h-screen max-w-md flex-col bg-[#F0F7FF] md:max-w-5xl">
        <DesktopNav active="" />
        <div className="flex flex-1 items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#2563EB] border-t-transparent rounded-full animate-spin" />
        </div>
        <BottomNav active="" onSelect={() => {}} favoritesCount={0} />
      </div>
    )
  }

  if (!listing) {
    return (
      <div className="mx-auto flex min-h-screen max-w-md flex-col bg-[#F0F7FF] md:max-w-5xl">
        <DesktopNav active="" />
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-4 text-center">
          <p className="text-lg font-bold text-[#1A1A2A]">{t("listingNotFound")}</p>
          <button
            onClick={() => router.push("/")}
            className="rounded-2xl bg-[#2563EB] px-6 py-3 text-sm font-semibold text-white"
          >
            {t("backToHome")}
          </button>
        </div>
        <BottomNav active="" onSelect={() => {}} favoritesCount={0} />
      </div>
    )
  }

  const timeAgo = new Date(listing.created_at).toLocaleDateString()

  return (
    <div className="mx-auto min-h-screen max-w-md bg-[#F0F7FF] pb-48 md:max-w-5xl md:pb-10">

      <DesktopNav active="" />

      <div
        className="px-4 pt-12 pb-4 flex items-center justify-between rounded-b-3xl shadow-lg md:rounded-2xl md:px-6 md:py-4 md:mt-4"
        style={{ background: "linear-gradient(135deg, #1E3A5F 0%, #2563EB 100%)" }}
      >
        <button
          onClick={() => router.back()}
          className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <span className="text-white font-bold text-lg">{t("listing")}</span>
        <div className="flex gap-2">
          <button
            onClick={() => setSaved(!saved)}
            className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
          >
            <Heart
              className="w-5 h-5"
              fill={saved ? "white" : "none"}
              stroke="white"
            />
          </button>
          <button className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <Share2 className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      <div className="md:mt-6 md:grid md:grid-cols-2 md:gap-6 md:px-0">

        <div className="mx-4 mt-4 h-64 overflow-hidden rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 shadow-sm md:mx-0 md:mt-0 md:h-full md:min-h-[420px]">
          {listing.image ? (
            <img
              src={listing.image}
              alt={listing.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="text-8xl">🪑</span>
            </div>
          )}
        </div>

        <div className="md:flex md:flex-col md:gap-3">

          <div className="mx-4 mt-4 bg-white rounded-2xl p-4 shadow-sm md:mx-0 md:mt-0">
            <div className="flex items-start justify-between mb-1">
              <span className="text-2xl font-black text-[#2563EB]">{listing.price}</span>
              <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                {t("active")}
              </span>
            </div>
            <h1 className="text-lg font-bold text-[#1A1A2A] mb-3">{listing.title}</h1>
            <div className="flex items-center gap-4 text-xs text-gray-400">
              {listing.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span>{listing.location}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{timeAgo}</span>
              </div>
            </div>
          </div>

          {listing.description && (
            <div className="mx-4 mt-3 bg-white rounded-2xl p-4 shadow-sm md:mx-0 md:mt-0">
              <h2 className="font-bold text-[#1A1A2A] mb-2 text-sm">{t("description")}</h2>
              <p className="text-gray-500 text-sm leading-relaxed">{listing.description}</p>
            </div>
          )}

          <div className="mx-4 mt-3 bg-white rounded-2xl p-4 shadow-sm md:mx-0 md:mt-0">
            <h2 className="font-bold text-[#1A1A2A] mb-3 text-sm">{t("seller")}</h2>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                {listing.user_id ? listing.user_id.charAt(0).toUpperCase() : "?"}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-[#1A1A2A] text-sm">{t("seller")}</div>
                <div className="text-xs text-gray-400">{t("memberOfCommunity")}</div>
              </div>
            </div>
          </div>

          <div className="hidden md:block md:mt-1">
            <Link href="/chat">
              <button
                className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 text-white font-bold text-base shadow-lg"
                style={{ background: "linear-gradient(135deg, #1E3A5F 0%, #2563EB 100%)" }}
              >
                <MessageCircle className="w-5 h-5" />
                {t("chatWithSeller")}
              </button>
            </Link>
          </div>

        </div>
      </div>

      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-full max-w-md p-4 bg-white border-t border-gray-100 md:hidden">
        <Link href="/chat">
          <button
            className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 text-white font-bold text-base shadow-lg"
            style={{ background: "linear-gradient(135deg, #1E3A5F 0%, #2563EB 100%)" }}
          >
            <MessageCircle className="w-5 h-5" />
            {t("chatWithSeller")}
          </button>
        </Link>
      </div>

      <BottomNav active="" onSelect={() => {}} favoritesCount={0} />

    </div>
  )
}
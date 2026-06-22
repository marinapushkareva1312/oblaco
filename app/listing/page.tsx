"use client"

import { useState } from "react"
import { ArrowLeft, Heart, Share2, MapPin, Clock, MessageCircle, Shield } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function ListingDetail() {
  const [saved, setSaved] = useState(false)
  const router = useRouter()

  return (
    <div className="mx-auto min-h-screen max-w-md bg-[#F0F7FF] pb-24">

      {/* Header */}
      <div
        className="px-4 pt-12 pb-4 flex items-center justify-between rounded-b-3xl shadow-lg"
        style={{ background: "linear-gradient(135deg, #1E3A5F 0%, #2563EB 100%)" }}
      >
        <button
          onClick={() => router.back()}
          className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <span className="text-white font-bold text-lg">Listing</span>
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

      {/* Photo */}
      <div className="mx-4 mt-4 rounded-2xl overflow-hidden h-64 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center shadow-sm">
        <span className="text-8xl">🪑</span>
      </div>

      {/* Price and title card */}
      <div className="mx-4 mt-4 bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex items-start justify-between mb-1">
          <span className="text-2xl font-black text-[#2563EB]">₩45,000</span>
          <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
            Active
          </span>
        </div>
        <h1 className="text-lg font-bold text-[#1A1A2A] mb-3">
          IKEA desk & chair — great condition
        </h1>
        <div className="flex items-center gap-4 text-xs text-gray-400">
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            <span>Haeundae, Busan</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>2 hours ago</span>
          </div>
        </div>
      </div>

      {/* Description card */}
      <div className="mx-4 mt-3 bg-white rounded-2xl p-4 shadow-sm">
        <h2 className="font-bold text-[#1A1A2A] mb-2 text-sm">Description</h2>
        <p className="text-gray-500 text-sm leading-relaxed">
          Selling my IKEA desk and chair set. Used for 1 year, still in great condition.
          No scratches, very clean. Perfect for a home office or study room.
          Size: 120x60cm desk. Pickup only from Haeundae area.
        </p>
      </div>

      {/* AI Translation card */}
      <div className="mx-4 mt-3 bg-[#EFF6FF] border border-[#BFDBFE] rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-base">🌐</span>
          <span className="text-xs font-semibold text-[#2563EB]">AI Translation</span>
        </div>
        <p className="text-gray-500 text-sm leading-relaxed">
          IKEA 책상과 의자 세트 판매합니다. 1년 사용했으며 상태 좋습니다.
          흠집 없고 매우 깨끗합니다. 해운대 지역 직거래만 가능합니다.
        </p>
      </div>

      {/* Seller card */}
      <div className="mx-4 mt-3 bg-white rounded-2xl p-4 shadow-sm">
        <h2 className="font-bold text-[#1A1A2A] mb-3 text-sm">Seller</h2>
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
            A
          </div>
          <div className="flex-1">
            <div className="font-semibold text-[#1A1A2A] text-sm">Anna K.</div>
            <div className="text-xs text-gray-400">Member since 2024 · 12 listings</div>
          </div>
          <div className="flex items-center gap-1 text-green-500 text-xs font-semibold">
            <Shield className="w-3 h-3" />
            <span>Verified</span>
          </div>
        </div>
      </div>

      {/* Bottom Chat Button */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md p-4 bg-white border-t border-gray-100">
        <Link href="/chat">
          <button
            className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 text-white font-bold text-base shadow-lg"
            style={{ background: "linear-gradient(135deg, #1E3A5F 0%, #2563EB 100%)" }}
          >
            <MessageCircle className="w-5 h-5" />
            Chat with Seller
          </button>
        </Link>
      </div>

    </div>
  )
}
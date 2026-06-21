"use client"

import { Search, SlidersHorizontal, Bell } from "lucide-react"

export function MarketplaceHeader() {
  return (
    <header
      className="rounded-b-3xl px-5 pb-6 pt-7 text-white shadow-lg"
      style={{ background: "linear-gradient(135deg, #1E3A5F 0%, #2563EB 100%)" }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-white/70">Your home under the same sky</p>
          <h1 className="text-2xl font-black tracking-widest text-white drop-shadow-lg">OBLACO</h1>
        </div>
        <button
          type="button"
          aria-label="Notifications"
          className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm transition-transform active:scale-90"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-white ring-2 ring-[#2563EB]" />
        </button>
      </div>

      <div className="mt-5 flex items-center gap-2.5">
        <div className="flex flex-1 items-center gap-2.5 rounded-2xl bg-white/15 px-4 py-3 backdrop-blur-sm">
          <Search className="h-5 w-5 text-white/80" />
          <input
            type="search"
            placeholder="Search marketplace"
            aria-label="Search marketplace"
            className="w-full bg-transparent text-sm text-white placeholder:text-white/60 focus:outline-none"
          />
        </div>
        <button
          type="button"
          aria-label="Filters"
          className="flex h-[46px] w-[46px] items-center justify-center rounded-2xl bg-white text-[#1E3A5F] shadow-md transition-transform active:scale-90"
        >
          <SlidersHorizontal className="h-5 w-5" />
        </button>
      </div>
    </header>
  )
}

"use client"

import { useState } from "react"
import { Settings, Star, Package, Heart, Globe, ChevronRight, LogOut, Shield, Bell } from "lucide-react"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const [language, setLanguage] = useState("en")
  const router = useRouter()

  const languages = [
    { code: "en", flag: "🇬🇧", label: "English" },
    { code: "ru", flag: "🇷🇺", label: "Русский" },
    { code: "ko", flag: "🇰🇷", label: "한국어" },
    { code: "zh", flag: "🇨🇳", label: "中文" },
    { code: "vi", flag: "🇻🇳", label: "Tiếng Việt" },
  ]

  const stats = [
    { label: "Listings", value: "12", icon: Package },
    { label: "Reviews", value: "4.8★", icon: Star },
    { label: "Saved", value: "24", icon: Heart },
  ]

  const menuItems = [
    { icon: Package, label: "My Listings", sublabel: "12 active", href: "/" },
    { icon: Heart, label: "Saved Items", sublabel: "24 items", href: "/" },
    { icon: Bell, label: "Notifications", sublabel: "All enabled", href: "/" },
    { icon: Shield, label: "Privacy & Safety", sublabel: "", href: "/" },
    { icon: Settings, label: "Settings", sublabel: "", href: "/" },
  ]

  return (
    <div className="mx-auto min-h-screen max-w-md bg-[#F0F7FF] pb-24">

      {/* Header */}
      <div
        className="px-4 pt-12 pb-8 flex flex-col items-center rounded-b-3xl shadow-lg"
        style={{ background: "linear-gradient(135deg, #1E3A5F 0%, #2563EB 100%)" }}
      >
        <div className="w-full flex justify-end mb-4">
          <button className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
            <Settings className="w-4 h-4 text-white" />
          </button>
        </div>

        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-300 to-blue-500 flex items-center justify-center text-white font-black text-3xl mb-3 shadow-lg">
          M
        </div>

        <h1 className="text-white font-bold text-xl">Marina P.</h1>
        <p className="text-white/60 text-xs mt-1">📍 Haeundae, Busan · Member since 2025</p>

        <div className="mt-2 flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full">
          <Shield className="w-3 h-3 text-green-300" />
          <span className="text-green-300 text-xs font-semibold">Verified member</span>
        </div>

        <div className="mt-5 w-full grid grid-cols-3 gap-2">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white/20 rounded-2xl py-3 flex flex-col items-center">
              <span className="text-white font-black text-lg">{stat.value}</span>
              <span className="text-white/60 text-xs">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Language selector */}
      <div className="mx-4 mt-4 bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Globe className="w-4 h-4 text-[#2563EB]" />
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">App Language</span>
        </div>
        <div className="flex gap-2 flex-wrap">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                language === lang.code
                  ? "bg-[#2563EB] text-white"
                  : "bg-[#F0F7FF] text-gray-500"
              }`}
            >
              <span>{lang.flag}</span>
              <span>{lang.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Menu items */}
      <div className="mx-4 mt-3 bg-white rounded-2xl shadow-sm overflow-hidden">
        {menuItems.map((item, index) => (
          <button
            key={item.label}
            onClick={() => router.push(item.href)}
            className={`w-full flex items-center gap-3 px-4 py-4 hover:bg-[#F0F7FF] transition-all ${
              index < menuItems.length - 1 ? "border-b border-gray-50" : ""
            }`}
          >
            <div className="w-9 h-9 rounded-xl bg-[#F0F7FF] flex items-center justify-center flex-shrink-0">
              <item.icon className="w-4 h-4 text-[#2563EB]" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-semibold text-[#1A1A2A]">{item.label}</p>
              {item.sublabel && (
                <p className="text-xs text-gray-400">{item.sublabel}</p>
              )}
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300" />
          </button>
        ))}
      </div>

      {/* Logout */}
      <div className="mx-4 mt-3 mb-4">
        <button
          onClick={() => router.push("/auth")}
          className="w-full bg-white rounded-2xl py-4 flex items-center justify-center gap-2 shadow-sm"
        >
          <LogOut className="w-4 h-4 text-red-400" />
          <span className="text-sm font-semibold text-red-400">Sign Out</span>
        </button>
      </div>

    </div>
  )
}
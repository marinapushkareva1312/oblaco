"use client"

import { useState, useEffect, useRef } from "react"
import { Settings, Star, Package, Heart, Globe, ChevronRight, LogOut, Shield, Bell, Camera } from "lucide-react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { useLanguage } from "@/lib/language-context"
import type { Language } from "@/lib/translations"

type Profile = {
  id: string
  name: string | null
  location: string | null
  avatar_url: string | null
}

export default function ProfilePage() {
  const { language, setLanguage, t } = useLanguage()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [nameInput, setNameInput] = useState("")
  const [locationInput, setLocationInput] = useState("")
  const [saving, setSaving] = useState(false)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    const loadProfile = async () => {
      const { data: userData } = await supabase.auth.getUser()
      if (!userData?.user) {
        setLoading(false)
        return
      }

      setEmail(userData.user.email ?? "")

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userData.user.id)
        .maybeSingle()

      if (data) {
        setProfile(data)
        setNameInput(data.name ?? "")
        setLocationInput(data.location ?? "")
      } else {
        setNameInput(userData.user.email?.split("@")[0] ?? "")
      }

      setLoading(false)
    }

    loadProfile()
  }, [])

  const handleAvatarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  const handleSave = async () => {
    setSaving(true)

    const { data: userData } = await supabase.auth.getUser()
    if (!userData?.user) {
      setSaving(false)
      return
    }

    let avatarUrl = profile?.avatar_url ?? null

    if (avatarFile) {
      const fileExt = avatarFile.name.split(".").pop()
      const fileName = `${userData.user.id}/${Date.now()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, avatarFile)

      if (!uploadError) {
        const { data: publicUrlData } = supabase.storage
          .from("avatars")
          .getPublicUrl(fileName)
        avatarUrl = publicUrlData.publicUrl
      }
    }

    const { data: upserted, error } = await supabase
      .from("profiles")
      .upsert({
        id: userData.user.id,
        name: nameInput.trim(),
        location: locationInput.trim(),
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (!error && upserted) {
      setProfile(upserted)
    }

    setSaving(false)
    setEditing(false)
    setAvatarFile(null)
    setAvatarPreview(null)
  }

  const languages: { code: Language; flag: string; label: string }[] = [
    { code: "en", flag: "🇬🇧", label: "English" },
    { code: "ru", flag: "🇷🇺", label: "Русский" },
    { code: "ko", flag: "🇰🇷", label: "한국어" },
    { code: "zh", flag: "🇨🇳", label: "中文" },
    { code: "vi", flag: "🇻🇳", label: "Tiếng Việt" },
  ]

  const stats = [
    { label: t("listingsStat"), value: "12", icon: Package },
    { label: t("reviewsStat"), value: "4.8★", icon: Star },
    { label: t("saved"), value: "24", icon: Heart },
  ]

  const menuItems = [
    { icon: Package, label: t("myListings"), sublabel: `12 ${t("active")}`, href: "/" },
    { icon: Heart, label: t("savedItemsMenu"), sublabel: `24 ${t("items")}`, href: "/" },
    { icon: Bell, label: t("notifications"), sublabel: t("allEnabled"), href: "/" },
    { icon: Shield, label: t("privacySafety"), sublabel: "", href: "/" },
    { icon: Settings, label: t("settings"), sublabel: "", href: "/" },
  ]

  const displayName = profile?.name || nameInput || t("user")
  const displayLocation = profile?.location || t("addYourLocation")
  const displayAvatar = avatarPreview || profile?.avatar_url

  if (loading) {
    return (
      <div className="mx-auto flex min-h-screen max-w-md items-center justify-center bg-[#F0F7FF]">
        <div className="w-8 h-8 border-2 border-[#2563EB] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="mx-auto min-h-screen max-w-md bg-[#F0F7FF] pb-24 md:max-w-5xl md:pb-10">

      <div
        className="px-4 pt-12 pb-8 flex flex-col items-center rounded-b-3xl shadow-lg md:rounded-2xl md:mt-6 md:pt-6"
        style={{ background: "linear-gradient(135deg, #1E3A5F 0%, #2563EB 100%)" }}
      >
        <div className="w-full flex justify-between mb-4">
          {editing ? (
            <button
              onClick={() => {
                setEditing(false)
                setAvatarFile(null)
                setAvatarPreview(null)
                setNameInput(profile?.name ?? "")
                setLocationInput(profile?.location ?? "")
              }}
              className="text-xs font-semibold text-white/80"
            >
              {t("cancel")}
            </button>
          ) : (
            <div />
          )}

          {editing ? (
            <button
              onClick={handleSave}
              disabled={saving}
              className="rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-[#2563EB] disabled:opacity-60"
            >
              {saving ? t("saving") : t("save")}
            </button>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="rounded-full bg-white/20 px-4 py-1.5 text-xs font-semibold text-white"
            >
              {t("editProfile")}
            </button>
          )}
        </div>

        <div className="relative mb-3">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-300 to-blue-500 flex items-center justify-center text-white font-black text-3xl shadow-lg overflow-hidden">
            {displayAvatar ? (
              <img src={displayAvatar} alt={displayName} className="h-full w-full object-cover" />
            ) : (
              displayName.charAt(0).toUpperCase()
            )}
          </div>
          {editing && (
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarSelect}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute -right-1 -bottom-1 flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-md"
              >
                <Camera className="h-3.5 w-3.5 text-[#2563EB]" />
              </button>
            </>
          )}
        </div>

        {editing ? (
          <input
            type="text"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            placeholder={t("yourName")}
            className="w-full max-w-xs rounded-xl bg-white/20 px-3 py-2 text-center text-white placeholder:text-white/60 outline-none font-bold text-xl"
          />
        ) : (
          <h1 className="text-white font-bold text-xl">{displayName}</h1>
        )}

        {editing ? (
          <input
            type="text"
            value={locationInput}
            onChange={(e) => setLocationInput(e.target.value)}
            placeholder={t("yourLocation")}
            className="mt-2 w-full max-w-xs rounded-xl bg-white/20 px-3 py-1.5 text-center text-xs text-white placeholder:text-white/60 outline-none"
          />
        ) : (
          <p className="text-white/60 text-xs mt-1">📍 {displayLocation}</p>
        )}

        <div className="mt-2 flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full">
          <Shield className="w-3 h-3 text-green-300" />
          <span className="text-green-300 text-xs font-semibold">{t("verifiedMember")}</span>
        </div>

        <div className="mt-5 w-full grid grid-cols-3 gap-2 md:max-w-md">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white/20 rounded-2xl py-3 flex flex-col items-center">
              <span className="text-white font-black text-lg">{stat.value}</span>
              <span className="text-white/60 text-xs">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="md:mt-6 md:grid md:grid-cols-2 md:gap-6">

        <div className="mx-4 mt-4 bg-white rounded-2xl p-4 shadow-sm md:mx-0 md:mt-0 space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Globe className="w-4 h-4 text-[#2563EB]" />
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{t("appLanguage")}</span>
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

          <div className="border-t border-gray-100 pt-4">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{t("account")}</span>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">{t("email")}</span>
                <span className="font-medium text-[#1A1A2A]">{email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">{t("location")}</span>
                <span className="font-medium text-[#1A1A2A]">{displayLocation}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="md:flex md:flex-col md:gap-3">

          <div className="mx-4 mt-3 bg-white rounded-2xl shadow-sm overflow-hidden md:mx-0 md:mt-0">
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

          <div className="mx-4 mt-3 mb-4 md:mx-0 md:mt-0 md:mb-0">
            <button
              onClick={() => router.push("/auth")}
              className="w-full bg-white rounded-2xl py-4 flex items-center justify-center gap-2 shadow-sm"
            >
              <LogOut className="w-4 h-4 text-red-400" />
              <span className="text-sm font-semibold text-red-400">{t("signOut")}</span>
            </button>
          </div>

        </div>
      </div>

    </div>
  )
}
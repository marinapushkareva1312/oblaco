"use client"

import { useState, useRef } from "react"
import { ArrowLeft, Camera, Mic, Sparkles, MapPin, Tag, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function PostListing() {
  const [title, setTitle] = useState("")
  const [price, setPrice] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [location, setLocation] = useState("")
  const [aiLoading, setAiLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPhotoFile(file)
    setPhotoPreview(URL.createObjectURL(file))
  }

  const removePhoto = () => {
    setPhotoFile(null)
    setPhotoPreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const generateAIDescription = async () => {
    if (!title) return
    setAiLoading(true)
    setTimeout(() => {
      setDescription(
        `Selling ${title} in great condition. Used carefully, no major scratches or damage. Perfect for anyone looking for a quality item at a reasonable price. Pickup available in ${location || "Busan"} area. Feel free to message me with any questions!`
      )
      setAiLoading(false)
    }, 1500)
  }

  const categories = [
    { id: "furniture", label: "Furniture", emoji: "🛋️" },
    { id: "electronics", label: "Electronics", emoji: "📱" },
    { id: "fashion", label: "Fashion", emoji: "👗" },
    { id: "pets", label: "Pets", emoji: "🐾" },
    { id: "housing", label: "Housing", emoji: "🏠" },
    { id: "other", label: "Other", emoji: "📦" },
  ]

  const handleSubmit = async () => {
    setErrorMsg("")

    if (!title.trim()) {
      setErrorMsg("Please enter a title")
      return
    }
    if (!category) {
      setErrorMsg("Please select a category")
      return
    }

    setSubmitting(true)

    const { data: userData } = await supabase.auth.getUser()

    if (!userData?.user) {
      setErrorMsg("Please sign in to post a listing")
      setSubmitting(false)
      return
    }

    let imageUrl: string | null = null

    if (photoFile) {
      const fileExt = photoFile.name.split(".").pop()
      const fileName = `${userData.user.id}/${Date.now()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from("listing-images")
        .upload(fileName, photoFile)

      if (uploadError) {
        console.error("Ошибка загрузки фото:", uploadError)
        setErrorMsg("Failed to upload photo. Please try again.")
        setSubmitting(false)
        return
      }

      const { data: publicUrlData } = supabase.storage
        .from("listing-images")
        .getPublicUrl(fileName)

      imageUrl = publicUrlData.publicUrl
    }

    const { data: inserted, error } = await supabase
      .from("listings")
      .insert({
        title: title.trim(),
        price: price ? `₩${price}` : "Free",
        description: description.trim(),
        location: location.trim(),
        category,
        image: imageUrl,
        user_id: userData.user.id,
      })
      .select()
      .single()

    if (error || !inserted) {
      console.error("Ошибка создания объявления:", error)
      setErrorMsg("Something went wrong. Please try again.")
      setSubmitting(false)
      return
    }

    fetch("/api/generate-embedding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: inserted.id,
        title: inserted.title,
        description: inserted.description,
      }),
    }).catch((err) => console.error("Ошибка фоновой генерации embedding:", err))

    setSubmitting(false)
    router.push("/")
  }

  return (
    <div className="mx-auto min-h-screen max-w-md bg-[#F0F7FF] pb-32 md:max-w-5xl md:pb-10">

      <div
        className="px-4 pt-12 pb-4 flex items-center justify-between rounded-b-3xl shadow-lg md:rounded-2xl md:px-6 md:py-4 md:mt-6"
        style={{ background: "linear-gradient(135deg, #1E3A5F 0%, #2563EB 100%)" }}
      >
        <button
          onClick={() => router.back()}
          className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <span className="text-white font-bold text-lg">Post Listing</span>
        <div className="w-10" />
      </div>

      <div className="px-4 pt-4 md:mt-6 md:grid md:grid-cols-2 md:gap-6 md:px-0">

        <div className="space-y-3">

          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <p className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wide">Photos</p>
            <div className="flex gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoSelect}
                className="hidden"
              />
              {photoPreview ? (
                <div className="relative h-24 w-24 md:h-40 md:w-40">
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="h-full w-full rounded-xl object-cover"
                  />
                  <button
                    type="button"
                    onClick={removePhoto}
                    className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow-md"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-24 h-24 md:h-40 md:w-40 rounded-xl bg-[#F0F7FF] border-2 border-dashed border-[#2563EB] flex flex-col items-center justify-center gap-1 cursor-pointer"
                >
                  <Camera className="w-6 h-6 text-[#2563EB]" />
                  <span className="text-xs text-[#2563EB] font-medium">Add photo</span>
                </button>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <p className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">Title</p>
            <input
              type="text"
              placeholder="What are you selling?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-sm text-[#1A1A2A] placeholder-gray-300 outline-none"
            />
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <p className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wide">Category</p>
            <div className="grid grid-cols-3 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center gap-1 justify-center transition-all ${
                    category === cat.id
                      ? "bg-[#2563EB] text-white"
                      : "bg-[#F0F7FF] text-gray-500"
                  }`}
                >
                  <span>{cat.emoji}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

        </div>

        <div className="space-y-3 mt-3 md:mt-0">

          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <p className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">Price</p>
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-[#2563EB]" />
              <span className="text-[#2563EB] font-bold">₩</span>
              <input
                type="number"
                placeholder="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="flex-1 text-sm text-[#1A1A2A] placeholder-gray-300 outline-none font-semibold"
              />
              <button
                type="button"
                onClick={() => setPrice("")}
                className="text-xs text-gray-400 bg-[#F0F7FF] px-3 py-1 rounded-full"
              >
                Free
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <p className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">Location</p>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#2563EB]" />
              <input
                type="text"
                placeholder="e.g. Haeundae, Busan"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="flex-1 text-sm text-[#1A1A2A] placeholder-gray-300 outline-none"
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Description</p>
              <button
                onClick={generateAIDescription}
                disabled={!title || aiLoading}
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  title && !aiLoading
                    ? "bg-[#2563EB] text-white"
                    : "bg-gray-100 text-gray-300"
                }`}
              >
                {aiLoading ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3 h-3" />
                    <span>AI Write</span>
                  </>
                )}
              </button>
            </div>
            <textarea
              placeholder="Describe your item... or tap AI Write above!"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full text-sm text-[#1A1A2A] placeholder-gray-300 outline-none resize-none leading-relaxed"
            />
          </div>

          <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#2563EB] flex items-center justify-center flex-shrink-0">
              <Mic className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#2563EB]">Voice Description</p>
              <p className="text-xs text-gray-400 mt-0.5">Speak in any language — AI will write the listing for you</p>
            </div>
          </div>

          {errorMsg && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-3 text-sm text-red-600 text-center">
              {errorMsg}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="hidden md:flex w-full py-4 rounded-2xl items-center justify-center gap-2 text-white font-bold text-base shadow-lg disabled:opacity-60"
            style={{ background: "linear-gradient(135deg, #1E3A5F 0%, #2563EB 100%)" }}
          >
            {submitting ? "Posting..." : "Post Listing"}
          </button>

        </div>
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md p-4 bg-white border-t border-gray-100 md:hidden">
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 text-white font-bold text-base shadow-lg disabled:opacity-60"
          style={{ background: "linear-gradient(135deg, #1E3A5F 0%, #2563EB 100%)" }}
        >
          {submitting ? "Posting..." : "Post Listing"}
        </button>
      </div>

    </div>
  )
}
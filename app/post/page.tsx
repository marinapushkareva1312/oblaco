"use client"

import { useState } from "react"
import { ArrowLeft, Camera, Mic, Sparkles, MapPin, Tag } from "lucide-react"

export default function PostListing() {
  const [title, setTitle] = useState("")
  const [price, setPrice] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [location, setLocation] = useState("")
  const [aiLoading, setAiLoading] = useState(false)

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

  return (
    <div className="mx-auto min-h-screen max-w-md bg-[#F0F7FF] pb-32">

      {/* Header */}
      <div
        className="px-4 pt-12 pb-4 flex items-center justify-between rounded-b-3xl shadow-lg"
        style={{ background: "linear-gradient(135deg, #1E3A5F 0%, #2563EB 100%)" }}
      >
        <button className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <span className="text-white font-bold text-lg">Post Listing</span>
        <div className="w-10" />
      </div>

      <div className="px-4 pt-4 space-y-3">

        {/* Photo upload */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <p className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wide">Photos</p>
          <div className="flex gap-3">
            <div className="w-24 h-24 rounded-xl bg-[#F0F7FF] border-2 border-dashed border-[#2563EB] flex flex-col items-center justify-center gap-1 cursor-pointer">
              <Camera className="w-6 h-6 text-[#2563EB]" />
              <span className="text-xs text-[#2563EB] font-medium">Add photo</span>
            </div>
            <div className="w-24 h-24 rounded-xl bg-[#F0F7FF] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-1 cursor-pointer">
              <span className="text-2xl">+</span>
              <span className="text-xs text-gray-300">More</span>
            </div>
          </div>
        </div>

        {/* Title */}
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

        {/* Category */}
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

        {/* Price */}
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
            <button className="text-xs text-gray-400 bg-[#F0F7FF] px-3 py-1 rounded-full">
              Free
            </button>
          </div>
        </div>

        {/* Location */}
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

        {/* AI Description */}
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

        {/* Voice input hint */}
        <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#2563EB] flex items-center justify-center flex-shrink-0">
            <Mic className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#2563EB]">Voice Description</p>
            <p className="text-xs text-gray-400 mt-0.5">Speak in any language — AI will write the listing for you</p>
          </div>
        </div>

      </div>

      {/* Bottom Post Button */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md p-4 bg-white border-t border-gray-100">
        <button
          className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 text-white font-bold text-base shadow-lg"
          style={{ background: "linear-gradient(135deg, #1E3A5F 0%, #2563EB 100%)" }}
        >
          Post Listing
        </button>
      </div>

    </div>
  )
}
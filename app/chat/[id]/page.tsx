"use client"

import { useState, useRef, useEffect } from "react"
import { ArrowLeft, Send, Mic, Globe } from "lucide-react"
import { useRouter, useParams } from "next/navigation"
import { useLanguage } from "@/lib/language-context"
import { BottomNav } from "@/components/bottom-nav"
import { DesktopNav } from "@/components/desktop-nav"
import { AppShell } from "@/components/app-shell"
import { getConversation, type ChatMessage } from "@/lib/chats"

export default function ChatThreadPage() {
  const { t } = useLanguage()
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const conversation = getConversation(id)

  const [messages, setMessages] = useState<ChatMessage[]>(conversation?.messages ?? [])
  const [input, setInput] = useState("")
  const [translateAll, setTranslateAll] = useState(true)
  const [showTranslationFor, setShowTranslationFor] = useState<Record<string, boolean>>({})
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMessages(conversation?.messages ?? [])
    setShowTranslationFor({})
  }, [id])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const sendMessage = () => {
    if (!input.trim()) return
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      text: input,
      sender: "me",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }
    setMessages((prev) => [...prev, newMsg])
    setInput("")
  }

  const toggleTranslation = (msgId: string) => {
    setShowTranslationFor((prev) => ({ ...prev, [msgId]: !prev[msgId] }))
  }

  if (!conversation) {
    return (
      <AppShell className="flex flex-col">
        <DesktopNav active="chats" />
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-4 text-center">
          <p className="text-lg font-bold text-[#1A1A2A]">{t("chatNotFound")}</p>
          <button
            onClick={() => router.push("/chats")}
            className="rounded-2xl bg-[#2563EB] px-6 py-3 text-sm font-semibold text-white"
          >
            {t("backToChats")}
          </button>
        </div>
        <BottomNav active="chats" onSelect={() => {}} favoritesCount={0} />
      </AppShell>
    )
  }

  return (
    <AppShell className="flex flex-col">

      <DesktopNav active="chats" />

      <div className="flex flex-1 flex-col md:my-6 md:mx-auto md:w-full md:max-w-3xl md:min-h-[85vh] md:rounded-3xl md:shadow-xl md:overflow-hidden">

      <div className="px-4 pt-12 pb-4 flex items-center gap-3 border-b border-border/60 bg-card shadow-sm md:rounded-none md:pt-6">
        <button
          onClick={() => router.push("/chats")}
          className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-300 to-blue-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
          {conversation.sellerInitial}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-foreground font-semibold text-sm truncate">{conversation.sellerName}</p>
          <p className="text-muted-foreground text-xs truncate">
            {conversation.listingTitle} · {conversation.listingPrice}
          </p>
        </div>
        <button
          onClick={() => setTranslateAll(!translateAll)}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex-shrink-0 ${
            translateAll ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
          }`}
        >
          <Globe className="w-3 h-3" />
          <span>{t("translate")}</span>
        </button>
      </div>

      <div className="flex-1 px-4 py-4 space-y-3 overflow-y-auto md:px-8">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === "me" ? "items-end" : "items-start"}`}
          >
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                msg.sender === "me"
                  ? "bg-[#2563EB] text-white rounded-tr-sm"
                  : "bg-white text-[#1A1A2A] rounded-tl-sm shadow-sm"
              }`}
            >
              <p className="text-sm leading-relaxed">{msg.text}</p>

              {msg.translated && translateAll && (
                <div className={`mt-2 pt-2 border-t ${msg.sender === "me" ? "border-white/20" : "border-gray-100"}`}>
                  <p className={`text-xs leading-relaxed ${msg.sender === "me" ? "text-white/70" : "text-gray-400"}`}>
                    🌐 {msg.translated}
                  </p>
                </div>
              )}

              {msg.translated && !translateAll && (
                <button
                  onClick={() => toggleTranslation(msg.id)}
                  className={`mt-1 text-xs underline ${msg.sender === "me" ? "text-white/60" : "text-[#2563EB]"}`}
                >
                  {showTranslationFor[msg.id] ? t("hideTranslation") : t("translate")}
                </button>
              )}
              {msg.translated && !translateAll && showTranslationFor[msg.id] && (
                <p className={`text-xs mt-1 leading-relaxed ${msg.sender === "me" ? "text-white/70" : "text-gray-400"}`}>
                  🌐 {msg.translated}
                </p>
              )}
            </div>
            <span className="text-xs text-gray-400 mt-1 px-1">{msg.time}</span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="px-4 pb-8 pt-2 bg-white border-t border-gray-100 md:px-8 md:pb-4">
        <div className="flex items-center gap-2">
          <button className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
            <Mic className="w-5 h-5 text-[#2563EB]" />
          </button>
          <div className="flex-1 bg-muted rounded-2xl px-4 py-3 flex items-center">
            <input
              type="text"
              placeholder={t("messagePlaceholder")}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className="flex-1 bg-transparent text-sm text-[#1A1A2A] placeholder-gray-300 outline-none"
            />
          </div>
          <button
            onClick={sendMessage}
            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-primary"
          >
            <Send className="w-4 h-4 text-primary-foreground" />
          </button>
        </div>
      </div>

      </div>

      <div className="h-24 md:hidden" />
      <BottomNav active="chats" onSelect={() => {}} favoritesCount={0} />

    </AppShell>
  )
}

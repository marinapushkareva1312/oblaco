"use client"

import { useState, useRef, useEffect } from "react"
import { ArrowLeft, Send, Mic, Globe } from "lucide-react"
import { useRouter } from "next/navigation"

type Message = {
  id: string
  text: string
  translated?: string
  sender: "me" | "them"
  time: string
  showTranslation?: boolean
}

const initialMessages: Message[] = [
  {
    id: "1",
    text: "Hi! Is the desk still available?",
    sender: "them",
    time: "10:30 AM",
  },
  {
    id: "2",
    text: "Yes it is! Come check it out anytime 😊",
    sender: "me",
    time: "10:32 AM",
  },
  {
    id: "3",
    text: "가격 조금 낮춰줄 수 있나요?",
    translated: "Can you lower the price a little?",
    sender: "them",
    time: "10:33 AM",
  },
]

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")
  const [translateAll, setTranslateAll] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const sendMessage = () => {
    if (!input.trim()) return
    const newMsg: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "me",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }
    setMessages((prev) => [...prev, newMsg])
    setInput("")
  }

  const toggleTranslation = (id: string) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, showTranslation: !m.showTranslation } : m
      )
    )
  }

  return (
    <div className="mx-auto min-h-screen max-w-md bg-[#F0F7FF] flex flex-col">

      {/* Header */}
      <div
        className="px-4 pt-12 pb-4 flex items-center gap-3 rounded-b-3xl shadow-lg"
        style={{ background: "linear-gradient(135deg, #1E3A5F 0%, #2563EB 100%)" }}
      >
        <button
          onClick={() => router.back()}
          className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-300 to-blue-500 flex items-center justify-center text-white font-bold flex-shrink-0">
          A
        </div>
        <div className="flex-1">
          <p className="text-white font-bold text-sm">Anna K.</p>
          <p className="text-white/60 text-xs">IKEA desk & chair · ₩45,000</p>
        </div>
        <button
          onClick={() => setTranslateAll(!translateAll)}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
            translateAll ? "bg-white text-[#2563EB]" : "bg-white/20 text-white"
          }`}
        >
          <Globe className="w-3 h-3" />
          <span>Translate</span>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 px-4 py-4 space-y-3 overflow-y-auto">
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
                  {msg.showTranslation ? "Hide translation" : "Translate"}
                </button>
              )}
              {msg.translated && !translateAll && msg.showTranslation && (
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

      {/* Input */}
      <div className="px-4 pb-8 pt-2 bg-white border-t border-gray-100">
        <div className="flex items-center gap-2">
          <button className="w-10 h-10 rounded-full bg-[#F0F7FF] flex items-center justify-center flex-shrink-0">
            <Mic className="w-5 h-5 text-[#2563EB]" />
          </button>
          <div className="flex-1 bg-[#F0F7FF] rounded-2xl px-4 py-3 flex items-center">
            <input
              type="text"
              placeholder="Message in any language..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className="flex-1 bg-transparent text-sm text-[#1A1A2A] placeholder-gray-300 outline-none"
            />
          </div>
          <button
            onClick={sendMessage}
            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #1E3A5F 0%, #2563EB 100%)" }}
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

    </div>
  )
}
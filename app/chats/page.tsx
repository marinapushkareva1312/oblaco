"use client"

import Link from "next/link"
import { useLanguage } from "@/lib/language-context"
import { conversations } from "@/lib/chats"
import { BottomNav } from "@/components/bottom-nav"
import { DesktopNav } from "@/components/desktop-nav"

export default function ChatsPage() {
  const { t } = useLanguage()

  return (
    <div className="mx-auto min-h-screen max-w-md bg-background pb-24 md:max-w-3xl md:pb-10">

      <DesktopNav active="chats" />

      <div className="px-4 pt-12 pb-6 border-b border-border/60 bg-card shadow-sm md:rounded-2xl md:border md:mt-4 md:px-6 md:py-6">
        <span className="text-foreground font-semibold text-lg">{t("chats")}</span>
      </div>

      <div className="mx-4 mt-4 space-y-2 md:mx-0 md:mt-6">
        {conversations.map((conv) => (
          <Link key={conv.id} href={`/chat/${conv.id}`}>
            <div className="flex items-center gap-3 bg-white rounded-2xl p-4 shadow-sm">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-300 to-blue-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                {conv.sellerInitial}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-[#1A1A2A] truncate">{conv.sellerName}</p>
                  <span className="text-xs text-gray-400 flex-shrink-0">{conv.lastMessageTime}</span>
                </div>
                <p className="text-xs text-gray-400 truncate">
                  {conv.listingTitle} · {conv.listingPrice}
                </p>
                <p className="text-sm text-gray-500 truncate mt-0.5">{conv.lastMessage}</p>
              </div>
              {conv.unread > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#2563EB] px-1.5 text-[11px] font-bold text-white flex-shrink-0">
                  {conv.unread}
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>

      <BottomNav active="chats" onSelect={() => {}} favoritesCount={0} />

    </div>
  )
}

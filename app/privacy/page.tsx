"use client"

import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/lib/language-context"
import { AppShell } from "@/components/app-shell"
import { DesktopNav } from "@/components/desktop-nav"
import { BottomNav } from "@/components/bottom-nav"

export default function PrivacyPage() {
  const { t } = useLanguage()
  const router = useRouter()

  return (
    <AppShell className="pb-24 md:pb-10">

      <DesktopNav active="profile" />

      <div className="px-4 pt-12 pb-4 flex items-center justify-between border-b border-border/60 bg-card shadow-sm md:rounded-2xl md:border md:px-6 md:py-4 md:mt-4">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 rounded-full bg-muted flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <span className="text-foreground font-semibold text-lg">{t("privacySafety")}</span>
        <div className="w-10" />
      </div>

      <div className="mt-16 flex flex-col items-center text-center px-4">
        <p className="text-sm text-muted-foreground">{t("privacySettingsComingSoon")}</p>
      </div>

      <BottomNav active="profile" onSelect={() => {}} favoritesCount={0} />

    </AppShell>
  )
}

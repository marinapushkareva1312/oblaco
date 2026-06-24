"use client"

import { useState } from "react"
import { Mail, Lock, User, Eye, EyeOff, Globe } from "lucide-react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [language, setLanguage] = useState("en")
  const router = useRouter()

  const languages = [
    { code: "en", label: "English", flag: "🇬🇧" },
    { code: "ru", label: "Русский", flag: "🇷🇺" },
    { code: "ko", label: "한국어", flag: "🇰🇷" },
    { code: "zh", label: "中文", flag: "🇨🇳" },
    { code: "vi", label: "Tiếng Việt", flag: "🇻🇳" },
  ]

  const handleGoogleLogin = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/`
    }
  })
  if (error) console.error(error)
}

  return (
    <div className="mx-auto min-h-screen max-w-md bg-[#F0F7FF] flex flex-col">

      {/* Top gradient section */}
      <div
        className="px-6 pt-16 pb-10 flex flex-col items-center rounded-b-3xl shadow-lg"
        style={{ background: "linear-gradient(135deg, #1E3A5F 0%, #2563EB 100%)" }}
      >
        <p className="text-white/60 text-xs mb-1">Your home under the same sky</p>
        <span className="text-white font-black text-3xl tracking-widest">OBLACO</span>

        {/* Toggle Login/Register */}
        <div className="mt-8 bg-white/20 rounded-2xl p-1 flex w-full">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
              isLogin ? "bg-white text-[#2563EB]" : "text-white"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
              !isLogin ? "bg-white text-[#2563EB]" : "text-white"
            }`}
          >
            Sign Up
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="px-4 pt-6 space-y-3 flex-1">

        {!isLogin && (
          <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3">
            <User className="w-4 h-4 text-[#2563EB] flex-shrink-0" />
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1 text-sm text-[#1A1A2A] placeholder-gray-300 outline-none"
            />
          </div>
        )}

        <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3">
          <Mail className="w-4 h-4 text-[#2563EB] flex-shrink-0" />
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 text-sm text-[#1A1A2A] placeholder-gray-300 outline-none"
          />
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3">
          <Lock className="w-4 h-4 text-[#2563EB] flex-shrink-0" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="flex-1 text-sm text-[#1A1A2A] placeholder-gray-300 outline-none"
          />
          <button onClick={() => setShowPassword(!showPassword)}>
            {showPassword
              ? <EyeOff className="w-4 h-4 text-gray-300" />
              : <Eye className="w-4 h-4 text-gray-300" />
            }
          </button>
        </div>

        {!isLogin && (
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Globe className="w-4 h-4 text-[#2563EB]" />
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Preferred Language
              </span>
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
        )}

        {isLogin && (
          <div className="text-right">
            <button className="text-xs text-[#2563EB] font-semibold">
              Forgot password?
            </button>
          </div>
        )}

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">or continue with</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleGoogleLogin}
            className="flex-1 bg-white rounded-2xl py-3 flex items-center justify-center gap-1.5 shadow-sm"
          >
            <span className="text-base">G</span>
            <span className="text-xs font-semibold text-gray-600">Google</span>
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 bg-white rounded-2xl py-3 flex items-center justify-center gap-1.5 shadow-sm"
          >
            <span className="text-base">🍎</span>
            <span className="text-xs font-semibold text-gray-600">Apple</span>
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 bg-[#1877F2] rounded-2xl py-3 flex items-center justify-center gap-1.5 shadow-sm"
          >
            <span className="text-base text-white font-bold">f</span>
            <span className="text-xs font-semibold text-white">Facebook</span>
          </button>
        </div>

        {!isLogin && (
          <p className="text-xs text-gray-400 text-center leading-relaxed px-4">
            By signing up you agree to our{" "}
            <span className="text-[#2563EB] font-semibold">Terms of Service</span>
            {" "}and{" "}
            <span className="text-[#2563EB] font-semibold">Privacy Policy</span>
          </p>
        )}

      </div>

      {/* Bottom Button */}
      <div className="px-4 pb-10 pt-4">
        <button
          onClick={handleSubmit}
          className="w-full py-4 rounded-2xl flex items-center justify-center text-white font-bold text-base shadow-lg"
          style={{ background: "linear-gradient(135deg, #1E3A5F 0%, #2563EB 100%)" }}
        >
          {isLogin ? "Sign In" : "Create Account"}
        </button>
      </div>

    </div>
  )
}
'use client'

import { useState, useRef, useEffect } from 'react'
import type { AnalysisResult } from '@/lib/types'
import { VerdictCard } from './VerdictCard'
import { EducationCard } from './EducationCard'
import { ReportButton } from './ReportButton'
import { SharePrompt } from './SharePrompt'

interface Message {
  id: string
  type: 'user' | 'bot'
  text?: string
  image?: string
  result?: AnalysisResult
  isLoading?: boolean
}

function BotMessage({ msg }: { msg: Message }) {
  if (msg.isLoading) {
    return (
      <div className="flex justify-start mb-3">
        <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.15s]" />
            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.3s]" />
          </div>
        </div>
      </div>
    )
  }

  if (msg.result) {
    return (
      <div className="flex justify-start mb-3">
        <div className="max-w-[92%] space-y-2">
          <VerdictCard result={msg.result} />
          <EducationCard card={msg.result.educationCard} />
          <ReportButton />
          <SharePrompt />
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-start mb-3">
      <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-2.5 max-w-[85%] text-sm text-gray-800 leading-relaxed">
        {msg.text}
      </div>
    </div>
  )
}

export function ChatWidget() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      type: 'bot',
      text: 'Kumusta! Ako si ScamGuard. I-paste mo ang kahina-hinalang message na natanggap mo, o mag-upload ng screenshot, at i-check ko kung scam ito.',
    },
  ])
  const [input, setInput] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file size (4MB limit)
    if (file.size > 4 * 1024 * 1024) {
      alert('Sobrang laki ng image. Max 4MB lang.')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const base64 = reader.result as string
      setSelectedImage(base64)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = input.trim()
    if ((!trimmed && !selectedImage) || isAnalyzing) return

    const userMsgId = Date.now().toString()
    const botMsgId = (Date.now() + 1).toString()

    setMessages((prev) => [
      ...prev,
      {
        id: userMsgId,
        type: 'user',
        text: trimmed || undefined,
        image: selectedImage || undefined
      },
      { id: botMsgId, type: 'bot', isLoading: true },
    ])
    setInput('')
    const imageToSend = selectedImage
    setSelectedImage(null)
    setIsAnalyzing(true)

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed || undefined,
          image: imageToSend || undefined
        }),
      })

      if (!res.ok) throw new Error('API error')

      const result: AnalysisResult = await res.json()
      setMessages((prev) =>
        prev.map((m) => (m.id === botMsgId ? { ...m, isLoading: false, result } : m))
      )
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === botMsgId
            ? { ...m, isLoading: false, text: 'May error. Subukan mo ulit.' }
            : m
        )
      )
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="flex flex-col h-[700px] max-h-[85vh] bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3.5 flex items-center gap-3 shrink-0">
        <div className="w-9 h-9 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-sm font-bold">
          SG
        </div>
        <div>
          <div className="font-semibold text-sm">ScamGuard PH</div>
          <div className="text-[11px] text-blue-200">AI-powered Scam Detector</div>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="w-2 h-2 bg-green-400 rounded-full" />
          <span className="text-[11px] text-blue-200">Online</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-white">
        {messages.map((msg) =>
          msg.type === 'user' ? (
            <div key={msg.id} className="flex justify-end mb-3">
              <div className="bg-blue-600 text-white rounded-2xl rounded-br-md px-4 py-2.5 max-w-[85%] text-sm">
                {msg.image && (
                  <img
                    src={msg.image}
                    alt="Uploaded screenshot"
                    className="max-h-[200px] rounded-lg mb-2"
                  />
                )}
                {msg.text && <div>{msg.text}</div>}
              </div>
            </div>
          ) : (
            <BotMessage key={msg.id} msg={msg} />
          )
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="border-t border-gray-100 p-3 bg-gray-50/50 shrink-0">
        {selectedImage && (
          <div className="mb-2 relative inline-block">
            <img
              src={selectedImage}
              alt="Selected preview"
              className="max-h-[100px] rounded-lg border border-gray-200"
            />
            <button
              type="button"
              onClick={() => setSelectedImage(null)}
              className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 flex items-center justify-center"
            >
              ×
            </button>
          </div>
        )}
        <div className="flex gap-2 items-end">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isAnalyzing}
            className="w-9 h-9 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center shrink-0"
            title="Upload screenshot"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </button>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSubmit(e)
              }
            }}
            placeholder="I-paste ang suspicious message o mag-upload ng screenshot..."
            className="flex-1 resize-none rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            rows={2}
            maxLength={2000}
            disabled={isAnalyzing}
          />
          <button
            type="submit"
            disabled={isAnalyzing || (!input.trim() && !selectedImage)}
            className="bg-blue-600 text-white px-4 rounded-xl font-semibold text-sm hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors self-end h-9"
          >
            Check
          </button>
        </div>
        <p className="text-[11px] text-gray-400 mt-1.5">
          AI assessment ito, hindi guarantee. I-verify directly sa institution kung hindi ka sigurado.
        </p>
      </form>
    </div>
  )
}

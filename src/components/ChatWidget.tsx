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
      text: 'Kumusta! Ako si ScamGuard. I-paste mo ang kahina-hinalang message na natanggap mo at i-check ko kung scam ito.',
    },
  ])
  const [input, setInput] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = input.trim()
    if (!trimmed || isAnalyzing) return

    const userMsgId = Date.now().toString()
    const botMsgId = (Date.now() + 1).toString()

    setMessages((prev) => [
      ...prev,
      { id: userMsgId, type: 'user', text: trimmed },
      { id: botMsgId, type: 'bot', isLoading: true },
    ])
    setInput('')
    setIsAnalyzing(true)

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed }),
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
                {msg.text}
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
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSubmit(e)
              }
            }}
            placeholder="I-paste ang suspicious message dito..."
            className="flex-1 resize-none rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            rows={2}
            maxLength={2000}
            disabled={isAnalyzing}
          />
          <button
            type="submit"
            disabled={isAnalyzing || !input.trim()}
            className="bg-blue-600 text-white px-4 rounded-xl font-semibold text-sm hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors self-end"
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

'use client'

import { useState } from 'react'
import ImageUpload from '@/components/ImageUpload'
import StyleResult from '@/components/StyleResult'
import { analyzeStyle } from '@/lib/styleAnalysis'
import type { StyleResult as StyleResultType } from '@/types'

export default function Home() {
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState<StyleResultType | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleImageUpload = async (imageFile: File) => {
    setAnalyzing(true)
    setError(null)
    setResult(null)

    try {
      const analysisResult = await analyzeStyle(imageFile)
      setResult(analysisResult)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed')
      console.error('Style analysis error:', err)
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent mb-4">
            Style Analyzer
          </h1>
          <p className="text-gray-600 text-lg">
            당신의 스타일을 찾아드립니다 ✨
          </p>
        </header>

        {/* Main Content */}
        {!result ? (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                사진을 업로드해주세요
              </h2>
              <p className="text-gray-600 mb-6">
                당신의 옷 색감과 메이크업 스타일을 분석하여 <br />
                4가지 스타일 중 하나로 분류해드립니다
              </p>
              <ImageUpload onUpload={handleImageUpload} isLoading={analyzing} />
            </div>

            {/* Style Info Cards */}
            <div className="grid grid-cols-2 gap-4">
              <StyleInfoCard
                title="Vanilla Girl"
                color="bg-gradient-to-br from-amber-100 to-orange-100"
                emoji="🤍"
              />
              <StyleInfoCard
                title="Strawberry Girl"
                color="bg-gradient-to-br from-pink-100 to-rose-100"
                emoji="🍓"
              />
              <StyleInfoCard
                title="Coffee Girl"
                color="bg-gradient-to-br from-stone-100 to-neutral-200"
                emoji="☕"
              />
              <StyleInfoCard
                title="Clean Girl"
                color="bg-gradient-to-br from-slate-50 to-gray-100"
                emoji="🤍"
              />
            </div>
          </div>
        ) : (
          <StyleResult result={result} onReset={() => setResult(null)} />
        )}

        {/* Error Display */}
        {error && (
          <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600 text-center">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {analyzing && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 text-center max-w-sm mx-4">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-pink-500 mx-auto mb-4"></div>
              <p className="text-lg font-semibold text-gray-800">
                스타일 분석 중...
              </p>
              <p className="text-sm text-gray-500 mt-2">
                AI가 당신의 스타일을 분석하고 있습니다
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

function StyleInfoCard({ title, color, emoji }: { title: string; color: string; emoji: string }) {
  return (
    <div className={`${color} rounded-xl p-4 text-center`}>
      <div className="text-3xl mb-2">{emoji}</div>
      <h3 className="font-semibold text-gray-800 text-sm">{title}</h3>
    </div>
  )
}

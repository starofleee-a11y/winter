'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { StyleResult as StyleResultType } from '@/types'
import { styleDefinitions } from '@/lib/styleDefinitions'

interface StyleResultProps {
  result: StyleResultType
  onReset: () => void
}

export default function StyleResult({ result, onReset }: StyleResultProps) {
  const [imageGenerating, setImageGenerating] = useState(false)
  const styleInfo = styleDefinitions[result.styleType]

  useEffect(() => {
    // If transformed image is not ready, start generating it
    if (!result.transformedImage) {
      setImageGenerating(true)
      // The image generation will happen in the background
      // and update the result when ready
    }
  }, [result.transformedImage])

  return (
    <div className="space-y-6">
      {/* Result Header */}
      <div className={`bg-gradient-to-br ${styleInfo.gradientColors} rounded-2xl p-8 text-center shadow-lg`}>
        <div className="text-6xl mb-4">{styleInfo.emoji}</div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          {styleInfo.name}
        </h2>
        <p className="text-gray-700 text-lg mb-4">{styleInfo.description}</p>
        <div className="inline-block bg-white bg-opacity-70 rounded-full px-6 py-2">
          <p className="text-sm font-semibold text-gray-800">
            일치도: {Math.round(result.confidence * 100)}%
          </p>
        </div>
      </div>

      {/* Characteristics */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          ✨ 당신의 스타일 특징
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {styleInfo.characteristics.map((char, idx) => (
            <div
              key={idx}
              className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-3 text-center"
            >
              <p className="text-sm font-medium text-gray-700">{char}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Images Comparison */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          🎨 AI 아트 변환
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Original Image */}
          <div>
            <p className="text-sm font-medium text-gray-600 mb-2">원본</p>
            <div className="relative aspect-square w-full rounded-lg overflow-hidden">
              <Image
                src={result.originalImage}
                alt="Original"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Transformed Image */}
          <div>
            <p className="text-sm font-medium text-gray-600 mb-2">
              {styleInfo.name} 스타일
            </p>
            <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-gray-100">
              {result.transformedImage ? (
                <Image
                  src={result.transformedImage}
                  alt="Transformed"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-purple-500 mx-auto mb-4"></div>
                    <p className="text-sm text-gray-500">
                      AI가 그림을 그리는 중...
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      최대 1-2분 소요될 수 있습니다
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Color Analysis */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          🎨 색상 분석 결과
        </h3>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-600 mb-2">주요 색상</p>
            <div className="flex gap-2 flex-wrap">
              {result.colorAnalysis.dominantColors.map((color, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-full border-2 border-gray-300"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-xs text-gray-600">{color}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">색상 계열</p>
              <p className="font-medium text-gray-800">
                {result.colorAnalysis.colorFamily === 'warm' && '따뜻한'}
                {result.colorAnalysis.colorFamily === 'cool' && '차가운'}
                {result.colorAnalysis.colorFamily === 'neutral' && '중성'}
                {result.colorAnalysis.colorFamily === 'vibrant' && '화려한'}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">명도</p>
              <p className="font-medium text-gray-800">
                {result.colorAnalysis.brightness === 'light' && '밝음'}
                {result.colorAnalysis.brightness === 'medium' && '중간'}
                {result.colorAnalysis.brightness === 'dark' && '어두움'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Reset Button */}
      <button
        onClick={onReset}
        className="w-full px-6 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-semibold hover:from-pink-600 hover:to-purple-600 transition-all"
      >
        다시 분석하기
      </button>
    </div>
  )
}

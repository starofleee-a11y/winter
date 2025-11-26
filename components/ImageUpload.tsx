'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'

interface ImageUploadProps {
  onUpload: (file: File) => void
  isLoading?: boolean
}

export default function ImageUpload({ onUpload, isLoading }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.')
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('파일 크기는 10MB 이하여야 합니다.')
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleUpload = () => {
    const file = fileInputRef.current?.files?.[0]
    if (file) {
      onUpload(file)
    }
  }

  const handleReset = () => {
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-4">
      {!preview ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center cursor-pointer hover:border-pink-400 hover:bg-pink-50 transition-all"
        >
          <div className="text-6xl mb-4">📸</div>
          <p className="text-gray-600 font-medium mb-2">
            클릭하여 사진을 선택하세요
          </p>
          <p className="text-sm text-gray-400">
            JPG, PNG 파일 (최대 10MB)
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative aspect-square w-full max-w-md mx-auto rounded-xl overflow-hidden">
            <Image
              src={preview}
              alt="Preview"
              fill
              className="object-cover"
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleReset}
              className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              disabled={isLoading}
            >
              다시 선택
            </button>
            <button
              onClick={handleUpload}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg font-medium hover:from-pink-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? '분석 중...' : '스타일 분석하기'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

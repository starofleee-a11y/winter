export type StyleType = 'vanilla' | 'strawberry' | 'coffee' | 'clean'

export interface ColorAnalysis {
  dominantColors: string[]
  colorFamily: 'warm' | 'cool' | 'neutral' | 'vibrant'
  brightness: 'light' | 'medium' | 'dark'
}

export interface VisionAnalysis {
  labels: string[]
  colors: Array<{ color: string; score: number }>
  faces?: number
  makeup?: boolean
  accessories?: string[]
}

export interface StyleResult {
  styleType: StyleType
  confidence: number
  originalImage: string
  transformedImage?: string
  colorAnalysis: ColorAnalysis
  visionAnalysis: VisionAnalysis
  description: string
  characteristics: string[]
}

export interface StyleDefinition {
  id: StyleType
  name: string
  emoji: string
  description: string
  characteristics: string[]
  colorPatterns: string[]
  makeupStyle: string[]
  clothingStyle: string[]
  imagePrompt: string
  gradientColors: string
}

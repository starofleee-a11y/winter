import { StyleType, ColorAnalysis, VisionAnalysis } from '@/types'
import { styleDefinitions } from './styleDefinitions'
import { matchesColorPattern } from './colorAnalysis'

interface StyleScore {
  style: StyleType
  score: number
  reasons: string[]
}

/**
 * Classify style based on color and vision analysis
 */
export function classifyStyle(
  colorAnalysis: ColorAnalysis,
  visionAnalysis: VisionAnalysis
): { styleType: StyleType; confidence: number; reasons: string[] } {
  const scores: StyleScore[] = [
    scoreVanillaStyle(colorAnalysis, visionAnalysis),
    scoreStrawberryStyle(colorAnalysis, visionAnalysis),
    scoreCoffeeStyle(colorAnalysis, visionAnalysis),
    scoreCleanStyle(colorAnalysis, visionAnalysis),
  ]

  // Sort by score
  scores.sort((a, b) => b.score - a.score)

  const topStyle = scores[0]
  const confidence = Math.min(topStyle.score / 100, 1)

  return {
    styleType: topStyle.style,
    confidence,
    reasons: topStyle.reasons,
  }
}

/**
 * Score Vanilla Girl style
 */
function scoreVanillaStyle(
  colorAnalysis: ColorAnalysis,
  visionAnalysis: VisionAnalysis
): StyleScore {
  let score = 0
  const reasons: string[] = []

  // Color matching
  const vanillaColorMatch = colorAnalysis.dominantColors.filter(color =>
    matchesColorPattern(color, styleDefinitions.vanilla.colorPatterns)
  ).length

  if (vanillaColorMatch > 0) {
    score += vanillaColorMatch * 20
    reasons.push('베이지/아이보리 계열 색상 감지')
  }

  // Warm colors
  if (colorAnalysis.colorFamily === 'warm') {
    score += 15
    reasons.push('따뜻한 색감')
  }

  // Neutral colors
  if (colorAnalysis.colorFamily === 'neutral') {
    score += 10
    reasons.push('중성적 색감')
  }

  // Light brightness
  if (colorAnalysis.brightness === 'light') {
    score += 15
    reasons.push('밝은 명도')
  }

  // Vision analysis - labels
  const labels = visionAnalysis.labels.map(l => l.toLowerCase())

  // Classic/elegant keywords
  const elegantKeywords = ['classic', 'elegant', 'sophisticated', 'formal', 'dress', 'blazer', 'coat']
  const hasElegant = labels.some(label => elegantKeywords.some(kw => label.includes(kw)))
  if (hasElegant) {
    score += 20
    reasons.push('우아하고 클래식한 스타일')
  }

  // Accessories (bold accessories)
  if (visionAnalysis.accessories && visionAnalysis.accessories.length > 0) {
    score += 10
    reasons.push('악세서리 착용')
  }

  // Subtle makeup
  if (visionAnalysis.makeup) {
    score += 5
  }

  return { style: 'vanilla', score, reasons }
}

/**
 * Score Strawberry Girl style
 */
function scoreStrawberryStyle(
  colorAnalysis: ColorAnalysis,
  visionAnalysis: VisionAnalysis
): StyleScore {
  let score = 0
  const reasons: string[] = []

  // Color matching
  const strawberryColorMatch = colorAnalysis.dominantColors.filter(color =>
    matchesColorPattern(color, styleDefinitions.strawberry.colorPatterns)
  ).length

  if (strawberryColorMatch > 0) {
    score += strawberryColorMatch * 25
    reasons.push('핑크/레드/퍼플 계열 색상 감지')
  }

  // Vibrant colors
  if (colorAnalysis.colorFamily === 'vibrant') {
    score += 25
    reasons.push('화려한 색감')
  }

  // Light to medium brightness
  if (colorAnalysis.brightness === 'light' || colorAnalysis.brightness === 'medium') {
    score += 10
    reasons.push('밝고 선명한 색상')
  }

  // Vision analysis
  const labels = visionAnalysis.labels.map(l => l.toLowerCase())

  // Cute/girly keywords
  const girlishKeywords = ['cute', 'pink', 'dress', 'skirt', 'ribbon', 'bow', 'girl', 'sweet']
  const hasGirlish = labels.some(label => girlishKeywords.some(kw => label.includes(kw)))
  if (hasGirlish) {
    score += 20
    reasons.push('러블리하고 귀여운 스타일')
  }

  // Colorful/vibrant keywords
  const vibrantKeywords = ['colorful', 'bright', 'vibrant', 'vivid']
  const hasVibrant = labels.some(label => vibrantKeywords.some(kw => label.includes(kw)))
  if (hasVibrant) {
    score += 15
    reasons.push('밝고 화려한 분위기')
  }

  // Makeup
  if (visionAnalysis.makeup) {
    score += 15
    reasons.push('화려한 메이크업')
  }

  return { style: 'strawberry', score, reasons }
}

/**
 * Score Coffee Girl style
 */
function scoreCoffeeStyle(
  colorAnalysis: ColorAnalysis,
  visionAnalysis: VisionAnalysis
): StyleScore {
  let score = 0
  const reasons: string[] = []

  // Color matching
  const coffeeColorMatch = colorAnalysis.dominantColors.filter(color =>
    matchesColorPattern(color, styleDefinitions.coffee.colorPatterns)
  ).length

  if (coffeeColorMatch > 0) {
    score += coffeeColorMatch * 25
    reasons.push('블랙/그레이/브라운 계열 색상 감지')
  }

  // Dark colors
  if (colorAnalysis.brightness === 'dark') {
    score += 20
    reasons.push('어두운 톤')
  }

  // Cool or neutral colors
  if (colorAnalysis.colorFamily === 'cool' || colorAnalysis.colorFamily === 'neutral') {
    score += 15
    reasons.push('쿨톤/무채색 계열')
  }

  // Vision analysis
  const labels = visionAnalysis.labels.map(l => l.toLowerCase())

  // Chic/edgy keywords
  const chicKeywords = ['black', 'leather', 'jacket', 'sunglasses', 'glasses', 'urban', 'street', 'modern']
  const hasChic = labels.some(label => chicKeywords.some(kw => label.includes(kw)))
  if (hasChic) {
    score += 20
    reasons.push('시크하고 모던한 스타일')
  }

  // Glasses/sunglasses
  const hasGlasses = visionAnalysis.accessories?.some(acc =>
    acc.includes('glasses') || acc.includes('sunglasses')
  )
  if (hasGlasses) {
    score += 15
    reasons.push('선글라스/안경 착용')
  }

  // Edgy makeup
  if (visionAnalysis.makeup) {
    score += 10
    reasons.push('음영 메이크업')
  }

  return { style: 'coffee', score, reasons }
}

/**
 * Score Clean Girl style
 */
function scoreCleanStyle(
  colorAnalysis: ColorAnalysis,
  visionAnalysis: VisionAnalysis
): StyleScore {
  let score = 0
  const reasons: string[] = []

  // Color matching
  const cleanColorMatch = colorAnalysis.dominantColors.filter(color =>
    matchesColorPattern(color, styleDefinitions.clean.colorPatterns)
  ).length

  if (cleanColorMatch > 0) {
    score += cleanColorMatch * 20
    reasons.push('화이트/뉴트럴 계열 색상 감지')
  }

  // Light colors
  if (colorAnalysis.brightness === 'light') {
    score += 20
    reasons.push('밝고 깨끗한 톤')
  }

  // Neutral colors
  if (colorAnalysis.colorFamily === 'neutral') {
    score += 15
    reasons.push('중성적이고 자연스러운 색감')
  }

  // Vision analysis
  const labels = visionAnalysis.labels.map(l => l.toLowerCase())

  // Casual/natural keywords
  const casualKeywords = ['casual', 'simple', 'white', 'natural', 'minimal', 't-shirt', 'jeans', 'comfortable']
  const hasCasual = labels.some(label => casualKeywords.some(kw => label.includes(kw)))
  if (hasCasual) {
    score += 20
    reasons.push('캐주얼하고 편안한 스타일')
  }

  // Minimal makeup or natural look
  if (!visionAnalysis.makeup) {
    score += 10
    reasons.push('자연스러운 메이크업')
  }

  // Simple/clean keywords
  const cleanKeywords = ['clean', 'fresh', 'simple', 'minimal']
  const hasClean = labels.some(label => cleanKeywords.some(kw => label.includes(kw)))
  if (hasClean) {
    score += 15
    reasons.push('깔끔하고 심플한 분위기')
  }

  return { style: 'clean', score, reasons }
}

import { ColorAnalysis } from '@/types'

interface RGB {
  r: number
  g: number
  b: number
}

/**
 * Extract dominant colors from an image
 */
export async function analyzeImageColors(imageFile: File): Promise<ColorAnalysis> {
  return new Promise((resolve, reject) => {
    const img = new window.Image()
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      reject(new Error('Canvas context not available'))
      return
    }

    img.onload = () => {
      // Resize for performance
      const maxSize = 200
      let width = img.width
      let height = img.height

      if (width > height) {
        if (width > maxSize) {
          height = (height * maxSize) / width
          width = maxSize
        }
      } else {
        if (height > maxSize) {
          width = (width * maxSize) / height
          height = maxSize
        }
      }

      canvas.width = width
      canvas.height = height
      ctx.drawImage(img, 0, 0, width, height)

      const imageData = ctx.getImageData(0, 0, width, height)
      const pixels = imageData.data

      // Sample pixels (every 10th pixel for performance)
      const colors: RGB[] = []
      for (let i = 0; i < pixels.length; i += 40) {
        // 40 = 10 pixels * 4 (RGBA)
        colors.push({
          r: pixels[i],
          g: pixels[i + 1],
          b: pixels[i + 2],
        })
      }

      // Get dominant colors using k-means clustering
      const dominantColors = getDominantColors(colors, 5)
      const colorFamily = determineColorFamily(dominantColors)
      const brightness = determineBrightness(dominantColors)

      resolve({
        dominantColors: dominantColors.map(rgbToHex),
        colorFamily,
        brightness,
      })
    }

    img.onerror = () => {
      reject(new Error('Failed to load image'))
    }

    img.src = URL.createObjectURL(imageFile)
  })
}

/**
 * Simple k-means clustering to find dominant colors
 */
function getDominantColors(colors: RGB[], k: number): RGB[] {
  if (colors.length === 0) return []

  // Initialize centroids randomly
  let centroids: RGB[] = []
  for (let i = 0; i < k; i++) {
    const randomIndex = Math.floor(Math.random() * colors.length)
    centroids.push({ ...colors[randomIndex] })
  }

  // Run k-means for a fixed number of iterations
  const iterations = 10
  for (let iter = 0; iter < iterations; iter++) {
    // Assign colors to nearest centroid
    const clusters: RGB[][] = Array.from({ length: k }, () => [])

    colors.forEach((color) => {
      let minDist = Infinity
      let closestCentroid = 0

      centroids.forEach((centroid, idx) => {
        const dist = colorDistance(color, centroid)
        if (dist < minDist) {
          minDist = dist
          closestCentroid = idx
        }
      })

      clusters[closestCentroid].push(color)
    })

    // Update centroids
    centroids = clusters.map((cluster) => {
      if (cluster.length === 0) return centroids[0]
      return {
        r: Math.round(cluster.reduce((sum, c) => sum + c.r, 0) / cluster.length),
        g: Math.round(cluster.reduce((sum, c) => sum + c.g, 0) / cluster.length),
        b: Math.round(cluster.reduce((sum, c) => sum + c.b, 0) / cluster.length),
      }
    })
  }

  return centroids
}

/**
 * Calculate Euclidean distance between two colors
 */
function colorDistance(c1: RGB, c2: RGB): number {
  return Math.sqrt(
    Math.pow(c1.r - c2.r, 2) +
    Math.pow(c1.g - c2.g, 2) +
    Math.pow(c1.b - c2.b, 2)
  )
}

/**
 * Convert RGB to HEX
 */
function rgbToHex(rgb: RGB): string {
  return '#' + [rgb.r, rgb.g, rgb.b]
    .map(x => {
      const hex = x.toString(16)
      return hex.length === 1 ? '0' + hex : hex
    })
    .join('')
}

/**
 * Determine color family (warm, cool, neutral, vibrant)
 */
function determineColorFamily(colors: RGB[]): 'warm' | 'cool' | 'neutral' | 'vibrant' {
  let warmScore = 0
  let coolScore = 0
  let saturationSum = 0

  colors.forEach((color) => {
    // Warm colors have more red
    if (color.r > color.b) warmScore++
    // Cool colors have more blue
    if (color.b > color.r) coolScore++

    // Calculate saturation
    const max = Math.max(color.r, color.g, color.b)
    const min = Math.min(color.r, color.g, color.b)
    const saturation = max === 0 ? 0 : (max - min) / max
    saturationSum += saturation
  })

  const avgSaturation = saturationSum / colors.length

  // High saturation = vibrant
  if (avgSaturation > 0.5) return 'vibrant'

  // Low saturation = neutral
  if (avgSaturation < 0.2) return 'neutral'

  // Otherwise warm or cool
  return warmScore > coolScore ? 'warm' : 'cool'
}

/**
 * Determine overall brightness
 */
function determineBrightness(colors: RGB[]): 'light' | 'medium' | 'dark' {
  const avgBrightness = colors.reduce((sum, color) => {
    return sum + (color.r + color.g + color.b) / 3
  }, 0) / colors.length

  if (avgBrightness > 180) return 'light'
  if (avgBrightness > 100) return 'medium'
  return 'dark'
}

/**
 * Check if a color matches a pattern
 */
export function matchesColorPattern(hex: string, patterns: string[]): boolean {
  const rgb = hexToRgb(hex)
  if (!rgb) return false

  return patterns.some(pattern => {
    switch (pattern.toLowerCase()) {
      case 'beige':
      case 'ivory':
      case 'cream':
      case 'tan':
      case 'camel':
      case 'sand':
      case 'nude':
        return isBeigeTone(rgb)

      case 'pink':
      case 'rose':
      case 'hot pink':
        return isPinkTone(rgb)

      case 'red':
      case 'magenta':
      case 'fuchsia':
        return isRedTone(rgb)

      case 'purple':
        return isPurpleTone(rgb)

      case 'black':
      case 'charcoal':
        return isDarkTone(rgb)

      case 'gray':
      case 'grey':
      case 'slate':
        return isGrayTone(rgb)

      case 'brown':
      case 'espresso':
      case 'mocha':
        return isBrownTone(rgb)

      case 'white':
      case 'off-white':
      case 'pale':
        return isWhiteTone(rgb)

      default:
        return false
    }
  })
}

function hexToRgb(hex: string): RGB | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}

function isBeigeTone(rgb: RGB): boolean {
  return rgb.r > 180 && rgb.g > 160 && rgb.b > 130 &&
         rgb.r - rgb.b < 80 && rgb.r - rgb.b > 20
}

function isPinkTone(rgb: RGB): boolean {
  return rgb.r > 200 && rgb.g < 180 && rgb.b > 150 && rgb.r > rgb.b
}

function isRedTone(rgb: RGB): boolean {
  return rgb.r > 180 && rgb.r > rgb.g + 50 && rgb.r > rgb.b + 50
}

function isPurpleTone(rgb: RGB): boolean {
  return rgb.r > 100 && rgb.b > 100 && rgb.b > rgb.g && rgb.r > rgb.g
}

function isDarkTone(rgb: RGB): boolean {
  return rgb.r < 60 && rgb.g < 60 && rgb.b < 60
}

function isGrayTone(rgb: RGB): boolean {
  const avg = (rgb.r + rgb.g + rgb.b) / 3
  return Math.abs(rgb.r - avg) < 30 && Math.abs(rgb.g - avg) < 30 &&
         Math.abs(rgb.b - avg) < 30 && avg > 60 && avg < 180
}

function isBrownTone(rgb: RGB): boolean {
  return rgb.r > 80 && rgb.r < 180 && rgb.g > 40 && rgb.g < 140 &&
         rgb.b > 20 && rgb.b < 100 && rgb.r > rgb.g && rgb.g > rgb.b
}

function isWhiteTone(rgb: RGB): boolean {
  return rgb.r > 220 && rgb.g > 220 && rgb.b > 220
}

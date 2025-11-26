import { StyleResult, VisionAnalysis } from '@/types'
import { analyzeImageColors } from './colorAnalysis'
import { classifyStyle } from './styleClassifier'
import { styleDefinitions } from './styleDefinitions'

/**
 * Main function to analyze user's style from uploaded image
 */
export async function analyzeStyle(imageFile: File): Promise<StyleResult> {
  try {
    // Step 1: Color analysis (client-side)
    console.log('Starting color analysis...')
    const colorAnalysis = await analyzeImageColors(imageFile)
    console.log('Color analysis complete:', colorAnalysis)

    // Step 2: Google Cloud Vision API analysis (server-side)
    console.log('Starting vision analysis...')
    const visionAnalysis = await analyzeWithVisionAPI(imageFile)
    console.log('Vision analysis complete:', visionAnalysis)

    // Step 3: Classify style
    console.log('Classifying style...')
    const { styleType, confidence, reasons } = classifyStyle(
      colorAnalysis,
      visionAnalysis
    )
    console.log('Style classification:', { styleType, confidence })

    // Step 4: Create preview URL for original image
    const originalImageUrl = URL.createObjectURL(imageFile)

    // Step 5: Generate AI art transformation (async - will be handled separately)
    const styleInfo = styleDefinitions[styleType]

    // Initial result without transformed image
    const result: StyleResult = {
      styleType,
      confidence,
      originalImage: originalImageUrl,
      colorAnalysis,
      visionAnalysis,
      description: styleInfo.description,
      characteristics: styleInfo.characteristics,
    }

    // Step 6: Start image generation in background
    generateStyledImage(imageFile, styleType, styleInfo.imagePrompt)
      .then(transformedImageUrl => {
        // This will be handled by updating the result later
        result.transformedImage = transformedImageUrl
      })
      .catch(error => {
        console.error('Image generation failed:', error)
      })

    return result

  } catch (error) {
    console.error('Style analysis error:', error)
    throw new Error('스타일 분석에 실패했습니다. 다시 시도해주세요.')
  }
}

/**
 * Call Vision API endpoint
 */
async function analyzeWithVisionAPI(imageFile: File): Promise<VisionAnalysis> {
  const formData = new FormData()
  formData.append('image', imageFile)

  const response = await fetch('/api/analyze-vision', {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    throw new Error('Vision API request failed')
  }

  const data = await response.json()

  return {
    labels: data.labels || [],
    colors: data.colors || [],
    faces: data.faces || 0,
    makeup: data.makeup || false,
    accessories: data.accessories || [],
  }
}

/**
 * Generate styled image using Replicate API
 */
async function generateStyledImage(
  imageFile: File,
  styleType: string,
  prompt: string
): Promise<string> {
  // First, upload image to temporary storage or convert to base64
  const imageUrl = await uploadImageForProcessing(imageFile)

  const response = await fetch('/api/generate-image', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      imageUrl,
      prompt,
      styleType,
    }),
  })

  if (!response.ok) {
    throw new Error('Image generation failed')
  }

  const data = await response.json()
  return data.imageUrl
}

/**
 * Upload image for processing
 * In a production app, this would upload to Firebase Storage or similar
 */
async function uploadImageForProcessing(imageFile: File): Promise<string> {
  // For now, convert to data URL
  // In production, upload to Firebase Storage and return the URL
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      resolve(reader.result as string)
    }
    reader.onerror = reject
    reader.readAsDataURL(imageFile)
  })
}

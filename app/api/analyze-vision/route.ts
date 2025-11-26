import { NextRequest, NextResponse } from 'next/server'
import vision, { ImageAnnotatorClient } from '@google-cloud/vision'

// Initialize Google Cloud Vision client
// Note: Requires GOOGLE_APPLICATION_CREDENTIALS environment variable
let visionClient: ImageAnnotatorClient | null = null

try {
  visionClient = new vision.ImageAnnotatorClient()
} catch (error) {
  console.error('Failed to initialize Vision API client:', error)
}

export async function POST(request: NextRequest) {
  try {
    if (!visionClient) {
      return NextResponse.json(
        { error: 'Vision API not configured' },
        { status: 500 }
      )
    }

    const formData = await request.formData()
    const imageFile = formData.get('image') as File

    if (!imageFile) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      )
    }

    // Convert File to Buffer
    const bytes = await imageFile.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Perform multiple detections
    const [labelResult] = await visionClient.labelDetection({
      image: { content: buffer },
    })

    const [colorResult] = await visionClient.imageProperties({
      image: { content: buffer },
    })

    const [faceResult] = await visionClient.faceDetection({
      image: { content: buffer },
    })

    // Extract relevant information
    const labels = labelResult.labelAnnotations?.map(label => ({
      description: label.description || '',
      score: label.score || 0,
    })) || []

    const colors = colorResult.imagePropertiesAnnotation?.dominantColors?.colors?.map(color => ({
      color: `rgb(${Math.round(color.color?.red || 0)}, ${Math.round(color.color?.green || 0)}, ${Math.round(color.color?.blue || 0)})`,
      score: color.score || 0,
      pixelFraction: color.pixelFraction || 0,
    })) || []

    const faces = faceResult.faceAnnotations?.length || 0

    // Analyze labels for makeup and accessories
    const labelDescriptions = labels.map(l => l.description.toLowerCase())
    const hasMakeup = labelDescriptions.some(desc =>
      desc.includes('makeup') ||
      desc.includes('lipstick') ||
      desc.includes('cosmetics') ||
      desc.includes('beauty')
    )

    const accessories = labelDescriptions.filter(desc =>
      desc.includes('glasses') ||
      desc.includes('sunglasses') ||
      desc.includes('jewelry') ||
      desc.includes('necklace') ||
      desc.includes('earring') ||
      desc.includes('accessory')
    )

    return NextResponse.json({
      labels: labels.slice(0, 10).map(l => l.description),
      colors,
      faces,
      makeup: hasMakeup,
      accessories,
    })

  } catch (error) {
    console.error('Vision API error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze image' },
      { status: 500 }
    )
  }
}

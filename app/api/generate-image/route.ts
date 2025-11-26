import { NextRequest, NextResponse } from 'next/server'
import Replicate from 'replicate'

// Initialize Replicate client
const replicate = process.env.REPLICATE_API_TOKEN
  ? new Replicate({ auth: process.env.REPLICATE_API_TOKEN })
  : null

export async function POST(request: NextRequest) {
  try {
    if (!replicate) {
      return NextResponse.json(
        { error: 'Replicate API not configured' },
        { status: 500 }
      )
    }

    const { imageUrl, prompt, styleType } = await request.json()

    if (!imageUrl || !prompt) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      )
    }

    // Use different models based on style type
    let model = 'stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b'

    // For anime/cartoon styles, use specific models
    if (styleType === 'strawberry' || styleType === 'clean') {
      // Anime/cartoon model
      model = 'lucataco/anime-anything-v3:49cf65a54c6b1e429c6e6d288e0b0d7efa59e196c0d90f88c5063d6e9d8f4f08'
    }

    const output = await replicate.run(model as any, {
      input: {
        image: imageUrl,
        prompt: prompt,
        negative_prompt: 'ugly, distorted, low quality, blurry, nsfw',
        num_outputs: 1,
        guidance_scale: 7.5,
        num_inference_steps: 50,
        width: 1024,
        height: 1024,
      },
    })

    // Output is typically an array of image URLs
    const imageUrls = Array.isArray(output) ? output : [output]
    const generatedImageUrl = imageUrls[0]

    return NextResponse.json({
      imageUrl: generatedImageUrl,
    })

  } catch (error) {
    console.error('Replicate API error:', error)
    return NextResponse.json(
      { error: 'Failed to generate image' },
      { status: 500 }
    )
  }
}

import { storage } from './firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

/**
 * Upload image to Firebase Storage
 */
export async function uploadImage(
  file: File,
  path: string
): Promise<string> {
  try {
    const storageRef = ref(storage, path)
    const snapshot = await uploadBytes(storageRef, file)
    const downloadUrl = await getDownloadURL(snapshot.ref)
    return downloadUrl
  } catch (error) {
    console.error('Error uploading image:', error)
    throw new Error('Failed to upload image')
  }
}

/**
 * Upload image with unique filename
 */
export async function uploadUserImage(file: File): Promise<string> {
  const timestamp = Date.now()
  const randomId = Math.random().toString(36).substring(7)
  const filename = `${timestamp}-${randomId}.${file.name.split('.').pop()}`
  const path = `user-uploads/${filename}`

  return uploadImage(file, path)
}

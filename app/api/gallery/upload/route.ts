import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'
import path from 'path'
import os from 'os'
import { randomUUID } from 'crypto'

const GALLERY_FILE = path.join(process.cwd(), 'data', 'gallery.json')


cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

interface GalleryItem {
  id: string
  title: string
  description: string
  categories: string[]
  imageUrl: string
  publicId: string
  createdAt: string
}

function getGalleryItems(): GalleryItem[] {
  try {
    if (!fs.existsSync(GALLERY_FILE)) {
      return []
    }
    const data = fs.readFileSync(GALLERY_FILE, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    return []
  }
}

function saveGalleryItems(items: GalleryItem[]): void {
  try {
    const dataDir = path.dirname(GALLERY_FILE)
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }
    fs.writeFileSync(GALLERY_FILE, JSON.stringify(items, null, 2))
  } catch (error) {
    throw new Error('Veriler kaydedilemedi')
  }
}


export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const categoriesString = formData.get('categories') as string
    const categories = JSON.parse(categoriesString) as string[]

    if (!file || !title || !description || !categories || categories.length === 0) {
      return NextResponse.json(
        { error: 'Eksik bilgi' },
        { status: 400 }
      )
    }


    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)


    const tempDir = os.tmpdir()
    const tempFilePath = path.join(tempDir, `${randomUUID()}-${file.name}`)


    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true })
    }


    fs.writeFileSync(tempFilePath, buffer)


    const uploadResult = await cloudinary.uploader.upload(tempFilePath, {
      folder: 'restly-gallery',
      transformation: [
        { width: 800, height: 800, crop: 'fill' },
        { quality: 'auto' }
      ]
    })


    try {
      fs.unlinkSync(tempFilePath)
    } catch (cleanupError) {
      console.warn('Geçici dosya silinemedi:', cleanupError)
    }


    const galleryItem: GalleryItem = {
      id: randomUUID(),
      title,
      description,
      categories,
      imageUrl: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      createdAt: new Date().toISOString()
    }


    const currentItems = getGalleryItems()
    currentItems.push(galleryItem)
    saveGalleryItems(currentItems)

    return NextResponse.json({
      success: true,
      message: 'Resim başarıyla yüklendi',
      item: galleryItem
    })

  } catch (error) {
    console.error('Resim yüklenirken hata:', error)
    return NextResponse.json(
      { error: 'Resim yüklenirken hata oluştu' },
      { status: 500 }
    )
  }
}


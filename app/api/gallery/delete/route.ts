import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'
import path from 'path'

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


export async function DELETE(request: NextRequest) {
  try {
    const { id, publicId } = await request.json()

    if (!id || !publicId) {
      return NextResponse.json(
        { error: 'Eksik bilgi' },
        { status: 400 }
      )
    }


    try {
      await cloudinary.uploader.destroy(publicId)
    } catch (cloudinaryError) {
      console.error('Cloudinary silme hatası:', cloudinaryError)

    }


    const currentItems = getGalleryItems()
    const filteredItems = currentItems.filter(item => item.id !== id)

    if (filteredItems.length === currentItems.length) {
      return NextResponse.json(
        { error: 'Galeri öğesi bulunamadı' },
        { status: 404 }
      )
    }

    saveGalleryItems(filteredItems)

    return NextResponse.json({
      success: true,
      message: 'Galeri öğesi silindi'
    })

  } catch (error) {
    console.error('Galeri öğesi silinirken hata:', error)
    return NextResponse.json(
      { error: 'Silme sırasında hata oluştu' },
      { status: 500 }
    )
  }
}


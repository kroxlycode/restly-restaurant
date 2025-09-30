import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const GALLERY_FILE = path.join(process.cwd(), 'data', 'gallery.json')

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


export async function PUT(request: NextRequest) {
  try {
    const { id, title, description, categories } = await request.json()

    if (!id || !title || !description || !categories || categories.length === 0) {
      return NextResponse.json(
        { error: 'Eksik bilgi' },
        { status: 400 }
      )
    }

    const currentItems = getGalleryItems()
    const itemIndex = currentItems.findIndex(item => item.id === id)

    if (itemIndex === -1) {
      return NextResponse.json(
        { error: 'Galeri öğesi bulunamadı' },
        { status: 404 }
      )
    }


    currentItems[itemIndex] = {
      ...currentItems[itemIndex],
      title,
      description,
      categories,

    }

    saveGalleryItems(currentItems)

    return NextResponse.json({
      success: true,
      message: 'Galeri öğesi güncellendi',
      item: currentItems[itemIndex]
    })

  } catch (error) {
    console.error('Galeri öğesi güncellenirken hata:', error)
    return NextResponse.json(
      { error: 'Güncelleme sırasında hata oluştu' },
      { status: 500 }
    )
  }
}


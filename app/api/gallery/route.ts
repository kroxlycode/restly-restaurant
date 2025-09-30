import { NextResponse } from 'next/server'
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
    console.error('Galeri verileri okunamadı:', error)
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
    console.error('Galeri verileri kaydedilemedi:', error)
    throw new Error('Veriler kaydedilemedi')
  }
}


export async function GET() {
  try {
    const items = getGalleryItems()
    return NextResponse.json(items)
  } catch (error) {
    console.error('Galeri öğeleri alınamadı:', error)
    return NextResponse.json(
      { error: 'Galeri öğeleri alınamadı' },
      { status: 500 }
    )
  }
}


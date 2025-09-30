import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'
import path from 'path'
import os from 'os'
import { randomUUID } from 'crypto'

const MENU_FILE = path.join(process.cwd(), 'data', 'menu.json')


cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

console.log('Cloudinary config:', {
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  has_api_key: !!process.env.CLOUDINARY_API_KEY,
  has_api_secret: !!process.env.CLOUDINARY_API_SECRET,
})

interface MenuItem {
  id: string
  name: string
  categoryId: string
  description: string
  price: number
  ingredients: string[]
  image: string
  popular: boolean
  rating: number
  allergens: string[]
  createdAt: string
  publicId: string
}

function getMenuItems(): { categories: any[], items: MenuItem[] } {
  try {
    if (!fs.existsSync(MENU_FILE)) {
      return { categories: [], items: [] }
    }
    const data = fs.readFileSync(MENU_FILE, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    return { categories: [], items: [] }
  }
}

function saveMenuItems(data: { categories: any[], items: MenuItem[] }): void {
  try {
    const dataDir = path.dirname(MENU_FILE)
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }
    fs.writeFileSync(MENU_FILE, JSON.stringify(data, null, 2))
  } catch (error) {
    throw new Error('Veriler kaydedilemedi')
  }
}


export async function POST(request: NextRequest) {
  try {
    console.log('Menu upload API called')

    const formData = await request.formData()
    console.log('Form data received')

    const file = formData.get('file') as File
    const name = formData.get('name') as string
    const categoryId = formData.get('categoryId') as string
    const description = formData.get('description') as string
    const priceString = formData.get('price') as string
    const ingredientsString = formData.get('ingredients') as string
    const popularString = formData.get('popular') as string
    const ratingString = formData.get('rating') as string
    const allergensString = formData.get('allergens') as string

    console.log('Raw form data:', {
      hasFile: !!file,
      name,
      categoryId,
      description,
      priceString,
      ingredientsString,
      popularString,
      ratingString,
      allergensString
    })


    const price = priceString ? parseFloat(priceString) : 0
    const ingredients = ingredientsString ? ingredientsString.split(',').map(i => i.trim()).filter(i => i) : []
    const popular = popularString === 'true'
    const rating = ratingString ? parseFloat(ratingString) : 5.0
    let allergens: string[] = []

    try {
      allergens = allergensString ? JSON.parse(allergensString) : []
    } catch (parseError) {
      console.error('Allergens JSON parse error:', parseError)
      allergens = []
    }

    console.log('Parsed form data:', {
      hasFile: !!file,
      name,
      categoryId,
      description,
      price,
      ingredients,
      popular,
      rating,
      allergensCount: allergens.length
    })

    if (!file || !name || !categoryId || !description || !price) {
      console.log('Missing required fields')
      return NextResponse.json(
        { error: 'Eksik bilgi', required: ['file', 'name', 'categoryId', 'description', 'price'] },
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


    let uploadResult;
    try {
      console.log('Uploading to Cloudinary...')
      uploadResult = await cloudinary.uploader.upload(tempFilePath, {
        folder: 'restly-menu',
        transformation: [
          { width: 600, height: 400, crop: 'fill' },
          { quality: 'auto' }
        ]
      })
      console.log('Cloudinary upload successful:', uploadResult.public_id)
    } catch (cloudinaryError) {
      console.error('Cloudinary upload failed:', cloudinaryError)
      console.log('Falling back to placeholder image...')


      uploadResult = {
        secure_url: `https://via.placeholder.com/600x400?text=${encodeURIComponent(name)}`,
        public_id: `fallback-${randomUUID()}`
      }
    }


    try {
      fs.unlinkSync(tempFilePath)
      console.log('Temporary file cleaned up')
    } catch (cleanupError) {
      console.warn('Geçici dosya silinemedi:', cleanupError)
    }


    const menuItem: MenuItem = {
      id: randomUUID(),
      name,
      categoryId,
      description,
      price,
      ingredients,
      image: uploadResult.secure_url,
      popular,
      rating,
      allergens,
      createdAt: new Date().toISOString(),
      publicId: uploadResult.public_id
    }


    console.log('Saving menu item to file...')
    const currentData = getMenuItems()
    console.log('Current menu data before save:', {
      categoriesCount: currentData.categories.length,
      itemsCount: currentData.items.length
    })

    currentData.items.push(menuItem)
    saveMenuItems(currentData)

    console.log('Menu item saved successfully')

    const isCloudinaryUpload = !uploadResult.public_id.startsWith('fallback-')

    return NextResponse.json({
      success: true,
      message: `Ürün başarıyla eklendi${isCloudinaryUpload ? ' (Cloudinary)' : ' (Fallback)'}`,
      item: menuItem,
      uploadMethod: isCloudinaryUpload ? 'cloudinary' : 'fallback'
    })

  } catch (error) {
    console.error('Ürün eklenirken hata:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })
    return NextResponse.json(
      {
        error: 'Ürün eklenirken hata oluştu',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}


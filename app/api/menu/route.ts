import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'
import path from 'path'
import os from 'os'
import { randomUUID } from 'crypto'

const menuFilePath = path.join(process.cwd(), 'data', 'menu.json')


cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})


const getMenuData = () => {
  try {
    const fileContents = fs.readFileSync(menuFilePath, 'utf8')
    return JSON.parse(fileContents)
  } catch (error) {
    console.error('Menü verileri okunamadı:', error)
    return { categories: [], items: [] }
  }
}


const saveMenuData = (data: any) => {
  try {
    const dir = path.dirname(menuFilePath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(menuFilePath, JSON.stringify(data, null, 2))
    return true
  } catch (error) {
    console.error('Menü verileri kaydedilemedi:', error)
    return false
  }
}

export async function GET() {
  try {
    const menuData = getMenuData()
    const response = NextResponse.json(menuData)
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    return response
  } catch (error) {
    console.error('Menü verileri getirilemedi:', error)
    const response = NextResponse.json({ error: 'Menü verileri getirilemedi' }, { status: 500 })
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    return response
  }
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || ''
    let action: string
    let data: any = {}

    if (contentType.includes('multipart/form-data')) {

      const formData = await request.formData()

      action = formData.get('action') as string
      const file = formData.get('file') as File
      const existingImage = formData.get('existingImage') as string
      const itemId = formData.get('itemId') as string


      const itemData = {
        name: formData.get('name') as string,
        categoryId: formData.get('categoryId') as string,
        description: formData.get('description') as string,
        price: parseFloat(formData.get('price') as string),
        ingredients: (formData.get('ingredients') as string || '').split(',').map(i => i.trim()).filter(i => i),
        popular: formData.get('popular') === 'true',
        rating: parseFloat(formData.get('rating') as string || '5'),
        allergens: JSON.parse(formData.get('allergens') as string || '[]'),
        image: existingImage || '' // Will be updated if file is uploaded
      }

      data = { item: itemData, itemId }


      if (file && file instanceof File) {
        try {
          console.log('Uploading image to Cloudinary...')


          const tempDir = os.tmpdir()
          const tempFilePath = path.join(tempDir, `${randomUUID()}-${file.name}`)

          if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true })
          }

          const bytes = await file.arrayBuffer()
          const buffer = Buffer.from(bytes)
          fs.writeFileSync(tempFilePath, buffer)


          let uploadResult;
          try {
            uploadResult = await cloudinary.uploader.upload(tempFilePath, {
              folder: 'restly-menu',
              transformation: [
                { width: 600, height: 400, crop: 'fill' },
                { quality: 'auto' }
              ]
            })
            console.log('Cloudinary upload successful:', uploadResult.public_id)
            itemData.image = uploadResult.secure_url
          } catch (cloudinaryError) {
            console.error('Cloudinary upload failed:', cloudinaryError)
            console.log('Falling back to placeholder image...')
            itemData.image = `https://via.placeholder.com/600x400?text=${encodeURIComponent(itemData.name)}`
          }


          try {
            fs.unlinkSync(tempFilePath)
          } catch (cleanupError) {
            console.warn('Temp file cleanup failed:', cleanupError)
          }

        } catch (uploadError) {
          console.error('Image upload error:', uploadError)
          itemData.image = `https://via.placeholder.com/600x400?text=${encodeURIComponent(itemData.name)}`
        }
      }

    } else {

      const jsonData = await request.json()
      action = jsonData.action
      data = jsonData
    }

    const menuData = getMenuData()

    switch (action) {
      case 'add_item': {
        const newItem = {
          id: randomUUID(),
          ...data.item,
          createdAt: new Date().toISOString()
        }
        menuData.items.push(newItem)
        break
      }

      case 'update_item': {
        const index = menuData.items.findIndex((item: any) => item.id === data.itemId)
        if (index !== -1) {
          menuData.items[index] = {
            ...menuData.items[index],
            ...data.item,
            updatedAt: new Date().toISOString()
          }
        }
        break
      }

      case 'delete_item': {
        menuData.items = menuData.items.filter((item: any) => item.id !== data.itemId)
        break
      }

      case 'add_category': {
        const newCategory = {
          id: randomUUID(),
          ...data.category
        }
        menuData.categories.push(newCategory)
        break
      }

      case 'update_category': {
        const index = menuData.categories.findIndex((cat: any) => cat.id === data.category.id)
        if (index !== -1) {
          menuData.categories[index] = { ...menuData.categories[index], ...data.category }
        }
        break
      }

      case 'delete_category': {
        menuData.categories = menuData.categories.filter((cat: any) => cat.id !== data.categoryId)

        menuData.items = menuData.items.filter((item: any) => item.categoryId !== data.categoryId)
        break
      }

      default:
        return NextResponse.json({ error: 'Geçersiz işlem' }, { status: 400 })
    }

    const success = saveMenuData(menuData)
    if (success) {
      const response = NextResponse.json({ success: true, data: menuData })
      response.headers.set('Access-Control-Allow-Origin', '*')
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
      return response
    } else {
      const response = NextResponse.json({ error: 'Veriler kaydedilemedi' }, { status: 500 })
      response.headers.set('Access-Control-Allow-Origin', '*')
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
      return response
    }
  } catch (error) {
    console.error('Menü işlemi başarısız:', error)
    const response = NextResponse.json({ error: 'İşlem gerçekleştirilemedi' }, { status: 500 })
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    return response
  }
}

export async function OPTIONS() {
  const response = new NextResponse(null, { status: 200 })
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  return response
}


import { NextRequest, NextResponse } from 'next/server'
import cloudinary from '@/lib/cloudinary'

export async function DELETE(request: NextRequest) {
  try {
    const { publicId } = await request.json()

    if (!publicId) {
      return NextResponse.json(
        { error: 'Public ID gerekli' },
        { status: 400 }
      )
    }


    const result = await cloudinary.uploader.destroy(publicId)

    if (result.result === 'ok') {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json(
        { error: 'Cloudinary silme başarısız' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Cloudinary silme hatası:', error)
    return NextResponse.json(
      { error: 'Cloudinary silme sırasında hata oluştu' },
      { status: 500 }
    )
  }
}


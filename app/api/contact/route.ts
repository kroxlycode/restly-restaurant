import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

interface ContactSettings {
  location: string
  phone: string
  email: string
}

const contactFilePath = path.join(process.cwd(), 'data', 'contact.json')


const getContactData = (): ContactSettings => {
  try {
    const fileContents = fs.readFileSync(contactFilePath, 'utf8')
    return JSON.parse(fileContents)
  } catch (error) {
    console.error('İletişim bilgileri yüklenemedi:', error)

    return {
      location: 'Nişantaşı Mah. Teşvikiye Cad. No:123 Şişli/İstanbul',
      phone: '+90 555 555 55 55',
      email: 'info@restly.com'
    }
  }
}


const saveContactData = (data: ContactSettings): boolean => {
  try {
    fs.writeFileSync(contactFilePath, JSON.stringify(data, null, 2), 'utf8')
    return true
  } catch (error) {
    console.error('İletişim bilgileri kaydedilemedi:', error)
    return false
  }
}

export async function GET() {
  try {
    const contactData = getContactData()
    return NextResponse.json(contactData)
  } catch (error) {
    console.error('İletişim bilgileri alınamadı:', error)
    return NextResponse.json(
      { error: 'İletişim bilgileri alınamadı' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const newContactData: ContactSettings = await request.json()


    if (!newContactData.location || typeof newContactData.location !== 'string') {
      return NextResponse.json(
        { error: 'Geçersiz veri: location alanı eksik veya yanlış format' },
        { status: 400 }
      )
    }

    if (!newContactData.phone || typeof newContactData.phone !== 'string') {
      return NextResponse.json(
        { error: 'Geçersiz veri: phone alanı eksik veya yanlış format' },
        { status: 400 }
      )
    }

    if (!newContactData.email || typeof newContactData.email !== 'string') {
      return NextResponse.json(
        { error: 'Geçersiz veri: email alanı eksik veya yanlış format' },
        { status: 400 }
      )
    }


    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(newContactData.email)) {
      return NextResponse.json(
        { error: 'Geçersiz e-posta formatı' },
        { status: 400 }
      )
    }


    const phoneRegex = /^\+90\s\d{3}\s\d{3}\s\d{2}\s\d{2}$/
    if (!phoneRegex.test(newContactData.phone)) {
      return NextResponse.json(
        { error: 'Telefon numarası +90 XXX XXX XX XX formatında olmalıdır' },
        { status: 400 }
      )
    }

    const success = saveContactData(newContactData)
    if (success) {
      return NextResponse.json({ message: 'İletişim bilgileri başarıyla kaydedildi' })
    } else {
      return NextResponse.json(
        { error: 'İletişim bilgileri kaydedilemedi' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('İletişim bilgileri kaydedilirken hata:', error)
    return NextResponse.json(
      { error: 'İletişim bilgileri kaydedilirken hata oluştu' },
      { status: 500 }
    )
  }
}


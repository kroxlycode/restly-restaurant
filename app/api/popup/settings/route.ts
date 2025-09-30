import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const SETTINGS_FILE = path.join(process.cwd(), 'data', 'popup-settings.json')

export async function GET() {
  try {

    const dataDir = path.dirname(SETTINGS_FILE)
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }


    let settings = {}
    if (fs.existsSync(SETTINGS_FILE)) {
      const data = fs.readFileSync(SETTINGS_FILE, 'utf8')
      settings = JSON.parse(data)
    }

    return NextResponse.json({
      success: true,
      settings
    })
  } catch (error) {
    console.error('Popup ayarları okunamadı:', error)
    return NextResponse.json(
      { success: false, message: 'Popup ayarları okunamadı' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const newSettings = await request.json()


    const dataDir = path.dirname(SETTINGS_FILE)
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }


    newSettings.updatedAt = new Date().toISOString()


    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(newSettings, null, 2))

    return NextResponse.json({
      success: true,
      message: 'Popup ayarları başarıyla kaydedildi',
      settings: newSettings
    })
  } catch (error) {
    console.error('Popup ayarları kaydedilemedi:', error)
    return NextResponse.json(
      { success: false, message: 'Popup ayarları kaydedilemedi' },
      { status: 500 }
    )
  }
}


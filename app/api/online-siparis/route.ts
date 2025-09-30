import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const settingsFilePath = path.join(process.cwd(), 'data', 'online-siparis-ayarlar.json')


const getSettings = () => {
  try {
    const fileContents = fs.readFileSync(settingsFilePath, 'utf8')
    return JSON.parse(fileContents)
  } catch (error) {
    console.error('Online sipariş ayarları okunamadı:', error)
    return {
      yemeksepeti: { name: "Yemeksepeti", active: false, link: "" },
      getir: { name: "Getir", active: false, link: "" },
      trendyolgoyemek: { name: "Trendyol Go Yemek", active: false, link: "" },
      tiklagelsin: { name: "Tıkla Gelsin", active: false, link: "" }
    }
  }
}


const saveSettings = (settings: any) => {
  try {
    const dir = path.dirname(settingsFilePath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(settingsFilePath, JSON.stringify(settings, null, 2))
    return true
  } catch (error) {
    console.error('Online sipariş ayarları kaydedilemedi:', error)
    return false
  }
}

export async function GET() {
  try {
    const settings = getSettings()
    return NextResponse.json(settings)
  } catch (error) {
    console.error('Ayarlar getirilemedi:', error)
    return NextResponse.json({ error: 'Ayarlar getirilemedi' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const settings = await request.json()
    
    const success = saveSettings(settings)
    if (success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: 'Ayarlar kaydedilemedi' }, { status: 500 })
    }
  } catch (error) {
    console.error('Ayarlar kaydedilemedi:', error)
    return NextResponse.json({ error: 'Ayarlar kaydedilemedi' }, { status: 500 })
  }
}


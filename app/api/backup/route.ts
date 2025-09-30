import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

interface BackupData {
  messages: any[]
  reservations: any[]
  menu: any
  gallery: any[]
  contact: any
  times: any
  seo: any
  smtp: any
  onlineOrders: any
  about: any
  timestamp: string
  version: string
}

const dataDir = path.join(process.cwd(), 'data')


const readJsonFile = (filename: string) => {
  try {
    const filePath = path.join(dataDir, filename)
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8')
      return JSON.parse(content)
    }
    return null
  } catch (error) {
    console.error(`${filename} okunamadı:`, error)
    return null
  }
}


const writeJsonFile = (filename: string, data: any) => {
  try {
    const filePath = path.join(dataDir, filename)
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8')
    return true
  } catch (error) {
    console.error(`${filename} yazılamadı:`, error)
    return false
  }
}

export async function GET() {
  try {

    const backupData: BackupData = {
      messages: readJsonFile('messages.json') || [],
      reservations: readJsonFile('reservations.json') || [],
      menu: readJsonFile('menu.json') || { categories: [], items: [] },
      gallery: readJsonFile('gallery.json') || [],
      contact: readJsonFile('contact.json') || {},
      times: readJsonFile('times.json') || {},
      seo: readJsonFile('seo.json') || {},
      smtp: readJsonFile('smtp.json') || {},
      onlineOrders: readJsonFile('online-siparis-ayarlar.json') || {},
      about: readJsonFile('about-settings.json') || {},
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    }

    return NextResponse.json(backupData)
  } catch (error) {
    console.error('Yedekleme oluşturma hatası:', error)
    return NextResponse.json(
      { error: 'Yedekleme oluşturulamadı' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const backupData: BackupData = await request.json()


    if (!backupData.timestamp || !backupData.version) {
      return NextResponse.json(
        { error: 'Geçersiz yedekleme dosyası formatı' },
        { status: 400 }
      )
    }


    const results = []

    results.push(writeJsonFile('messages.json', backupData.messages))
    results.push(writeJsonFile('reservations.json', backupData.reservations))
    results.push(writeJsonFile('menu.json', backupData.menu))
    results.push(writeJsonFile('gallery.json', backupData.gallery))
    results.push(writeJsonFile('contact.json', backupData.contact))
    results.push(writeJsonFile('times.json', backupData.times))
    results.push(writeJsonFile('seo.json', backupData.seo))
    results.push(writeJsonFile('smtp.json', backupData.smtp))
    results.push(writeJsonFile('online-siparis-ayarlar.json', backupData.onlineOrders))
    results.push(writeJsonFile('about-settings.json', backupData.about))


    const successCount = results.filter(result => result === true).length
    const totalCount = results.length

    if (successCount === totalCount) {
      return NextResponse.json({
        success: true,
        message: `${totalCount} dosya başarıyla geri yüklendi`,
        timestamp: backupData.timestamp,
        version: backupData.version
      })
    } else {
      return NextResponse.json(
        {
          error: `Sadece ${successCount}/${totalCount} dosya geri yüklendi`,
          partial: true
        },
        { status: 207 }
      )
    }

  } catch (error) {
    console.error('Yedekleme geri yükleme hatası:', error)
    return NextResponse.json(
      { error: 'Yedekleme geri yüklenirken hata oluştu' },
      { status: 500 }
    )
  }
}


import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const CAPACITY_SETTINGS_FILE = path.join(process.cwd(), 'data', 'capacity-settings.json')

interface CapacitySettings {
  isEnabled: boolean
  maxGuestsPerSlot: number
  maxTablesPerSlot: number
  averageGuestsPerTable: number
  timeSlots: string[]
  specialDays: {
    date: string
    capacity: number
    reason: string
  }[]
}


const defaultSettings: CapacitySettings = {
  isEnabled: true,
  maxGuestsPerSlot: 50,
  maxTablesPerSlot: 15,
  averageGuestsPerTable: 3.5,
  timeSlots: [
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
    '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30'
  ],
  specialDays: []
}

function getCapacitySettings(): CapacitySettings {
  try {
    if (!fs.existsSync(CAPACITY_SETTINGS_FILE)) {

      const dataDir = path.dirname(CAPACITY_SETTINGS_FILE)
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true })
      }
      fs.writeFileSync(CAPACITY_SETTINGS_FILE, JSON.stringify(defaultSettings, null, 2))
      return defaultSettings
    }

    const data = fs.readFileSync(CAPACITY_SETTINGS_FILE, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Kapasite ayarları okunamadı:', error)
    return defaultSettings
  }
}

function saveCapacitySettings(settings: CapacitySettings): void {
  try {
    fs.writeFileSync(CAPACITY_SETTINGS_FILE, JSON.stringify(settings, null, 2))
  } catch (error) {
    console.error('Kapasite ayarları kaydedilemedi:', error)
    throw new Error('Ayarlar kaydedilemedi')
  }
}


export async function GET() {
  try {
    const settings = getCapacitySettings()
    return NextResponse.json(settings)
  } catch (error) {
    console.error('Kapasite ayarları alınamadı:', error)
    return NextResponse.json(
      { error: 'Ayarlar alınamadı' },
      { status: 500 }
    )
  }
}


export async function PUT(request: NextRequest) {
  try {
    const updates = await request.json()

    const currentSettings = getCapacitySettings()
    const newSettings = { ...currentSettings, ...updates }

    saveCapacitySettings(newSettings)

    return NextResponse.json({
      success: true,
      message: 'Ayarlar başarıyla güncellendi',
      settings: newSettings
    })
  } catch (error) {
    console.error('Kapasite ayarları güncellenirken hata:', error)
    return NextResponse.json(
      { error: 'Ayarlar güncellenirken hata oluştu' },
      { status: 500 }
    )
  }
}


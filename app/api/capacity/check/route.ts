import { NextRequest, NextResponse } from 'next/server'
import { checkCapacity } from '@/lib/capacityManager'
import fs from 'fs'
import path from 'path'

const CAPACITY_SETTINGS_FILE = path.join(process.cwd(), 'data', 'capacity-settings.json')

function getCapacitySettings() {
  try {
    if (!fs.existsSync(CAPACITY_SETTINGS_FILE)) {
      return { isEnabled: true }
    }
    const data = fs.readFileSync(CAPACITY_SETTINGS_FILE, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    return { isEnabled: true }
  }
}

export async function POST(request: NextRequest) {
  try {
    const { date, time, guests } = await request.json()

    if (!date || !time || !guests) {
      return NextResponse.json(
        {
          available: false,
          message: 'Tarih, saat ve kişi sayısı gereklidir.'
        },
        { status: 400 }
      )
    }


    const settings = getCapacitySettings()

    if (!settings.isEnabled) {
      return NextResponse.json({
        available: true,
        message: '✅ Kapasite kontrolü devre dışı - Rezervasyon yapılabilir!',
        capacityEnabled: false,
        currentGuests: 0,
        remainingCapacity: 999,
        requestedGuests: guests
      })
    }

    const capacity = await checkCapacity(date, time, parseInt(guests))

    return NextResponse.json({
      ...capacity,
      capacityEnabled: true
    })
  } catch (error) {
    console.error('Kapasite kontrol hatası:', error)
    return NextResponse.json(
      {
        available: false,
        message: '⚠️ Kapasite kontrolü yapılamadı. Lütfen tekrar deneyin.',
        currentGuests: 0,
        remainingCapacity: 0,
        requestedGuests: 0,
        capacityEnabled: true
      },
      { status: 500 }
    )
  }
}


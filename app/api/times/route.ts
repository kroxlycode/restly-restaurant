import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

interface DaySchedule {
  open: string
  close: string
  isOpen: boolean
}

interface TimesData {
  weekdays: DaySchedule
  saturday: DaySchedule
  sunday: DaySchedule
}

const timesFilePath = path.join(process.cwd(), 'data', 'times.json')


const getTimesData = (): TimesData => {
  try {
    const fileContents = fs.readFileSync(timesFilePath, 'utf8')
    return JSON.parse(fileContents)
  } catch (error) {
    console.error('Çalışma saatleri verileri okunamadı:', error)

    return {
      weekdays: { open: '11:00', close: '23:00', isOpen: true },
      saturday: { open: '12:00', close: '01:00', isOpen: true },
      sunday: { open: '12:00', close: '22:00', isOpen: true }
    }
  }
}


const saveTimesData = (data: TimesData): boolean => {
  try {
    fs.writeFileSync(timesFilePath, JSON.stringify(data, null, 2), 'utf8')
    return true
  } catch (error) {
    console.error('Çalışma saatleri kaydedilemedi:', error)
    return false
  }
}

export async function GET() {
  try {
    const timesData = getTimesData()
    const response = NextResponse.json(timesData)
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    return response
  } catch (error) {
    console.error('Çalışma saatleri alınırken hata:', error)
    const response = NextResponse.json(
      { error: 'Çalışma saatleri alınamadı' },
      { status: 500 }
    )
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    return response
  }
}

export async function POST(request: NextRequest) {
  try {
    const newTimesData: TimesData = await request.json()


    const requiredKeys = ['weekdays', 'saturday', 'sunday']

    for (const key of requiredKeys) {
      if (!newTimesData[key as keyof TimesData]) {
        return NextResponse.json(
          { error: `Geçersiz veri: ${key} bölümü eksik` },
          { status: 400 }
        )
      }

      const dayData = newTimesData[key as keyof TimesData]
      if (typeof dayData.isOpen !== 'boolean' ||
          typeof dayData.open !== 'string' ||
          typeof dayData.close !== 'string') {
        return NextResponse.json(
          { error: `Geçersiz veri: ${key} için yanlış format` },
          { status: 400 }
        )
      }
    }

    const success = saveTimesData(newTimesData)
    if (success) {
      const response = NextResponse.json({ message: 'Çalışma saatleri başarıyla kaydedildi' })
      response.headers.set('Access-Control-Allow-Origin', '*')
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
      return response
    } else {
      const response = NextResponse.json(
        { error: 'Çalışma saatleri kaydedilemedi' },
        { status: 500 }
      )
      response.headers.set('Access-Control-Allow-Origin', '*')
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
      return response
    }
  } catch (error) {
    console.error('Çalışma saatleri kaydedilirken hata:', error)
    const response = NextResponse.json(
      { error: 'Çalışma saatleri kaydedilirken hata oluştu' },
      { status: 500 }
    )
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

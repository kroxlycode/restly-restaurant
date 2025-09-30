import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const SUBSCRIPTIONS_FILE = path.join(process.cwd(), 'data', 'subscriptions.json')

export async function GET() {
  try {

    const dataDir = path.dirname(SUBSCRIPTIONS_FILE)
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }


    let subscriptions = []
    if (fs.existsSync(SUBSCRIPTIONS_FILE)) {
      const data = fs.readFileSync(SUBSCRIPTIONS_FILE, 'utf8')
      subscriptions = JSON.parse(data)
    }

    return NextResponse.json({
      success: true,
      subscriptions: subscriptions,
      count: subscriptions.length
    })
  } catch (error) {
    console.error('Abonelikler getirilirken hata:', error)
    return NextResponse.json(
      { success: false, message: 'Abonelikler getirilemedi' },
      { status: 500 }
    )
  }
}


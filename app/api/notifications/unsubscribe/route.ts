import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const SUBSCRIPTIONS_FILE = path.join(process.cwd(), 'data', 'subscriptions.json')

export async function POST(request: NextRequest) {
  try {
    const subscription = await request.json()

    if (!fs.existsSync(SUBSCRIPTIONS_FILE)) {
      return NextResponse.json({ 
        success: true, 
        message: 'Abonelik zaten mevcut değil' 
      })
    }


    const data = fs.readFileSync(SUBSCRIPTIONS_FILE, 'utf8')
    let subscriptions = JSON.parse(data)


    subscriptions = subscriptions.filter(
      (sub: any) => sub.endpoint !== subscription.endpoint
    )


    fs.writeFileSync(SUBSCRIPTIONS_FILE, JSON.stringify(subscriptions, null, 2))

    return NextResponse.json({ 
      success: true, 
      message: 'Bildirim aboneliği iptal edildi!' 
    })
  } catch (error) {
    console.error('Abonelik iptal hatası:', error)
    return NextResponse.json(
      { success: false, message: 'Abonelik iptal edilemedi' },
      { status: 500 }
    )
  }
}


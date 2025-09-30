import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const SUBSCRIPTIONS_FILE = path.join(process.cwd(), 'data', 'subscriptions.json')

export async function POST(request: NextRequest) {
  try {
    const subscription = await request.json()


    const dataDir = path.dirname(SUBSCRIPTIONS_FILE)
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }


    let subscriptions = []
    if (fs.existsSync(SUBSCRIPTIONS_FILE)) {
      const data = fs.readFileSync(SUBSCRIPTIONS_FILE, 'utf8')
      subscriptions = JSON.parse(data)
    }


    const existingIndex = subscriptions.findIndex(
      (sub: any) => sub.endpoint === subscription.endpoint
    )

    if (existingIndex === -1) {

      subscriptions.push({
        ...subscription,
        subscribedAt: new Date().toISOString()
      })
    } else {

      subscriptions[existingIndex] = {
        ...subscription,
        subscribedAt: subscriptions[existingIndex].subscribedAt,
        updatedAt: new Date().toISOString()
      }
    }


    fs.writeFileSync(SUBSCRIPTIONS_FILE, JSON.stringify(subscriptions, null, 2))

    return NextResponse.json({ 
      success: true, 
      message: 'Bildirim aboneliği başarılı!' 
    })
  } catch (error) {
    console.error('Abonelik hatası:', error)
    return NextResponse.json(
      { success: false, message: 'Abonelik kaydedilemedi' },
      { status: 500 }
    )
  }
}


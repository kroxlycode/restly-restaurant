import { NextRequest, NextResponse } from 'next/server'
import webpush from 'web-push'
import fs from 'fs'
import path from 'path'

const SUBSCRIPTIONS_FILE = path.join(process.cwd(), 'data', 'subscriptions.json')


webpush.setVapidDetails(
  'mailto:admin@restly.com',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '',
  process.env.VAPID_PRIVATE_KEY || ''
)



export async function POST(request: NextRequest) {
  try {
    const { title, body, url, targetSubscription } = await request.json()

    if (!fs.existsSync(SUBSCRIPTIONS_FILE)) {
      return NextResponse.json(
        { success: false, message: 'Hiç abonelik bulunamadı' },
        { status: 404 }
      )
    }


    const data = fs.readFileSync(SUBSCRIPTIONS_FILE, 'utf8')
    const subscriptions = JSON.parse(data)

    if (subscriptions.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Hiç abonelik bulunamadı' },
        { status: 404 }
      )
    }

    const payload = JSON.stringify({
      title: title || 'Restly Restaurant',
      body: body || 'Yeni bir bildirim!',
      url: url || '/',
      icon: '/favicon.svg',
      badge: '/favicon.svg'
    })

    const results = []


    const targetSubs = targetSubscription ? [targetSubscription] : subscriptions

    for (const subscription of targetSubs) {
      try {

        let fixedSubscription = { ...subscription }


        if (subscription.endpoint.includes('fcm.googleapis.com/fcm/send/')) {

          const registrationToken = subscription.endpoint.split('/fcm/send/')[1]
          fixedSubscription.endpoint = `https://fcm.googleapis.com/wp/${registrationToken}`
        } else if (subscription.endpoint.includes('fcm.googleapis.com/wp/')) {

          fixedSubscription.endpoint = subscription.endpoint
        }


        if (!fixedSubscription.keys || !fixedSubscription.keys.p256dh || !fixedSubscription.keys.auth) {
          console.error('Invalid subscription keys:', fixedSubscription)
          results.push({
            success: false,
            endpoint: subscription.endpoint,
            error: 'Geçersiz subscription anahtarları'
          })
          continue
        }

        await webpush.sendNotification(fixedSubscription, payload)
        results.push({ success: true, endpoint: subscription.endpoint })
      } catch (error: any) {
        console.error('Bildirim gönderme hatası:', error)
        results.push({ 
          success: false, 
          endpoint: subscription.endpoint, 
          error: error?.message || 'Bilinmeyen hata' 
        })
        

        if (error?.statusCode === 410) {
          const updatedSubs = subscriptions.filter(
            (sub: any) => sub.endpoint !== subscription.endpoint
          )
          fs.writeFileSync(SUBSCRIPTIONS_FILE, JSON.stringify(updatedSubs, null, 2))
        }
      }
    }

    const successCount = results.filter(r => r.success).length
    const totalCount = results.length

    return NextResponse.json({
      success: true,
      message: `${successCount}/${totalCount} bildirim başarıyla gönderildi`,
      results
    })
  } catch (error) {
    console.error('Bildirim API hatası:', error)
    return NextResponse.json(
      { success: false, message: 'Bildirim gönderilemedi' },
      { status: 500 }
    )
  }
}


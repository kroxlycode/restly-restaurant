import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const contactPath = path.join(process.cwd(), 'data', 'contact.json')
    const contactData = JSON.parse(fs.readFileSync(contactPath, 'utf8'))

    return NextResponse.json(contactData)
  } catch (error) {
    console.error('Contact info API error:', error)
    return NextResponse.json(
      {
        location: 'Nişantaşı Mah. Teşvikiye Cad. İstanbul/Şişli',
        phone: '+90 555 555 55 55',
        email: 'info@restly.com'
      },
      { status: 500 }
    )
  }
}

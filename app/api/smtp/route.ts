import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const smtpFilePath = path.join(process.cwd(), 'data', 'smtp.json')

export async function GET() {
  try {
    const fileContents = fs.readFileSync(smtpFilePath, 'utf8')
    const settings = JSON.parse(fileContents)
    return NextResponse.json(settings)
  } catch (error) {

    const defaultSettings = {
      host: '',
      port: 587,
      secure: false,
      user: '',
      pass: '',
      fromName: '',
      fromEmail: ''
    }
    return NextResponse.json(defaultSettings)
  }
}

export async function POST(request: NextRequest) {
  try {
    const settings = await request.json()


    const dataDir = path.dirname(smtpFilePath)
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }

    fs.writeFileSync(smtpFilePath, JSON.stringify(settings, null, 2))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving SMTP settings:', error)
    return NextResponse.json({ error: 'Failed to save SMTP settings' }, { status: 500 })
  }
}


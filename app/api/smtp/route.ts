import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const smtpFilePath = path.join(process.cwd(), 'data', 'smtp.json')

export async function GET() {
  try {
    const fileContents = fs.readFileSync(smtpFilePath, 'utf8')
    const settings = JSON.parse(fileContents)
    const response = NextResponse.json(settings)
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    return response
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
    const response = NextResponse.json(defaultSettings)
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    return response
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

    const response = NextResponse.json({ success: true })
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    return response
  } catch (error) {
    console.error('Error saving SMTP settings:', error)
    const response = NextResponse.json({ error: 'Failed to save SMTP settings' }, { status: 500 })
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

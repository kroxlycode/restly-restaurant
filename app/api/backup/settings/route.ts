import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const backupSettingsPath = path.join(process.cwd(), 'data', 'backupsettings.json')

interface BackupSettings {
  enabled: boolean
  intervalHours: number
  intervalMinutes: number
  email: string
  lastBackupTime?: string
  logs: BackupLog[]
}

interface BackupLog {
  id: string
  timestamp: string
  type: 'manual' | 'auto'
  status: 'success' | 'error'
  emailSent: boolean
  fileSize?: string
  errorMessage?: string
}


const defaultSettings: BackupSettings = {
  enabled: false,
  intervalHours: 24,
  intervalMinutes: 0,
  email: '',
  logs: []
}


const readBackupSettings = (): BackupSettings => {
  try {
    if (fs.existsSync(backupSettingsPath)) {
      const content = fs.readFileSync(backupSettingsPath, 'utf8')
      return JSON.parse(content)
    }
    return defaultSettings
  } catch (error) {
    console.error('Yedekleme ayarları okunamadı:', error)
    return defaultSettings
  }
}


const writeBackupSettings = (settings: BackupSettings): boolean => {
  try {
    fs.writeFileSync(backupSettingsPath, JSON.stringify(settings, null, 2), 'utf8')
    return true
  } catch (error) {
    console.error('Yedekleme ayarları yazılamadı:', error)
    return false
  }
}


export async function GET() {
  try {
    const settings = readBackupSettings()
    return NextResponse.json(settings)
  } catch (error) {
    console.error('Yedekleme ayarları okuma hatası:', error)
    return NextResponse.json(
      { error: 'Yedekleme ayarları okunamadı' },
      { status: 500 }
    )
  }
}


export async function POST(request: NextRequest) {
  try {
    const newSettings: Partial<BackupSettings> = await request.json()
    const currentSettings = readBackupSettings()


    const updatedSettings: BackupSettings = {
      ...currentSettings,
      ...newSettings,

      logs: currentSettings.logs || []
    }

    if (writeBackupSettings(updatedSettings)) {
      return NextResponse.json({
        success: true,
        message: 'Yedekleme ayarları kaydedildi',
        settings: updatedSettings
      })
    } else {
      throw new Error('Ayarlar kaydedilemedi')
    }

  } catch (error) {
    console.error('Yedekleme ayarları kaydetme hatası:', error)
    return NextResponse.json(
      { error: 'Yedekleme ayarları kaydedilemedi' },
      { status: 500 }
    )
  }
}


export async function PUT(request: NextRequest) {
  try {
    const logData: Omit<BackupLog, 'id' | 'timestamp'> = await request.json()
    const currentSettings = readBackupSettings()

    const newLog: BackupLog = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...logData
    }


    const updatedLogs = [newLog, ...(currentSettings.logs || [])].slice(0, 100)
    const updatedSettings: BackupSettings = {
      ...currentSettings,
      logs: updatedLogs,
      lastBackupTime: logData.type === 'manual' ? new Date().toLocaleString('tr-TR') : currentSettings.lastBackupTime
    }

    if (writeBackupSettings(updatedSettings)) {
      return NextResponse.json({
        success: true,
        message: 'Log eklendi',
        log: newLog
      })
    } else {
      throw new Error('Log kaydedilemedi')
    }

  } catch (error) {
    console.error('Log ekleme hatası:', error)
    return NextResponse.json(
      { error: 'Log eklenemedi' },
      { status: 500 }
    )
  }
}


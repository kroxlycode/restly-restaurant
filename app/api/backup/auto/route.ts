import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import nodemailer from 'nodemailer'


const readJsonFile = (filename: string) => {
  try {
    const filePath = path.join(process.cwd(), 'data', filename)
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8')
      return JSON.parse(content)
    }
    return null
  } catch (error) {
    console.error(`${filename} okunamadı:`, error)
    return null
  }
}


export async function POST(request: NextRequest) {
  try {
    const { email, interval } = await request.json()


    const smtpSettings = readJsonFile('smtp.json')
    if (!smtpSettings?.host) {
      return NextResponse.json(
        { error: 'SMTP ayarları yapılandırılmamış' },
        { status: 400 }
      )
    }


    const backupData = {
      messages: readJsonFile('messages.json') || [],
      reservations: readJsonFile('reservations.json') || [],
      menu: readJsonFile('menu.json') || { categories: [], items: [] },
      gallery: readJsonFile('gallery.json') || [],
      contact: readJsonFile('contact.json') || {},
      times: readJsonFile('times.json') || {},
      seo: readJsonFile('seo.json') || {},
      onlineOrders: readJsonFile('online-siparis-ayarlar.json') || {},
      about: readJsonFile('about-settings.json') || {},
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      interval: interval || 24,
      autoBackup: true
    }


    const dataStr = JSON.stringify(backupData, null, 2)
    const backupFilename = `restly-auto-backup-${new Date().toISOString().split('T')[0]}.json`


    const transporter = nodemailer.createTransport({
      host: smtpSettings.host,
      port: smtpSettings.port,
      secure: smtpSettings.secure,
      auth: {
        user: smtpSettings.user,
        pass: smtpSettings.pass
      }
    })


    const mailOptions = {
      from: smtpSettings.fromName ? `"${smtpSettings.fromName}" <${smtpSettings.fromEmail}>` : smtpSettings.fromEmail,
      to: email,
      subject: 'Restly Otomatik Yedekleme - ' + new Date().toLocaleDateString('tr-TR'),
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #D4AF37;">Restly Restaurant - Otomatik Yedekleme</h2>

          <p>Merhaba,</p>

          <p>Sisteminizin otomatik yedeklemesi başarıyla oluşturuldu.</p>

          <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #333;">Yedekleme Detayları:</h3>
            <ul style="color: #666;">
              <li><strong>Tarih:</strong> ${new Date().toLocaleString('tr-TR')}</li>
              <li><strong>Aralık:</strong> ${interval || 24} saat</li>
              <li><strong>Dosya:</strong> ${backupFilename}</li>
              <li><strong>Boyut:</strong> ${Math.round(dataStr.length / 1024)} KB</li>
            </ul>
          </div>

          <div style="background: #e8f5e8; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #4CAF50;">
            <h4 style="margin-top: 0; color: #2E7D32;">Yedeklenen Veriler:</h4>
            <ul style="color: #388E3C; margin: 0;">
              <li>İletişim mesajları</li>
              <li>Rezervasyonlar</li>
              <li>Menü verileri</li>
              <li>Galeri resimleri</li>
              <li>Sistem ayarları</li>
            </ul>
          </div>

          <p style="color: #666; font-size: 14px;">
            Bu yedekleme dosyası ekte bulunmaktadır. Güvenli bir yerde saklayınız.
          </p>

          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">

          <p style="color: #999; font-size: 12px; text-align: center;">
            Bu e-posta Restly Restaurant sistemi tarafından otomatik olarak gönderilmiştir.
          </p>
        </div>
      `,
      attachments: [
        {
          filename: backupFilename,
          content: dataStr,
          contentType: 'application/json'
        }
      ]
    }


    await transporter.sendMail(mailOptions)

    return NextResponse.json({
      success: true,
      message: 'Otomatik yedekleme oluşturuldu ve e-posta gönderildi',
      timestamp: backupData.timestamp,
      fileSize: Math.round(dataStr.length / 1024) + ' KB'
    })

  } catch (error) {
    console.error('Otomatik yedekleme hatası:', error)
    return NextResponse.json(
      { error: 'Otomatik yedekleme başarısız oldu' },
      { status: 500 }
    )
  }
}


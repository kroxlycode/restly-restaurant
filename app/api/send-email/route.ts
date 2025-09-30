import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import fs from 'fs'
import path from 'path'

const smtpFilePath = path.join(process.cwd(), 'data', 'smtp.json')


const getSmtpSettings = () => {
  try {
    const fileContents = fs.readFileSync(smtpFilePath, 'utf8')
    return JSON.parse(fileContents)
  } catch (error) {
    console.error('SMTP ayarları okunamadı:', error)
    return null
  }
}


const createEmailTemplate = (reservation: any, message: string) => {
  const formattedDate = new Date(reservation.date).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })

  return `
    <!DOCTYPE html>
    <html lang="tr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Restly - Rezervasyon Bilgileri</title>
      <style>
        * {
          box-sizing: border-box;
        }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          margin: 0;
          padding: 20px;
          background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #2d2d2d 100%);
          background-attachment: fixed;
          color: #e5e5e5;
        }
        .email-wrapper {
          max-width: 600px;
          margin: 0 auto;
          background: #1a1a1a;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
          border: 1px solid #333;
        }
        .header {
          background: linear-gradient(135deg, #D4AF37 0%, #FFD700 50%, #D4AF37 100%);
          padding: 40px 30px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="2" fill="rgba(255,255,255,0.1)"/><circle cx="80" cy="40" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="40" cy="80" r="1.5" fill="rgba(255,255,255,0.1)"/></svg>');
          opacity: 0.3;
        }
        .header h1 {
          margin: 0;
          font-size: 32px;
          font-weight: bold;
          color: #1a1a1a;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
          position: relative;
          z-index: 1;
        }
        .header .subtitle {
          margin-top: 10px;
          font-size: 16px;
          color: #1a1a1a;
          opacity: 0.8;
          position: relative;
          z-index: 1;
        }
        .content {
          padding: 40px 30px;
        }
        .reservation-card {
          background: linear-gradient(135deg, #2d2d3a 0%, #252532 100%);
          border: 2px solid #D4AF37;
          border-radius: 15px;
          padding: 30px;
          margin-bottom: 30px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          position: relative;
        }
        .reservation-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #D4AF37 0%, #FFD700 50%, #D4AF37 100%);
        }
        .reservation-title {
          color: #D4AF37;
          font-size: 22px;
          font-weight: bold;
          margin-bottom: 25px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .reservation-title::after {
          content: '';
          flex: 1;
          height: 2px;
          background: linear-gradient(90deg, #D4AF37 0%, transparent 100%);
        }
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 25px;
        }
        .info-item {
          background: rgba(45, 45, 58, 0.8);
          padding: 15px;
          border-radius: 10px;
          border-left: 4px solid #D4AF37;
          transition: all 0.3s ease;
        }
        .info-item:hover {
          background: rgba(45, 45, 58, 1);
          transform: translateY(-2px);
        }
        .info-label {
          font-weight: bold;
          color: #D4AF37;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 5px;
        }
        .info-value {
          color: #e5e5e5;
          font-size: 16px;
          font-weight: 500;
        }
        .message-section {
          background: linear-gradient(135deg, #1e3a1e 0%, #2d4a2d 100%);
          border: 2px solid #4ade80;
          border-radius: 15px;
          padding: 25px;
          margin-top: 30px;
          position: relative;
        }
        .message-section::before {
          content: '💬';
          position: absolute;
          top: -10px;
          left: 20px;
          background: #1a1a1a;
          padding: 0 10px;
          font-size: 16px;
        }
        .message-title {
          color: #4ade80;
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 15px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .message-content {
          color: #e5e5e5;
          line-height: 1.7;
          white-space: pre-wrap;
          background: rgba(30, 58, 30, 0.5);
          padding: 15px;
          border-radius: 10px;
          border-left: 4px solid #4ade80;
        }
        .thank-you-section {
          background: linear-gradient(135deg, #2d2d3a 0%, #252532 100%);
          border: 2px solid #D4AF37;
          border-radius: 15px;
          padding: 25px;
          margin-top: 30px;
          text-align: center;
        }
        .thank-you-text {
          color: #e5e5e5;
          font-size: 18px;
          margin: 0;
          line-height: 1.6;
        }
        .highlight {
          color: #D4AF37;
          font-weight: bold;
          text-shadow: 0 0 10px rgba(212, 175, 55, 0.5);
        }
        .footer {
          background: linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%);
          color: #D4AF37;
          text-align: center;
          padding: 30px;
          border-top: 1px solid #333;
        }
        .footer p {
          margin: 0;
          font-size: 14px;
          opacity: 0.8;
        }
        .icon {
          display: inline-block;
          width: 20px;
          height: 20px;
          margin-right: 5px;
          vertical-align: middle;
        }
        @media (max-width: 600px) {
          body {
            padding: 10px;
          }
          .email-wrapper {
            margin: 0;
            border-radius: 15px;
          }
          .header, .content {
            padding: 25px 20px;
          }
          .info-grid {
            grid-template-columns: 1fr;
            gap: 15px;
          }
          .header h1 {
            font-size: 24px;
          }
        }
        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
          body {
            background: #0f0f0f;
          }
        }
      </style>
    </head>
    <body>
      <div class="email-wrapper">
        <div class="header">
          <h1>🍽️ Restly Restaurant</h1>
          <div class="subtitle">Premium Dining Experience</div>
        </div>

        <div class="content">
          <div class="reservation-card">
            <div class="reservation-title">
              📅 Rezervasyon Detayları
            </div>

            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">
                  <span class="icon">👤</span>
                  Müşteri Adı
                </div>
                <div class="info-value">${reservation.name}</div>
              </div>

              <div class="info-item">
                <div class="info-label">
                  <span class="icon">📧</span>
                  E-posta
                </div>
                <div class="info-value">${reservation.email}</div>
              </div>

              <div class="info-item">
                <div class="info-label">
                  <span class="icon">📅</span>
                  Rezervasyon Tarihi
                </div>
                <div class="info-value">${formattedDate} - ${reservation.time}</div>
              </div>

              <div class="info-item">
                <div class="info-label">
                  <span class="icon">👥</span>
                  Kişi Sayısı
                </div>
                <div class="info-value">${reservation.guests} kişi</div>
              </div>
            </div>

            ${reservation.specialRequests ? `
              <div class="info-item" style="grid-column: 1 / -1;">
                <div class="info-label">
                  <span class="icon">📝</span>
                  Özel İstekler
                </div>
                <div class="info-value" style="font-style: italic; color: #D4AF37;">
                  "${reservation.specialRequests}"
                </div>
              </div>
            ` : ''}
          </div>

          ${message ? `
            <div class="message-section">
              <div class="message-title">
                💬 Özel Mesaj
              </div>
              <div class="message-content">${message}</div>
            </div>
          ` : ''}

          <div class="thank-you-section">
            <p class="thank-you-text">
              Rezervasyonunuz için teşekkür ederiz!
              <br>
              <span class="highlight">Restly</span>'de sizi ağırlamayı sabırsızlıkla bekliyoruz.
            </p>
          </div>
        </div>

        <div class="footer">
          <p>&copy; 2025 Restly Restaurant. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </body>
    </html>
  `
}

export async function POST(request: NextRequest) {
  try {
    const { to, reservation, message } = await request.json()


    const smtpSettings = getSmtpSettings()
    if (!smtpSettings) {
      return NextResponse.json({ error: 'SMTP ayarları bulunamadı' }, { status: 500 })
    }


    const transporter = nodemailer.createTransport({
      host: smtpSettings.host,
      port: smtpSettings.port,
      secure: smtpSettings.secure,
      auth: {
        user: smtpSettings.user,
        pass: smtpSettings.pass,
      },
    })


    const mailOptions = {
      from: `"${smtpSettings.fromName}" <${smtpSettings.fromEmail}>`,
      to: to,
      subject: `Restly - ${reservation.name} Rezervasyon Bilgileri`,
      html: createEmailTemplate(reservation, message),
      text: `
Restly Restaurant - Rezervasyon Bilgileri

Müşteri: ${reservation.name}
E-posta: ${reservation.email}
Tarih: ${new Date(reservation.date).toLocaleDateString('tr-TR')} - ${reservation.time}
Kişi Sayısı: ${reservation.guests} kişi

${reservation.specialRequests ? `Özel İstekler: ${reservation.specialRequests}` : ''}

${message ? `Mesaj: ${message}` : ''}

Rezervasyonunuz için teşekkür ederiz!
      `.trim()
    }


    await transporter.sendMail(mailOptions)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('E-posta gönderme hatası:', error)
    return NextResponse.json({ error: 'E-posta gönderilemedi' }, { status: 500 })
  }
}


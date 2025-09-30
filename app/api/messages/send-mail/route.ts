import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import fs from 'fs'
import path from 'path'

const SMTP_CONFIG_PATH = path.join(process.cwd(), 'data', 'smtp.json')

export async function POST(request: NextRequest) {
  try {
    const { to, subject, message, replyTo } = await request.json()

    console.log('Mail gönderme isteği:', { to, subject, messageLength: message.length })


    if (!fs.existsSync(SMTP_CONFIG_PATH)) {
      console.error('SMTP config dosyası bulunamadı:', SMTP_CONFIG_PATH)
      return NextResponse.json(
        { success: false, message: 'SMTP ayarları bulunamadı' },
        { status: 500 }
      )
    }

    const smtpConfig = JSON.parse(fs.readFileSync(SMTP_CONFIG_PATH, 'utf8'))
    console.log('SMTP config yüklendi:', { host: smtpConfig.host, port: smtpConfig.port, user: smtpConfig.user })


    const transporter = nodemailer.createTransport({
      host: smtpConfig.host,
      port: smtpConfig.port,
      secure: smtpConfig.secure,
      auth: {
        user: smtpConfig.user,
        pass: smtpConfig.pass
      }
    })

    console.log('Transporter oluşturuldu')


    try {
      await transporter.verify()
      console.log('SMTP bağlantısı başarılı')
    } catch (verifyError) {
      console.error('SMTP bağlantı hatası:', verifyError)
      return NextResponse.json(
        { success: false, message: 'SMTP bağlantısı başarısız: ' + (verifyError as Error).message },
        { status: 500 }
      )
    }


    const htmlTemplate = `
      <!DOCTYPE html>
      <html lang="tr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Restly Restaurant - Yanıt</title>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            background-color: #f4f4f4;
          }
          .container {
            background-color: #ffffff;
            margin: 20px;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #D4AF37;
          }
          .logo {
            font-size: 28px;
            font-weight: bold;
            color: #8B0000;
            margin-bottom: 10px;
          }
          .subtitle {
            color: #666;
            font-size: 16px;
          }
          .content {
            margin: 20px 0;
            padding: 20px;
            background-color: #f9f9f9;
            border-radius: 5px;
            border-left: 4px solid #D4AF37;
          }
          .message {
            white-space: pre-wrap;
            font-size: 16px;
            line-height: 1.6;
          }
          .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            text-align: center;
            color: #666;
            font-size: 14px;
          }
          .contact-info {
            background-color: #f5f5dc;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
          }
          .contact-info h4 {
            margin: 0 0 10px 0;
            color: #8B0000;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">RESTLY</div>
            <div class="subtitle">Modern Gastronomi Deneyimi</div>
          </div>

          <div class="content">
            <div class="message">${message.replace(/\n/g, '<br>')}</div>
          </div>

          <div class="contact-info">
            <h4>İletişim Bilgilerimiz</h4>
            <p><strong>📧 E-posta:</strong> ${smtpConfig.fromEmail}</p>
            <p><strong>📞 Telefon:</strong> +90 (216) 555-0123</p>
            <p><strong>🏠 Adres:</strong> İstanbul, Türkiye</p>
          </div>

          <div class="footer">
            <p>Bu e-posta Restly Restaurant tarafından gönderilmiştir.</p>
            <p>© 2024 Restly Restaurant. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </body>
      </html>
    `


    const mailOptions = {
      from: `"${smtpConfig.fromName}" <${smtpConfig.fromEmail}>`,
      to: to,
      subject: subject,
      html: htmlTemplate,
      replyTo: replyTo || smtpConfig.fromEmail
    }

    console.log('Mail seçenekleri hazır:', { from: mailOptions.from, to: mailOptions.to, subject: mailOptions.subject })


    const info = await transporter.sendMail(mailOptions)
    console.log('Mail gönderildi:', info.messageId)

    return NextResponse.json({
      success: true,
      message: 'Mail başarıyla gönderildi',
      messageId: info.messageId
    })

  } catch (error) {
    console.error('Mail gönderme hatası:', error)
    return NextResponse.json(
      { success: false, message: 'Mail gönderilemedi: ' + (error as Error).message },
      { status: 500 }
    )
  }
}


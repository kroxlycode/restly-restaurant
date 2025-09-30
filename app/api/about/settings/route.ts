import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { v2 as cloudinary } from 'cloudinary'

const ABOUT_SETTINGS_FILE = path.join(process.cwd(), 'data', 'about-settings.json')


cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function GET() {
  try {
    if (!fs.existsSync(ABOUT_SETTINGS_FILE)) {

      return NextResponse.json({
        hero: {
          description: "2009 yılından beri lezzet yolculuğunda sizlerle birlikte"
        },
        story: {
          title: "Hikayemiz",
          paragraphs: [
            "Restly, 2009 yılında İstanbul'un kalbinde, lezzet tutkusu olan bir grup arkadaş tarafından kuruldu. Amacımız, modern gastronomi teknikleri ile geleneksel Türk mutfağının eşsiz lezzetlerini harmanlayarak, misafirlerimize unutulmaz bir deneyim sunmaktı.",
            "Yıllar içinde, kaliteli malzemeler, deneyimli şef kadromuz ve sıcak atmosferimizle İstanbul'un en sevilen restoranlarından biri haline geldik. Her tabakta bir sanat eseri yaratma vizyonumuz, bizi bugünkü konumumuza getirdi.",
            "Bugün, 15 yılı aşkın deneyimimizle, modern gastronomi dünyasında öncü konumumuzu sürdürürken, geleneksel değerlerimizi de korumaya devam ediyoruz."
          ]
        },
        mission: {
          title: "Misyonumuz",
          description: "Müşterilerimize sadece yemek değil, unutulmaz bir deneyim sunmak. Kaliteli malzemeler, yaratıcı sunumlar ve sıcak hizmet anlayışımızla her ziyareti özel kılmak misyonumuzun temelini oluşturuyor."
        },
        vision: {
          title: "Vizyonumuz",
          description: "Türkiye'nin gastronomi haritasında öncü konumumuzu güçlendirerek, uluslararası arenada Türk mutfağının modern yorumunu temsil eden bir marka olmak vizyonumuzun merkezinde yer alıyor."
        },
        stats: [
          {
            icon: "Award",
            number: "15+",
            label: "Yıl Deneyim"
          },
          {
            icon: "Users",
            number: "50K+",
            label: "Mutlu Müşteri"
          },
          {
            icon: "Clock",
            number: "24/7",
            label: "Rezervasyon"
          },
          {
            icon: "Heart",
            number: "100%",
            label: "Memnuniyet"
          }
        ],
        team: [],
        updatedAt: new Date().toISOString()
      })
    }

    const settings = JSON.parse(fs.readFileSync(ABOUT_SETTINGS_FILE, 'utf8'))
    return NextResponse.json(settings)
  } catch (error) {
    console.error('Hakkımızda ayarları alınamadı:', error)
    return NextResponse.json(
      { error: 'Ayarlar alınamadı' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const settings = await request.json()


    settings.updatedAt = new Date().toISOString()

    fs.writeFileSync(ABOUT_SETTINGS_FILE, JSON.stringify(settings, null, 2), 'utf8')

    return NextResponse.json({
      success: true,
      message: 'Hakkımızda ayarları başarıyla kaydedildi'
    })
  } catch (error) {
    console.error('Hakkımızda ayarları kaydedilemedi:', error)
    return NextResponse.json(
      { error: 'Ayarlar kaydedilemedi' },
      { status: 500 }
    )
  }
}


export async function PUT(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const memberId = formData.get('memberId') as string

    if (!file) {
      return NextResponse.json(
        { error: 'Dosya bulunamadı' },
        { status: 400 }
      )
    }


    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)


    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'restly-team',
          transformation: [
            { width: 400, height: 400, crop: 'fill', gravity: 'face' },
            { quality: 'auto' }
          ]
        },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      ).end(buffer)
    })


    const settings = JSON.parse(fs.readFileSync(ABOUT_SETTINGS_FILE, 'utf8'))


    const memberIndex = settings.team.findIndex((member: any) => member.id === memberId)
    if (memberIndex !== -1) {
      settings.team[memberIndex].image = (result as any).secure_url
      settings.updatedAt = new Date().toISOString()
      fs.writeFileSync(ABOUT_SETTINGS_FILE, JSON.stringify(settings, null, 2), 'utf8')
    }

    return NextResponse.json({
      success: true,
      imageUrl: (result as any).secure_url,
      message: 'Resim başarıyla yüklendi'
    })
  } catch (error) {
    console.error('Resim yükleme hatası:', error)
    return NextResponse.json(
      { error: 'Resim yüklenemedi' },
      { status: 500 }
    )
  }
}


import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

interface CerezData {
  title: string
  subtitle: string
  lastUpdated: string
  sections: Array<{
    title: string
    icon?: string
    content: string | string[]
    description?: string
  }>
  browserSettings: {
    chrome: string[]
    firefox: string[]
  }
  importantWarnings: string[]
  contact: {
    email: string
    phone: string
  }
}

const cerezlerFilePath = path.join(process.cwd(), 'data', 'cerezler.json')

const getCerezData = (): CerezData => {
  try {
    const fileContents = fs.readFileSync(cerezlerFilePath, 'utf8')
    return JSON.parse(fileContents)
  } catch (error) {
    console.error('Çerez politikası verisi yüklenemedi:', error)

    return {
      title: "Çerez Politikası",
      subtitle: "Web sitemizde kullanılan çerezler hakkında detaylı bilgilendirme",
      lastUpdated: "28.09.2025",
      sections: [
        {
          title: "Çerez Nedir?",
          content: "Çerezler, web sitelerinin kullanıcıların cihazlarında sakladığı küçük metin dosyalarıdır. Bu dosyalar, web sitesinin daha iyi çalışmasını sağlar ve kullanıcı deneyimini geliştirir. Restly olarak, size daha iyi hizmet verebilmek için çerezleri kullanıyoruz."
        },
        {
          icon: "Settings",
          title: "Zorunlu Çerezler",
          description: "Web sitesinin temel işlevlerini yerine getirmesi için gerekli çerezlerdir:",
          content: [
            "Oturum yönetimi çerezleri",
            "Güvenlik çerezleri",
            "Dil ve bölge tercihleri",
            "Rezervasyon formu bilgileri"
          ]
        },
        {
          icon: "BarChart",
          title: "Analitik Çerezler",
          description: "Web sitesi performansını ölçmek ve iyileştirmek için kullanılan çerezler:",
          content: [
            "Google Analytics çerezleri",
            "Sayfa görüntüleme istatistikleri",
            "Kullanıcı davranış analizi",
            "Site hızı ve performans ölçümü"
          ]
        },
        {
          icon: "Shield",
          title: "Çerez Yönetimi",
          description: "Çerez tercihlerinizi aşağıdaki yollarla yönetebilirsiniz:",
          content: [
            "Tarayıcı ayarlarından çerezleri devre dışı bırakabilirsiniz",
            "Mevcut çerezleri silebilirsiniz",
            "Çerez bildirimleri alabilirsiniz",
            "Üçüncü taraf çerezleri engelleyebilirsiniz"
          ]
        }
      ],
      browserSettings: {
        chrome: [
          "Ayarlar > Gizlilik ve güvenlik",
          "Site ayarları > Çerezler",
          "İstediğiniz seçeneği belirleyin"
        ],
        firefox: [
          "Ayarlar > Gizlilik ve Güvenlik",
          "Çerezler ve Site Verileri",
          "Tercihlerinizi ayarlayın"
        ]
      },
      importantWarnings: [
        "Zorunlu çerezleri devre dışı bırakırsanız site düzgün çalışmayabilir",
        "Analitik çerezler kişisel bilgi içermez, sadece istatistik amaçlıdır",
        "Çerez tercihleriniz cihazınızda saklanır",
        "Farklı cihazlarda ayrı ayrı ayarlama yapmanız gerekebilir"
      ],
      contact: {
        email: "info@restly.com",
        phone: "+90 212 123 45 67"
      }
    }
  }
}

const saveCerezData = (data: CerezData): boolean => {
  try {
    fs.writeFileSync(cerezlerFilePath, JSON.stringify(data, null, 2), 'utf8')
    return true
  } catch (error) {
    console.error('Çerez politikası verisi kaydedilemedi:', error)
    return false
  }
}

export async function GET() {
  try {
    const cerezData = getCerezData()
    return NextResponse.json(cerezData)
  } catch (error) {
    console.error('Çerez politikası verisi alınamadı:', error)
    return NextResponse.json(
      { error: 'Çerez politikası verisi alınamadı' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const newCerezData: CerezData = await request.json()

    // Validasyon
    if (!newCerezData.title || typeof newCerezData.title !== 'string') {
      return NextResponse.json(
        { error: 'Geçersiz veri: title alanı eksik veya yanlış format' },
        { status: 400 }
      )
    }

    if (!newCerezData.sections || !Array.isArray(newCerezData.sections)) {
      return NextResponse.json(
        { error: 'Geçersiz veri: sections alanı eksik veya yanlış format' },
        { status: 400 }
      )
    }

    if (!newCerezData.browserSettings || typeof newCerezData.browserSettings !== 'object') {
      return NextResponse.json(
        { error: 'Geçersiz veri: browserSettings alanı eksik veya yanlış format' },
        { status: 400 }
      )
    }

    if (!newCerezData.contact || typeof newCerezData.contact !== 'object') {
      return NextResponse.json(
        { error: 'Geçersiz veri: contact alanı eksik veya yanlış format' },
        { status: 400 }
      )
    }

    const success = saveCerezData(newCerezData)
    if (success) {
      return NextResponse.json({ message: 'Çerez politikası verisi başarıyla kaydedildi' })
    } else {
      return NextResponse.json(
        { error: 'Çerez politikası verisi kaydedilemedi' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Çerez politikası verisi kaydedilirken hata:', error)
    return NextResponse.json(
      { error: 'Çerez politikası verisi kaydedilirken hata oluştu' },
      { status: 500 }
    )
  }
}

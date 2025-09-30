import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

interface ElektronikData {
  title: string
  subtitle: string
  lastUpdated: string
  sections: Array<{
    title: string
    icon?: string
    content: string | string[]
    description?: string
  }>
  importantInfo: string[]
  contact: {
    phone: string
    email: string
  }
}

const elektronikFilePath = path.join(process.cwd(), 'data', 'elektronik.json')

const getElektronikData = (): ElektronikData => {
  try {
    const fileContents = fs.readFileSync(elektronikFilePath, 'utf8')
    return JSON.parse(fileContents)
  } catch (error) {
    console.error('Elektronik iletişim verisi yüklenemedi:', error)

    return {
      title: "Elektronik İletişim Politikası",
      subtitle: "SMS, e-posta ve diğer elektronik iletişim kanalları hakkında bilgilendirme",
      lastUpdated: "28.09.2025",
      sections: [
        {
          title: "Elektronik İletişim Hakkında",
          content: "5809 sayılı Elektronik Haberleşme Kanunu uyarınca, müşterilerimize SMS, e-posta ve diğer elektronik kanallar üzerinden pazarlama iletişimi yapabilmek için açık rızanızı almaktayız."
        },
        {
          icon: "MessageSquare",
          title: "İletişim Türleri",
          content: [
            "SMS ile kampanya ve özel teklif bildirimleri",
            "E-posta ile menü güncellemeleri ve etkinlik duyuruları",
            "Rezervasyon hatırlatmaları",
            "Doğum günü ve özel gün kutlamaları",
            "Yeni ürün ve hizmet tanıtımları"
          ]
        },
        {
          icon: "Shield",
          title: "İzin Alma Prosedürü",
          description: "Elektronik iletişim izninizi aşağıdaki yollarla alıyoruz:",
          content: [
            "Rezervasyon formunda açık rıza onay kutusu",
            "Web sitemizde newsletter kayıt formu",
            "Restoranda fiziksel form doldurma",
            "Telefon ile sözlü onay (kayıt altına alınır)"
          ]
        },
        {
          icon: "Phone",
          title: "Red Hakları",
          description: "Elektronik iletişim iznini istediğiniz zaman geri çekebilirsiniz:",
          content: [
            "SMS'lerde \"RED\" yazarak 3607'ye gönderebilirsiniz",
            "E-postalardaki \"Abonelikten Çık\" linkini kullanabilirsiniz",
            "+90 212 123 45 67 numaralı telefonu arayabilirsiniz",
            "info@restly.com adresine e-posta gönderebilirsiniz"
          ]
        }
      ],
      importantInfo: [
        "İzin verdiğiniz iletişim kanalları sadece pazarlama amaçlı kullanılır",
        "Rezervasyon onayları ve önemli bilgilendirmeler izin gerektirmez",
        "Kişisel verileriniz üçüncü kişilerle paylaşılmaz",
        "İletişim sıklığımız ayda maksimum 4 mesajdır"
      ],
      contact: {
        phone: "+90 212 123 45 67",
        email: "info@restly.com"
      }
    }
  }
}

const saveElektronikData = (data: ElektronikData): boolean => {
  try {
    fs.writeFileSync(elektronikFilePath, JSON.stringify(data, null, 2), 'utf8')
    return true
  } catch (error) {
    console.error('Elektronik iletişim verisi kaydedilemedi:', error)
    return false
  }
}

export async function GET() {
  try {
    const elektronikData = getElektronikData()
    return NextResponse.json(elektronikData)
  } catch (error) {
    console.error('Elektronik iletişim verisi alınamadı:', error)
    return NextResponse.json(
      { error: 'Elektronik iletişim verisi alınamadı' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const newElektronikData: ElektronikData = await request.json()

    // Validasyon
    if (!newElektronikData.title || typeof newElektronikData.title !== 'string') {
      return NextResponse.json(
        { error: 'Geçersiz veri: title alanı eksik veya yanlış format' },
        { status: 400 }
      )
    }

    if (!newElektronikData.sections || !Array.isArray(newElektronikData.sections)) {
      return NextResponse.json(
        { error: 'Geçersiz veri: sections alanı eksik veya yanlış format' },
        { status: 400 }
      )
    }

    if (!newElektronikData.contact || typeof newElektronikData.contact !== 'object') {
      return NextResponse.json(
        { error: 'Geçersiz veri: contact alanı eksik veya yanlış format' },
        { status: 400 }
      )
    }

    const success = saveElektronikData(newElektronikData)
    if (success) {
      return NextResponse.json({ message: 'Elektronik iletişim verisi başarıyla kaydedildi' })
    } else {
      return NextResponse.json(
        { error: 'Elektronik iletişim verisi kaydedilemedi' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Elektronik iletişim verisi kaydedilirken hata:', error)
    return NextResponse.json(
      { error: 'Elektronik iletişim verisi kaydedilirken hata oluştu' },
      { status: 500 }
    )
  }
}

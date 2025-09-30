import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

interface KVKKData {
  title: string
  subtitle: string
  lastUpdated: string
  sections: Array<{
    icon: string
    title: string
    content: string
  }>
  introduction: string
  rights: {
    basicRights: string[]
    requestRights: string[]
  }
  contact: {
    phone: string
    email: string
  }
}

const kvkkFilePath = path.join(process.cwd(), 'data', 'kvkk.json')

const getKVKKData = (): KVKKData => {
  try {
    const fileContents = fs.readFileSync(kvkkFilePath, 'utf8')
    return JSON.parse(fileContents)
  } catch (error) {
    console.error('KVKK verisi yüklenemedi:', error)

    return {
      title: "KVKK Politikası",
      subtitle: "Kişisel Verilerin Korunması Kanunu kapsamında bilgilendirme metni",
      lastUpdated: "28.09.2025",
      sections: [
        {
          icon: "User",
          title: "Veri Sorumlusu",
          content: "Restly Restaurant\nAdres: Nişantaşı Mah. Teşvikiye Cad. No:123 Şişli/İstanbul\nTelefon: +90 212 123 45 67\nE-posta: kvkk@restly.com"
        },
        {
          icon: "FileText",
          title: "İşlenen Kişisel Veriler",
          content: "• Kimlik Bilgileri: Ad, soyad, telefon numarası, e-posta adresi\n• İletişim Bilgileri: Adres, telefon, e-posta\n• Müşteri İşlem Bilgileri: Rezervasyon geçmişi, tercihler\n• Pazarlama Bilgileri: İletişim tercihleri, kampanya katılımları"
        },
        {
          icon: "Lock",
          title: "İşleme Amaçları",
          content: "• Rezervasyon hizmetlerinin sunulması\n• Müşteri hizmetlerinin yürütülmesi\n• Yasal yükümlülüklerin yerine getirilmesi\n• Pazarlama ve tanıtım faaliyetleri (izin dahilinde)\n• İstatistiksel analiz ve raporlama"
        },
        {
          icon: "Eye",
          title: "Veri Aktarımı",
          content: "Kişisel verileriniz, hizmet kalitesinin artırılması amacıyla:\n• Rezervasyon sistemleri sağlayıcıları\n• Ödeme hizmetleri sağlayıcıları\n• Yasal yükümlülükler çerçevesinde kamu kurumları\nile paylaşılabilir."
        }
      ],
      introduction: "6698 sayılı Kişisel Verilerin Korunması Kanunu (\"KVKK\") uyarınca, kişisel verilerinizin işlenmesi hakkında sizleri bilgilendirmek isteriz. Bu aydınlatma metni, kişisel verilerinizin hangi amaçlarla işlendiği, kimlere aktarıldığı, işleme yöntemleri ve haklarınız hakkında bilgi vermektedir.",
      rights: {
        basicRights: [
          "Kişisel verilerinin işlenip işlenmediğini öğrenme",
          "İşlenen kişisel verileri hakkında bilgi talep etme",
          "İşleme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme",
          "Yurt içinde veya yurt dışında kişisel verilerin aktarıldığı üçüncü kişileri bilme"
        ],
        requestRights: [
          "Kişisel verilerin eksik veya yanlış işlenmiş olması halinde bunların düzeltilmesini isteme",
          "Kanunda öngörülen şartlar çerçevesinde kişisel verilerin silinmesini isteme",
          "Düzeltme ve silme taleplerinin aktarıldığı üçüncü kişilere bildirilmesini isteme",
          "İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi sonucu aleyhte bir sonucun ortaya çıkmasına itiraz etme"
        ]
      },
      contact: {
        phone: "+90 212 123 45 67",
        email: "kvkk@restly.com"
      }
    }
  }
}

const saveKVKKData = (data: KVKKData): boolean => {
  try {
    fs.writeFileSync(kvkkFilePath, JSON.stringify(data, null, 2), 'utf8')
    return true
  } catch (error) {
    console.error('KVKK verisi kaydedilemedi:', error)
    return false
  }
}

export async function GET() {
  try {
    const kvkkData = getKVKKData()
    return NextResponse.json(kvkkData)
  } catch (error) {
    console.error('KVKK verisi alınamadı:', error)
    return NextResponse.json(
      { error: 'KVKK verisi alınamadı' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const newKVKKData: KVKKData = await request.json()

    // Validasyon
    if (!newKVKKData.title || typeof newKVKKData.title !== 'string') {
      return NextResponse.json(
        { error: 'Geçersiz veri: title alanı eksik veya yanlış format' },
        { status: 400 }
      )
    }

    if (!newKVKKData.sections || !Array.isArray(newKVKKData.sections)) {
      return NextResponse.json(
        { error: 'Geçersiz veri: sections alanı eksik veya yanlış format' },
        { status: 400 }
      )
    }

    if (!newKVKKData.rights || typeof newKVKKData.rights !== 'object') {
      return NextResponse.json(
        { error: 'Geçersiz veri: rights alanı eksik veya yanlış format' },
        { status: 400 }
      )
    }

    if (!newKVKKData.contact || typeof newKVKKData.contact !== 'object') {
      return NextResponse.json(
        { error: 'Geçersiz veri: contact alanı eksik veya yanlış format' },
        { status: 400 }
      )
    }

    const success = saveKVKKData(newKVKKData)
    if (success) {
      return NextResponse.json({ message: 'KVKK verisi başarıyla kaydedildi' })
    } else {
      return NextResponse.json(
        { error: 'KVKK verisi kaydedilemedi' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('KVKK verisi kaydedilirken hata:', error)
    return NextResponse.json(
      { error: 'KVKK verisi kaydedilirken hata oluştu' },
      { status: 500 }
    )
  }
}

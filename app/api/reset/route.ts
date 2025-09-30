import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const dataDir = path.join(process.cwd(), 'data')


const defaultData = {
  messages: [],
  reservations: [],
  menu: { categories: [], items: [] },
  gallery: [],
  contact: {
    location: "İstanbul, Türkiye",
    phone: "+90 555 555 55 55",
    email: "info@restly.com",
    googleMapsUrl: "https://maps.google.com"
  },
  times: {
    weekdays: { open: "11:00", close: "23:00", isOpen: true },
    saturday: { open: "12:00", close: "24:00", isOpen: true },
    sunday: { open: "12:00", close: "22:00", isOpen: true }
  },
  seo: {
    siteTitle: "Restly Restaurant - Modern Gastronomi Deneyimi",
    metaTitle: "Restly Restaurant | İstanbul'un En İyi Restoranı",
    metaDescription: "Modern gastronomi ile geleneksel lezzetleri buluşturan Restly Restaurant'ta unutulmaz bir yemek deneyimi yaşayın. İstanbul'un kalbinde kaliteli hizmet.",
    footerDescription: "Modern gastronomi ile geleneksel lezzetleri buluşturan eşsiz restoran deneyimi. Kaliteli malzemeler, yaratıcı sunumlar ve sıcak hizmet anlayışımızla her ziyareti özel kılıyoruz.",
    faviconUrl: "/favicon.svg",
    socialLinks: {
      facebook: "https://facebook.com/restlyrestaurant",
      instagram: "https://instagram.com/restlyrestaurant",
      twitter: "https://twitter.com/restlyrestaurant",
      linkedin: "https://linkedin.com/company/restlyrestaurant"
    }
  },
  smtp: {
    host: "",
    port: 587,
    secure: false,
    user: "",
    pass: "",
    fromName: "",
    fromEmail: ""
  },
  "online-siparis-ayarlar": {
    yemeksepeti: { active: false, url: "" },
    getir: { active: false, url: "" },
    trendyol: { active: false, url: "" },
    tıklaGelsin: { active: false, url: "" }
  },
  "about-settings": {
    title: "Hakkımızda",
    description: "Restly Restaurant olarak modern gastronomi ile geleneksel lezzetleri buluşturuyoruz.",
    mission: "Müşterilerimize en kaliteli hizmeti sunmak",
    vision: "İstanbul'un en sevilen restoranı olmak",
    team: [],
    statistics: {
      years: 5,
      customers: 50000,
      dishes: 150,
      awards: 12
    }
  }
}


function resetSystem() {
  try {

    const files = [
      'messages.json',
      'reservations.json',
      'menu.json',
      'gallery.json',
      'contact.json',
      'times.json',
      'seo.json',
      'smtp.json',
      'online-siparis-ayarlar.json',
      'about-settings.json'
    ]

    for (const file of files) {
      const filePath = path.join(dataDir, file)
      const fileKey = file.replace('.json', '').replace('-', '') as keyof typeof defaultData


      const key = file.includes('about') ? 'about' : fileKey

      if (defaultData[key as keyof typeof defaultData]) {
        fs.writeFileSync(filePath, JSON.stringify(defaultData[key as keyof typeof defaultData], null, 2), 'utf8')
      }
    }

    return { success: true, message: 'Sistem başarıyla sıfırlandı' }
  } catch (error) {
    console.error('Sistem sıfırlama hatası:', error)
    throw new Error('Sistem sıfırlama işlemi başarısız oldu')
  }
}

export async function POST(request: NextRequest) {
  try {

    const result = resetSystem()

    return NextResponse.json(result)
  } catch (error) {
    console.error('Reset API hatası:', error)
    return NextResponse.json(
      { error: 'Sistem sıfırlama işlemi başarısız oldu' },
      { status: 500 }
    )
  }
}


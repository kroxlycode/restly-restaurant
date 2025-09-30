import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

interface SeoSettings {
  siteTitle: string
  metaTitle: string
  metaDescription: string
  footerDescription: string
  faviconUrl: string
  socialLinks: {
    facebook: string
    instagram: string
    twitter: string
    linkedin: string
  }
}

const seoFilePath = path.join(process.cwd(), 'data', 'seo.json')


const getSeoData = (): SeoSettings => {
  try {
    const fileContents = fs.readFileSync(seoFilePath, 'utf8')
    return JSON.parse(fileContents)
  } catch (error) {
    console.error('SEO verileri okunamadı:', error)

    return {
      siteTitle: 'Restly Restaurant - Modern Gastronomi Deneyimi',
      metaTitle: 'Restly Restaurant | İstanbul\'un En İyi Restoranı',
      metaDescription: 'Modern gastronomi ile geleneksel lezzetleri buluşturan Restly Restaurant\'ta unutulmaz bir yemek deneyimi yaşayın. İstanbul\'un kalbinde kaliteli hizmet.',
      footerDescription: 'Modern gastronomi ile geleneksel lezzetleri buluşturan eşsiz restoran deneyimi. Kaliteli malzemeler, yaratıcı sunumlar ve sıcak hizmet anlayışımızla her ziyareti özel kılıyoruz.',
      faviconUrl: 'https://res.cloudinary.com/dfjiurtgd/image/upload/v1759135246/restly-favicon/favicon.png',
      socialLinks: {
        facebook: 'https://facebook.com/restlyrestaurant',
        instagram: 'https://instagram.com/restlyrestaurant',
        twitter: 'https://twitter.com/restlyrestaurant',
        linkedin: 'https://linkedin.com/company/restlyrestaurant'
      }
    }
  }
}


const saveSeoData = (data: SeoSettings): boolean => {
  try {
    fs.writeFileSync(seoFilePath, JSON.stringify(data, null, 2), 'utf8')
    return true
  } catch (error) {
    console.error('SEO verileri kaydedilemedi:', error)
    return false
  }
}

export async function GET() {
  try {
    const seoData = getSeoData()
    return NextResponse.json(seoData)
  } catch (error) {
    console.error('SEO verileri alınırken hata:', error)
    return NextResponse.json(
      { error: 'SEO verileri alınamadı' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const newSeoData: SeoSettings = await request.json()


    const requiredFields = ['siteTitle', 'metaTitle', 'metaDescription', 'footerDescription', 'faviconUrl', 'socialLinks']
    const requiredSocialFields = ['facebook', 'instagram', 'twitter', 'linkedin']

    for (const field of requiredFields) {
      if (!newSeoData[field as keyof SeoSettings]) {
        return NextResponse.json(
          { error: `Geçersiz veri: ${field} bölümü eksik` },
          { status: 400 }
        )
      }
    }


    for (const socialField of requiredSocialFields) {
      if (!newSeoData.socialLinks[socialField as keyof typeof newSeoData.socialLinks]) {
        return NextResponse.json(
          { error: `Geçersiz veri: socialLinks.${socialField} eksik` },
          { status: 400 }
        )
      }
    }


    if (newSeoData.metaTitle.length > 60) {
      return NextResponse.json(
        { error: 'Meta başlık 60 karakterden uzun olamaz' },
        { status: 400 }
      )
    }

    if (newSeoData.metaDescription.length > 160) {
      return NextResponse.json(
        { error: 'Meta açıklama 160 karakterden uzun olamaz' },
        { status: 400 }
      )
    }

    const success = saveSeoData(newSeoData)
    if (success) {
      return NextResponse.json({ message: 'SEO ayarları başarıyla kaydedildi' })
    } else {
      return NextResponse.json(
        { error: 'SEO ayarları kaydedilemedi' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('SEO ayarları kaydedilirken hata:', error)
    return NextResponse.json(
      { error: 'SEO ayarları kaydedilirken hata oluştu' },
      { status: 500 }
    )
  }
}


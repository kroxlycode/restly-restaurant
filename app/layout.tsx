import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import StructuredData from '@/components/StructuredData'
import { AuthProvider } from '@/contexts/AuthContext'
import ConditionalLayout from '@/components/ConditionalLayout'
import fs from 'fs'
import path from 'path'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
})


const getSeoSettings = () => {
  try {
    const seoPath = path.join(process.cwd(), 'data', 'seo.json')
    const seoData = JSON.parse(fs.readFileSync(seoPath, 'utf8'))
    return seoData
  } catch (error) {
    console.error('SEO ayarları okunamadı:', error)
    return {
      siteTitle: 'Restly Restaurant - Modern Gastronomi Deneyimi',
      metaTitle: 'Restly Restaurant | İstanbul\'un En İyi Restoranı',
      metaDescription: 'Modern gastronomi ile geleneksel lezzetleri buluşturan Restly Restaurant\'ta unutulmaz bir yemek deneyimi yaşayın. İstanbul\'un kalbinde kaliteli hizmet.',
      faviconUrl: '/favicon.svg'
    }
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const seoSettings = getSeoSettings()

  return {
    title: seoSettings.metaTitle,
    description: seoSettings.metaDescription,
    keywords: 'restoran, yemek, gastronomi, rezervasyon, İstanbul, lezzet, modern mutfak',
    authors: [{ name: seoSettings.siteTitle }],
    icons: {
      icon: seoSettings.faviconUrl || '/favicon.svg',
    },
    openGraph: {
      title: seoSettings.metaTitle,
      description: seoSettings.metaDescription,
      type: 'website',
      locale: 'tr_TR',
      siteName: seoSettings.siteTitle,
    },
    twitter: {
      card: 'summary_large_image',
      title: seoSettings.metaTitle,
      description: seoSettings.metaDescription,
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <StructuredData />
      </head>
      <body className="min-h-screen">
        <AuthProvider>
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
        </AuthProvider>
      </body>
    </html>
  )
}


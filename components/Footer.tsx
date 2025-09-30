import Link from 'next/link'
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Twitter } from 'lucide-react'
import { useState, useEffect } from 'react'

interface ContactData {
  location: string
  phone: string
  email: string
  googleMapsUrl: string
}

interface DaySchedule {
  open: string
  close: string
  isOpen: boolean
}

interface TimesData {
  weekdays: DaySchedule
  saturday: DaySchedule
  sunday: DaySchedule
}

interface SeoData {
  siteTitle: string
  metaTitle: string
  metaDescription: string
  footerDescription: string
  socialLinks: {
    facebook: string
    instagram: string
    twitter: string
    linkedin: string
  }
}

export default function Footer() {
  const [timesData, setTimesData] = useState<TimesData | null>(null)
  const [contactData, setContactData] = useState<ContactData | null>(null)
  const [seoData, setSeoData] = useState<SeoData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTimesData()
    fetchContactData()
    fetchSeoData()
  }, [])


  const footerDescription = loading
    ? 'Modern gastronomi ile geleneksel lezzetleri buluşturan eşsiz restoran deneyimi.'
    : (seoData?.footerDescription || 'Modern gastronomi ile geleneksel lezzetleri buluşturan eşsiz restoran deneyimi.')

  const socialLinks = loading
    ? { facebook: '#', instagram: '#', twitter: '#' }
    : {
        facebook: seoData?.socialLinks?.facebook || '#',
        instagram: seoData?.socialLinks?.instagram || '#',
        twitter: seoData?.socialLinks?.twitter || '#'
      }

  const fetchTimesData = async () => {
    try {
      const response = await fetch('/api/times')
      if (response.ok) {
        const data = await response.json()
        setTimesData(data)
      }
    } catch (error) {
      console.error('Çalışma saatleri yüklenemedi:', error)
    }
  }

  const fetchContactData = async () => {
    try {
      const response = await fetch('/api/contact')
      if (response.ok) {
        const data = await response.json()
        setContactData(data)
      }
    } catch (error) {
      console.error('İletişim bilgileri yüklenemedi:', error)
    }
  }

  const fetchSeoData = async () => {
    try {
      const response = await fetch('/api/seo')
      if (response.ok) {
        const data = await response.json()
        setSeoData(data)
      }
    } catch (error) {
      console.error('SEO bilgileri yüklenemedi:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (time: string) => {
    return time.replace(':00', '')
  }

  const getWorkingHoursText = () => {
    if (loading || !timesData) {
      return {
        summary: 'H.İçi: 11-23 | H.Sonu: 12-24',
        details: 'Hafta İçi: 11:00 - 23:00\nCumartesi: 12:00 - 01:00\nPazar: 12:00 - 22:00'
      }
    }


    const weekdayHours = timesData.weekdays.isOpen ?
      `${formatTime(timesData.weekdays.open)}-${formatTime(timesData.weekdays.close)}` : 'Kapalı'


    const saturdayHours = timesData.saturday.isOpen ?
      `${formatTime(timesData.saturday.open)}-${formatTime(timesData.saturday.close)}` : 'Kapalı'
    const sundayHours = timesData.sunday.isOpen ?
      `${formatTime(timesData.sunday.open)}-${formatTime(timesData.sunday.close)}` : 'Kapalı'


    const weekendsSame = timesData.saturday.isOpen && timesData.sunday.isOpen &&
                        timesData.saturday.open === timesData.sunday.open &&
                        timesData.saturday.close === timesData.sunday.close

    const weekendSummary = weekendsSame ? saturdayHours : 'Değişken'


    const allSame = timesData.weekdays.isOpen &&
                    timesData.saturday.isOpen &&
                    timesData.sunday.isOpen &&
                    timesData.weekdays.open === timesData.saturday.open &&
                    timesData.weekdays.close === timesData.saturday.close &&
                    timesData.saturday.open === timesData.sunday.open &&
                    timesData.saturday.close === timesData.sunday.close

    const summary = allSame ?
      `H.İçi: ${weekdayHours} | H.Sonu: ${weekendSummary}` :
      `H.İçi: ${weekdayHours} | H.Sonu: ${weekendSummary}`

    const details = `Hafta İçi: ${timesData.weekdays.isOpen ? `${formatTime(timesData.weekdays.open)} - ${formatTime(timesData.weekdays.close)}` : 'Kapalı'}
Cumartesi: ${timesData.saturday.isOpen ? `${formatTime(timesData.saturday.open)} - ${formatTime(timesData.saturday.close)}` : 'Kapalı'}
Pazar: ${timesData.sunday.isOpen ? `${formatTime(timesData.sunday.open)} - ${formatTime(timesData.sunday.close)}` : 'Kapalı'}`

    return { summary, details }
  }

  const workingHours = getWorkingHoursText()
  return (
    <footer className="bg-primary-secondary border-t border-gray-800">
      <div className="container-max section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          <div className="space-y-4">
            <Link href="/" className="text-2xl font-serif font-bold text-gradient">
              Restly
            </Link>
            <p className="text-text-secondary leading-relaxed">
              {footerDescription}
            </p>
            <div className="flex space-x-4">
              <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-accent-gold transition-colors duration-300">
                <Facebook size={20} />
              </a>
              <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-accent-gold transition-colors duration-300">
                <Instagram size={20} />
              </a>
              <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-accent-gold transition-colors duration-300">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          
          <div className="space-y-4">
            <h3 className="text-lg font-serif font-semibold text-accent-gold">Hızlı Linkler</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-text-secondary hover:text-accent-gold transition-colors duration-300">Ana Sayfa</Link></li>
              <li><Link href="/hakkimizda" className="text-text-secondary hover:text-accent-gold transition-colors duration-300">Hakkımızda</Link></li>
              <li><Link href="/menu" className="text-text-secondary hover:text-accent-gold transition-colors duration-300">Menü</Link></li>
              <li><Link href="/galeri" className="text-text-secondary hover:text-accent-gold transition-colors duration-300">Galeri</Link></li>
              <li><Link href="/rezervasyon" className="text-text-secondary hover:text-accent-gold transition-colors duration-300">Rezervasyon</Link></li>
            </ul>
          </div>

          
          <div className="space-y-4">
            <h3 className="text-lg font-serif font-semibold text-accent-gold">İletişim</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin size={18} className="text-accent-gold mt-1 flex-shrink-0" />
                <span className="text-text-secondary">
                  {loading ? 'Konum yükleniyor...' : contactData?.location || 'Konum bilgisi bulunamadı'}
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={18} className="text-accent-gold flex-shrink-0" />
                <span className="text-text-secondary">
                  {loading ? 'Telefon yükleniyor...' : contactData?.phone || '+90 555 555 55 55'}
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={18} className="text-accent-gold flex-shrink-0" />
                <span className="text-text-secondary">
                  {loading ? 'E-posta yükleniyor...' : contactData?.email || 'info@restly.com'}
                </span>
              </li>
            </ul>
          </div>

          
          <div className="space-y-4">
            <h3 className="text-lg font-serif font-semibold text-accent-gold">Çalışma Saatleri</h3>
            <ul className="space-y-2">
              <li className="flex items-start space-x-3">
                <Clock size={18} className="text-accent-gold mt-1 flex-shrink-0" />
                <div className="text-text-secondary">
                  <div className="font-medium">Hafta İçi / Hafta Sonu</div>
                  <div>{workingHours.summary}</div>
                  <div className="text-sm mt-1 whitespace-pre-line">{workingHours.details}</div>
                </div>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-text-secondary text-sm">
              dev by kroxly © 2025 {seoData?.siteTitle}. Tüm hakları saklıdır.
            </p>
            <div className="flex space-x-6 text-sm">
              <Link href="/kvkk" className="text-text-secondary hover:text-accent-gold transition-colors duration-300">
                KVKK Politikası
              </Link>
              <Link href="/cerez-politikasi" className="text-text-secondary hover:text-accent-gold transition-colors duration-300">
                Çerez Politikası
              </Link>
              <Link href="/elektronik-iletisim" className="text-text-secondary hover:text-accent-gold transition-colors duration-300">
                Elektronik İletişim
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}



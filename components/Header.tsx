'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Phone, Settings } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

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

const navigation = [
  { name: 'Ana Sayfa', href: '/' },
  { name: 'Hakkımızda', href: '/hakkimizda' },
  { name: 'Menü', href: '/menu' },
  { name: 'Galeri', href: '/galeri' },
  { name: 'Online Sipariş', href: '/online-siparis' },
  { name: 'İletişim', href: '/iletisim' },
]

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [seoSettings, setSeoSettings] = useState<SeoSettings | null>(null)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (mounted) {
      const fetchSeoSettings = async () => {
        try {
          const response = await fetch('/api/seo')
          if (response.ok) {
            const data = await response.json()
            setSeoSettings(data)
          }
        } catch (error) {
          console.error('SEO ayarları yüklenemedi:', error)
        }
      }

      fetchSeoSettings()
    }
  }, [mounted])


  const siteTitle = mounted && seoSettings?.siteTitle
    ? seoSettings.siteTitle.split(' - ')[0]
    : 'Restly'

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? 'glass-effect shadow-lg' : 'bg-transparent'
    }`}>
      <nav className="container-max section-padding py-4">
        <div className="flex items-center justify-between">
          
          <Link
            href="/"
            className="text-2xl font-serif font-bold text-gradient hover:scale-105 transition-transform duration-300"
          >
            {siteTitle}
          </Link>

          
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`relative font-medium transition-colors duration-300 hover:text-accent-gold ${
                  pathname === item.href ? 'text-accent-gold' : 'text-text-primary'
                }`}
              >
                {item.name}
                {pathname === item.href && (
                  <motion.div
                    layoutId="underline"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-accent-gold"
                  />
                )}
              </Link>
            ))}
          </div>

          
          <div className="flex items-center space-x-4">
            <Link
              href="/rezervasyon"
              className="hidden sm:flex items-center space-x-2 btn-primary"
            >
              <Phone size={18} />
              <span>Rezervasyon</span>
            </Link>

            
            <Link
              href="/admin/login"
              className="hidden md:flex items-center space-x-2 p-2 text-text-secondary hover:text-accent-gold transition-colors duration-300"
              title="Admin Paneli"
            >
              <Settings size={18} />
            </Link>

            
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-text-primary hover:text-accent-gold transition-colors duration-300"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden mt-4 overflow-hidden"
            >
              <div className="glass-effect rounded-lg p-4 space-y-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`block py-2 font-medium transition-colors duration-300 hover:text-accent-gold ${
                      pathname === item.href ? 'text-accent-gold' : 'text-text-primary'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
                <Link
                  href="/rezervasyon"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center space-x-2 btn-primary w-full mt-4"
                >
                  <Phone size={18} />
                  <span>Rezervasyon Yap</span>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  )
}



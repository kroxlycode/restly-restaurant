'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Home, 
  ArrowLeft, 
  Search, 
  MapPin, 
  Phone, 
  Mail,
  ChefHat,
  Utensils
} from 'lucide-react'

export default function NotFound() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-primary-bg flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-accent-gold/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-accent-gold/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-accent-gold/5 to-transparent rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8"
          >
            <h1 className="text-8xl md:text-9xl font-bold text-gradient mb-4 leading-none">
              404
            </h1>
            <div className="flex items-center justify-center space-x-4 mb-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <ChefHat size={32} className="text-accent-gold" />
              </motion.div>
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              >
                <Utensils size={32} className="text-accent-gold" />
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-8"
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-text-primary mb-4">
              Sayfa Bulunamadı
            </h2>
            <p className="text-lg text-text-secondary mb-6 leading-relaxed">
              Aradığınız sayfa mevcut değil veya taşınmış olabilir. 
              <br className="hidden md:block" />
              Lezzetli menümüze göz atmak ister misiniz?
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <Link
              href="/"
              className="btn-primary flex items-center justify-center space-x-2 px-8 py-3"
            >
              <Home size={20} />
              <span>Ana Sayfaya Dön</span>
            </Link>

            <Link
              href="/menu"
              className="btn-secondary flex items-center justify-center space-x-2 px-8 py-3"
            >
              <Utensils size={20} />
              <span>Menüyü İncele</span>
            </Link>

            <button
              onClick={() => window.history.back()}
              className="bg-primary-card hover:bg-primary-secondary text-text-primary border border-gray-600 hover:border-accent-gold px-8 py-3 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <ArrowLeft size={20} />
              <span>Geri Dön</span>
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <Link
              href="/hakkimizda"
              className="group bg-primary-card hover:bg-primary-secondary border border-gray-700 hover:border-accent-gold rounded-xl p-6 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-accent-gold/20 rounded-lg flex items-center justify-center mb-4 mx-auto group-hover:bg-accent-gold/30 transition-colors duration-300">
                <Search size={24} className="text-accent-gold" />
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">Hakkımızda</h3>
              <p className="text-text-secondary text-sm">Restly&apos;nin hikayesini keşfedin</p>
            </Link>

            <Link
              href="/galeri"
              className="group bg-primary-card hover:bg-primary-secondary border border-gray-700 hover:border-accent-gold rounded-xl p-6 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-accent-gold/20 rounded-lg flex items-center justify-center mb-4 mx-auto group-hover:bg-accent-gold/30 transition-colors duration-300">
                <MapPin size={24} className="text-accent-gold" />
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">Galeri</h3>
              <p className="text-text-secondary text-sm">Lezzetli anlarımızı görün</p>
            </Link>

            <Link
              href="/iletisim"
              className="group bg-primary-card hover:bg-primary-secondary border border-gray-700 hover:border-accent-gold rounded-xl p-6 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-accent-gold/20 rounded-lg flex items-center justify-center mb-4 mx-auto group-hover:bg-accent-gold/30 transition-colors duration-300">
                <Mail size={24} className="text-accent-gold" />
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">İletişim</h3>
              <p className="text-text-secondary text-sm">Bizimle iletişime geçin</p>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="mt-12 pt-8 border-t border-gray-700"
          >
            <p className="text-text-secondary text-sm mb-4">
              Yardıma mı ihtiyacınız var? Bizimle iletişime geçin:
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm">
              <a
                href="tel:+902121234567"
                className="flex items-center space-x-2 text-text-secondary hover:text-accent-gold transition-colors duration-300"
              >
                <Phone size={16} />
                <span>+90 (212) 123 45 67</span>
              </a>
              <a
                href="mailto:info@restly.com"
                className="flex items-center space-x-2 text-text-secondary hover:text-accent-gold transition-colors duration-300"
              >
                <Mail size={16} />
                <span>info@restly.com</span>
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        animate={{ 
          y: [0, -20, 0],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ 
          duration: 6, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="absolute top-20 right-20 hidden lg:block"
      >
        <div className="w-16 h-16 bg-gradient-to-br from-accent-gold/20 to-accent-gold/10 rounded-full flex items-center justify-center">
          <ChefHat size={24} className="text-accent-gold" />
        </div>
      </motion.div>

      <motion.div
        animate={{ 
          y: [0, 15, 0],
          rotate: [0, -3, 3, 0]
        }}
        transition={{ 
          duration: 8, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay: 2
        }}
        className="absolute bottom-32 left-20 hidden lg:block"
      >
        <div className="w-12 h-12 bg-gradient-to-br from-accent-gold/15 to-accent-gold/5 rounded-full flex items-center justify-center">
          <Utensils size={20} className="text-accent-gold" />
        </div>
      </motion.div>
    </div>
  )
}

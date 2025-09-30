'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import {
  ShoppingBag,
  Clock,
  Star,
  MapPin,
  Truck,
  ExternalLink
} from 'lucide-react'

interface OnlineOrderSettings {
  [key: string]: {
    name: string
    active: boolean
    link: string
  }
}

export default function OnlineSiparisPage() {
  const [settings, setSettings] = useState<OnlineOrderSettings>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/online-siparis')
      if (response.ok) {
        const data = await response.json()
        setSettings(data)
      }
    } catch (error) {
      console.error('Online sipariş ayarları yüklenemedi:', error)
    } finally {
      setLoading(false)
    }
  }

  const getCompanyLogo = (companyKey: string) => {
    const logos: { [key: string]: string } = {
      yemeksepeti: '/assets/yemeksepeti.avif',
      getir: '/assets/getir.png',
      trendyolgoyemek: '/assets/trendyolgo.ico',
      tiklagelsin: '/assets/tiklagelsin.avif'
    }
    return logos[companyKey] || '🍴'
  }

  const activeCompanies = Object.entries(settings).filter(([_, company]) => company.active)

  if (loading) {
    return (
      <div className="min-h-screen bg-primary-bg flex items-center justify-center">
        <div className="text-accent-gold text-xl">Yükleniyor...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-primary-bg">
      
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-bg via-primary-secondary to-primary-card opacity-50"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-accent-gold/20 to-yellow-500/20 px-6 py-3 rounded-full border border-accent-gold/30 mb-6">
              <ShoppingBag className="text-accent-gold" size={24} />
              <span className="text-accent-gold font-medium">Online Sipariş</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-serif font-bold text-text-primary mb-6">
              Kapınıza Kadar
              <span className="block text-accent-gold">Lezzet Getiriyoruz</span>
            </h1>

            <p className="text-xl text-text-secondary mb-8 leading-relaxed">
              Restly&apos;nin eşsiz lezzetlerini artık evinizin konforunda tadabilirsiniz.
              Güvenilir partnerlerimiz aracılığıyla hızlı ve güvenli teslimat.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="flex items-center space-x-3 text-text-secondary">
                <div className="w-12 h-12 bg-accent-gold/20 rounded-full flex items-center justify-center">
                  <Clock size={20} className="text-accent-gold" />
                </div>
                <div>
                  <div className="font-semibold text-text-primary">Hızlı Teslimat</div>
                  <div className="text-sm">30-45 dakika</div>
                </div>
              </div>

              <div className="flex items-center space-x-3 text-text-secondary">
                <div className="w-12 h-12 bg-accent-gold/20 rounded-full flex items-center justify-center">
                  <Star size={20} className="text-accent-gold" />
                </div>
                <div>
                  <div className="font-semibold text-text-primary">Kaliteli Hizmet</div>
                  <div className="text-sm">5 yıldız deneyim</div>
                </div>
              </div>

              <div className="flex items-center space-x-3 text-text-secondary">
                <div className="w-12 h-12 bg-accent-gold/20 rounded-full flex items-center justify-center">
                  <MapPin size={20} className="text-accent-gold" />
                </div>
                <div>
                  <div className="font-semibold text-text-primary">Geniş Alan</div>
                  <div className="text-sm">Şehir geneli</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-text-primary mb-4">
              Sipariş Platformları
            </h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              Tercih ettiğiniz platform üzerinden kolayca sipariş verebilirsiniz
            </p>
          </motion.div>

          {activeCompanies.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <ShoppingBag size={64} className="mx-auto text-text-secondary mb-4" />
              <h3 className="text-xl font-semibold text-text-primary mb-2">
                Henüz Aktif Platform Yok
              </h3>
              <p className="text-text-secondary">
                Online sipariş platformları yakında aktif olacak
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {activeCompanies.map(([key, company], index) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <div className="card hover:scale-105 transition-all duration-300 text-center p-8">
                    
                    <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center group-hover:shadow-xl transition-all duration-300 p-2`}>
                      <Image
                        src={getCompanyLogo(key)}
                        alt={company.name}
                        width={80}
                        height={80}
                        className="w-full h-full object-contain rounded-xl"
                      />
                    </div>

                    
                    <h3 className="text-xl font-bold text-text-primary mb-4">
                      {company.name}
                    </h3>

                    
                    <div className="space-y-3">
                      {company.link ? (
                        <a
                          href={company.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-primary w-full flex items-center justify-center space-x-2"
                        >
                          <ExternalLink size={18} />
                          <span>Sipariş Ver</span>
                        </a>
                      ) : (
                        <div className="text-text-secondary text-sm">
                          Yakında aktif olacak
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      
      <section className="py-20 bg-primary-secondary">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="inline-flex items-center space-x-3 bg-accent-gold/20 px-6 py-3 rounded-full border border-accent-gold/30 mb-8">
              <Truck className="text-accent-gold" size={24} />
              <span className="text-accent-gold font-medium">Teslimat Bilgileri</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-serif font-bold text-text-primary mb-8">
              Güvenli ve Hızlı Teslimat
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-text-primary">Teslimat Saatleri</h3>
                <div className="space-y-2 text-text-secondary">
                  <div className="flex justify-between">
                    <span>Pazartesi - Pazar:</span>
                    <span className="text-text-primary font-medium">11:00 - 23:00</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold text-text-primary">Minimum Sipariş</h3>
                <div className="space-y-2 text-text-secondary">
                  <div className="flex justify-between">
                    <span>Minimum tutar:</span>
                    <span className="text-text-primary font-medium">50 TL</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Teslimat ücreti:</span>
                    <span className="text-text-primary font-medium">Platform&apos;a göre değişir</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 p-6 bg-primary-card rounded-xl border border-accent-gold/20">
              <p className="text-text-secondary leading-relaxed">
                <strong className="text-accent-gold">Not:</strong> Sipariş vermek için yukarıdaki platformlardan birini seçin.
                Her platform kendi teslimat ücretleri ve minimum sipariş tutarlarına sahiptir.
                Detaylı bilgi için ilgili platformu ziyaret edebilirsiniz.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}


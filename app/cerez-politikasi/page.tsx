'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Cookie, Settings, BarChart, Shield } from 'lucide-react'

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

const iconMap: { [key: string]: any } = {
  Settings,
  BarChart,
  Shield
}

export default function CerezPolitikasiPage() {
  const [cerezData, setCerezData] = useState<CerezData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCerezData()
  }, [])

  const fetchCerezData = async () => {
    try {
      const response = await fetch('/api/cerezler')
      if (response.ok) {
        const data = await response.json()
        setCerezData(data)
      }
    } catch (error) {
      console.error('Çerez verisi yüklenemedi:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-20">
        <section className="section-padding bg-gradient-to-r from-primary-bg to-primary-secondary">
          <div className="container-max text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-20 h-20 bg-gradient-to-br from-accent-gold to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Cookie size={40} className="text-primary-bg animate-pulse" />
              </div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-gradient mb-4">
                Yükleniyor...
              </h1>
            </motion.div>
          </div>
        </section>
      </div>
    )
  }

  if (!cerezData) {
    return (
      <div className="min-h-screen pt-20">
        <section className="section-padding bg-gradient-to-r from-primary-bg to-primary-secondary">
          <div className="container-max text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-20 h-20 bg-gradient-to-br from-accent-gold to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Cookie size={40} className="text-primary-bg" />
              </div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-gradient mb-4">
                Veri Yüklenemedi
              </h1>
              <p className="text-text-secondary text-lg">
                Çerez politikası verileri şu anda yüklenemiyor.
              </p>
            </motion.div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20">

      <section className="section-padding bg-gradient-to-r from-primary-bg to-primary-secondary">
        <div className="container-max text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-20 h-20 bg-gradient-to-br from-accent-gold to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Cookie size={40} className="text-primary-bg" />
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-gradient mb-4">
              {cerezData.title}
            </h1>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              {cerezData.subtitle}
            </p>
          </motion.div>
        </div>
      </section>


      <section className="section-padding bg-primary-bg">
        <div className="container-max max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            {cerezData.sections.map((section, index) => {
              const IconComponent = section.icon ? iconMap[section.icon] : Settings
              const isContentArray = Array.isArray(section.content)

              return (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * (index + 1) }}
                  className="card"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-accent-gold to-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <IconComponent size={24} className="text-primary-bg" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-serif font-semibold text-text-primary mb-3">
                        {section.title}
                      </h3>

                      {section.description && (
                        <p className="text-text-secondary leading-relaxed mb-3">
                          {section.description}
                        </p>
                      )}

                      {isContentArray ? (
                        <ul className="text-text-secondary space-y-2">
                          {(section.content as string[]).map((item: string, itemIndex: number) => (
                            <li key={itemIndex}>• {item}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-text-secondary leading-relaxed">
                          {section.content}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="card"
              >
                <h4 className="font-semibold text-accent-gold mb-3">Chrome Tarayıcısı</h4>
                <ol className="text-text-secondary text-sm space-y-1">
                  {cerezData.browserSettings.chrome.map((step, index) => (
                    <li key={index}>{index + 1}. {step}</li>
                  ))}
                </ol>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="card"
              >
                <h4 className="font-semibold text-accent-gold mb-3">Firefox Tarayıcısı</h4>
                <ol className="text-text-secondary text-sm space-y-1">
                  {cerezData.browserSettings.firefox.map((step, index) => (
                    <li key={index}>{index + 1}. {step}</li>
                  ))}
                </ol>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="card bg-primary-secondary border border-accent-gold/30"
            >
              <h3 className="text-xl font-serif font-semibold text-accent-gold mb-4">
                Önemli Uyarılar
              </h3>
              <div className="space-y-3 text-text-secondary">
                {cerezData.importantWarnings.map((warning, index) => (
                  <p key={index}>• {warning}</p>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="card"
            >
              <h3 className="text-xl font-serif font-semibold text-text-primary mb-4">
                İletişim
              </h3>
              <p className="text-text-secondary leading-relaxed">
                Çerez politikamız hakkında sorularınız için bizimle iletişime geçebilirsiniz:
              </p>
              <div className="mt-4 space-y-2 text-text-secondary">
                <p>📧 E-posta: {cerezData.contact.email}</p>
                <p>📞 Telefon: {cerezData.contact.phone}</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="text-center mt-8 p-4 bg-primary-secondary rounded-lg border border-gray-700"
            >
              <p className="text-text-secondary text-sm">
                Bu çerez politikası son güncelleme tarihi: <strong>{cerezData.lastUpdated}</strong>
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}


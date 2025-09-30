'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Mail, MessageSquare, Phone, Shield } from 'lucide-react'

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

const iconMap: { [key: string]: any } = {
  MessageSquare,
  Shield,
  Phone
}

export default function ElektronikIletisimPage() {
  const [elektronikData, setElektronikData] = useState<ElektronikData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchElektronikData()
  }, [])

  const fetchElektronikData = async () => {
    try {
      const response = await fetch('/api/elektronik')
      if (response.ok) {
        const data = await response.json()
        setElektronikData(data)
      }
    } catch (error) {
      console.error('Elektronik iletişim verisi yüklenemedi:', error)
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
                <Mail size={40} className="text-primary-bg animate-pulse" />
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

  if (!elektronikData) {
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
                <Mail size={40} className="text-primary-bg" />
              </div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-gradient mb-4">
                Veri Yüklenemedi
              </h1>
              <p className="text-text-secondary text-lg">
                Elektronik iletişim verileri şu anda yüklenemiyor.
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
              <Mail size={40} className="text-primary-bg" />
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-gradient mb-4">
              {elektronikData.title}
            </h1>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              {elektronikData.subtitle}
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
            {elektronikData.sections.map((section, index) => {
              const IconComponent = section.icon ? iconMap[section.icon] : MessageSquare
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
                        <p className="text-text-secondary leading-relaxed mb-4">
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

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="card bg-primary-secondary border border-accent-gold/30"
            >
              <h3 className="text-xl font-serif font-semibold text-accent-gold mb-4">
                Önemli Bilgiler
              </h3>
              <div className="space-y-3 text-text-secondary">
                {elektronikData.importantInfo.map((info, index) => (
                  <p key={index}>• {info}</p>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="text-center mt-8 p-4 bg-primary-secondary rounded-lg border border-gray-700"
            >
              <p className="text-text-secondary text-sm">
                Bu politika son güncelleme tarihi: <strong>{elektronikData.lastUpdated}</strong>
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}


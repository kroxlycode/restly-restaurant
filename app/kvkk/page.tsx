'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Shield, User, Lock, Eye, FileText, Phone } from 'lucide-react'

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

const iconMap: { [key: string]: any } = {
  User,
  FileText,
  Lock,
  Eye
}

export default function KVKKPage() {
  const [kvkkData, setKvkkData] = useState<KVKKData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchKVKKData()
  }, [])

  const fetchKVKKData = async () => {
    try {
      const response = await fetch('/api/kvkk')
      if (response.ok) {
        const data = await response.json()
        setKvkkData(data)
      }
    } catch (error) {
      console.error('KVKK verisi yüklenemedi:', error)
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
                <Shield size={40} className="text-primary-bg animate-pulse" />
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

  if (!kvkkData) {
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
                <Shield size={40} className="text-primary-bg" />
              </div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-gradient mb-4">
                Veri Yüklenemedi
              </h1>
              <p className="text-text-secondary text-lg">
                KVKK verileri şu anda yüklenemiyor.
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
              <Shield size={40} className="text-primary-bg" />
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-gradient mb-4">
              {kvkkData.title}
            </h1>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              {kvkkData.subtitle}
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
            className="card mb-8"
          >
            <h2 className="text-2xl font-serif font-bold text-text-primary mb-4">
              Aydınlatma Metni
            </h2>
            <p className="text-text-secondary leading-relaxed">
              {kvkkData.introduction}
            </p>
          </motion.div>

          <div className="space-y-8">
            {kvkkData.sections.map((section, index) => {
              const IconComponent = iconMap[section.icon] || User

              return (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * (index + 3) }}
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
                      <div className="text-text-secondary leading-relaxed whitespace-pre-line">
                        {section.content}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>


          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="card mt-8"
          >
            <h3 className="text-2xl font-serif font-bold text-text-primary mb-6">
              Kişisel Veri Sahibinin Hakları
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-accent-gold">Temel Haklarınız:</h4>
                <ul className="text-text-secondary space-y-2 text-sm">
                  {kvkkData.rights.basicRights.map((right, index) => (
                    <li key={index}>• {right}</li>
                  ))}
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-accent-gold">Talep Haklarınız:</h4>
                <ul className="text-text-secondary space-y-2 text-sm">
                  {kvkkData.rights.requestRights.map((right, index) => (
                    <li key={index}>• {right}</li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>


          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="card mt-8"
          >
            <h3 className="text-2xl font-serif font-bold text-text-primary mb-6">
              Başvuru Yolları
            </h3>
            <div className="space-y-4">
              <p className="text-text-secondary leading-relaxed">
                KVKK kapsamındaki haklarınızı kullanmak için aşağıdaki iletişim kanallarından bizimle iletişime geçebilirsiniz:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-3">
                  <Phone size={20} className="text-accent-gold" />
                  <div>
                    <div className="font-medium text-text-primary">Telefon</div>
                    <div className="text-text-secondary">{kvkkData.contact.phone}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <FileText size={20} className="text-accent-gold" />
                  <div>
                    <div className="font-medium text-text-primary">E-posta</div>
                    <div className="text-text-secondary">{kvkkData.contact.email}</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>


          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="text-center mt-8 p-4 bg-primary-secondary rounded-lg border border-gray-700"
          >
            <p className="text-text-secondary text-sm">
              Bu aydınlatma metni son güncelleme tarihi: <strong>{kvkkData.lastUpdated}</strong>
              <br />
              Değişiklikler web sitemizde yayınlanarak yürürlüğe girer.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}


'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Cookie, Settings } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import AdminLayout from '@/components/AdminLayout'

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

export default function AdminCerezPage() {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const [cerezData, setCerezData] = useState<CerezData>({
    title: '',
    subtitle: '',
    lastUpdated: '',
    sections: [],
    browserSettings: {
      chrome: [],
      firefox: []
    },
    importantWarnings: [],
    contact: {
      email: '',
      phone: ''
    }
  })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/admin/login')
    }
  }, [isAuthenticated, loading, router])

  useEffect(() => {
    if (isAuthenticated) {
      fetchCerezData()
    }
  }, [isAuthenticated])

  const fetchCerezData = async () => {
    try {
      const response = await fetch('/api/cerezler')
      if (response.ok) {
        const data = await response.json()
        setCerezData(data)
      }
    } catch (error) {
      console.error('Çerez politikası verisi yüklenemedi:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch('/api/cerezler', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cerezData),
      })

      if (response.ok) {
        setMessage({ type: 'success', text: 'Çerez politikası başarıyla kaydedildi' })
        setTimeout(() => setMessage(null), 3000)
      } else {
        throw new Error('Veri kaydedilemedi')
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Çerez politikası kaydedilirken hata oluştu' })
    } finally {
      setSaving(false)
    }
  }

  const updateSection = (index: number, field: keyof typeof cerezData.sections[0], value: string | string[]) => {
    setCerezData(prev => ({
      ...prev,
      sections: prev.sections.map((section, i) =>
        i === index ? { ...section, [field]: value } : section
      )
    }))
  }

  const updateSectionContent = (sectionIndex: number, contentIndex: number, value: string) => {
    setCerezData(prev => ({
      ...prev,
      sections: prev.sections.map((section, i) =>
        i === sectionIndex && Array.isArray(section.content)
          ? {
              ...section,
              content: section.content.map((item, j) => j === contentIndex ? value : item)
            }
          : section
      )
    }))
  }

  const updateBrowserSetting = (browser: 'chrome' | 'firefox', index: number, value: string) => {
    setCerezData(prev => ({
      ...prev,
      browserSettings: {
        ...prev.browserSettings,
        [browser]: prev.browserSettings[browser].map((setting, i) => i === index ? value : setting)
      }
    }))
  }

  const updateImportantWarning = (index: number, value: string) => {
    setCerezData(prev => ({
      ...prev,
      importantWarnings: prev.importantWarnings.map((warning, i) => i === index ? value : warning)
    }))
  }

  const updateContact = (field: keyof typeof cerezData.contact, value: string) => {
    setCerezData(prev => ({
      ...prev,
      contact: {
        ...prev.contact,
        [field]: value
      }
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-primary-bg flex items-center justify-center">
        <div className="text-accent-gold">Yükleniyor...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-primary-card to-primary-secondary p-6 rounded-xl border border-gray-700 shadow-lg">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-accent-gold to-yellow-500 rounded-lg flex items-center justify-center">
              <Cookie size={24} className="text-primary-bg" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-serif font-bold text-text-primary mb-1">
                Çerez Politikası Düzenleme
              </h1>
              <p className="text-text-secondary text-sm">
                Web sitesindeki çerezler hakkında bilgilendirme metnini düzenleyin
              </p>
            </div>
          </div>
        </div>

        {message && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`p-4 rounded-lg border ${message.type === 'success'
              ? 'bg-green-500/10 border-green-500/30'
              : 'bg-red-500/10 border-red-500/30'
              }`}
          >
            <div className="flex items-center space-x-2">
              {message.type === 'success' ? (
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              ) : (
                <div className="w-5 h-5 bg-red-500 rounded-full"></div>
              )}
              <span className={
                message.type === 'success' ? 'text-green-500' : 'text-red-500'
              }>
                {message.text}
              </span>
            </div>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Ana Bilgiler */}
          <div className="bg-primary-card p-6 rounded-xl border border-gray-700">
            <h2 className="text-xl font-serif font-semibold text-text-primary mb-4">Ana Bilgiler</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Başlık
                </label>
                <input
                  type="text"
                  value={cerezData.title}
                  onChange={(e) => setCerezData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full bg-primary-bg border border-gray-600 rounded-lg px-4 py-2 text-text-primary focus:border-accent-gold focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Alt Başlık
                </label>
                <input
                  type="text"
                  value={cerezData.subtitle}
                  onChange={(e) => setCerezData(prev => ({ ...prev, subtitle: e.target.value }))}
                  className="w-full bg-primary-bg border border-gray-600 rounded-lg px-4 py-2 text-text-primary focus:border-accent-gold focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Son Güncelleme Tarihi
                </label>
                <input
                  type="text"
                  value={cerezData.lastUpdated}
                  onChange={(e) => setCerezData(prev => ({ ...prev, lastUpdated: e.target.value }))}
                  className="w-full bg-primary-bg border border-gray-600 rounded-lg px-4 py-2 text-text-primary focus:border-accent-gold focus:outline-none"
                  placeholder="28.09.2025"
                />
              </div>
            </div>
          </div>

          {/* Bölümler */}
          <div className="bg-primary-card p-6 rounded-xl border border-gray-700">
            <h2 className="text-xl font-serif font-semibold text-text-primary mb-4">Bölümler</h2>
            <div className="space-y-6">
              {cerezData.sections.map((section, sectionIndex) => (
                <div key={sectionIndex} className="border border-gray-600 rounded-lg p-4">
                  <div className="grid grid-cols-1 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">
                        Başlık
                      </label>
                      <input
                        type="text"
                        value={section.title}
                        onChange={(e) => updateSection(sectionIndex, 'title', e.target.value)}
                        className="w-full bg-primary-bg border border-gray-600 rounded-lg px-4 py-2 text-text-primary focus:border-accent-gold focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  {section.description && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-text-secondary mb-2">
                        Açıklama
                      </label>
                      <textarea
                        value={section.description}
                        onChange={(e) => updateSection(sectionIndex, 'description', e.target.value)}
                        rows={3}
                        className="w-full bg-primary-bg border border-gray-600 rounded-lg px-4 py-2 text-text-primary focus:border-accent-gold focus:outline-none"
                      />
                    </div>
                  )}

                  {Array.isArray(section.content) ? (
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">
                        Liste Öğeleri
                      </label>
                      {section.content.map((item, contentIndex) => (
                        <div key={contentIndex} className="mb-2">
                          <input
                            type="text"
                            value={item}
                            onChange={(e) => updateSectionContent(sectionIndex, contentIndex, e.target.value)}
                            className="w-full bg-primary-bg border border-gray-600 rounded-lg px-4 py-2 text-text-primary focus:border-accent-gold focus:outline-none"
                            required
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">
                        İçerik
                      </label>
                      <textarea
                        value={section.content}
                        onChange={(e) => updateSection(sectionIndex, 'content', e.target.value)}
                        rows={4}
                        className="w-full bg-primary-bg border border-gray-600 rounded-lg px-4 py-2 text-text-primary focus:border-accent-gold focus:outline-none"
                        required
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Tarayıcı Ayarları */}
          <div className="bg-primary-card p-6 rounded-xl border border-gray-700">
            <h2 className="text-xl font-serif font-semibold text-text-primary mb-4">Tarayıcı Ayarları</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-text-primary mb-3">Chrome</h3>
                {cerezData.browserSettings.chrome.map((setting, index) => (
                  <div key={index} className="mb-2">
                    <input
                      type="text"
                      value={setting}
                      onChange={(e) => updateBrowserSetting('chrome', index, e.target.value)}
                      className="w-full bg-primary-bg border border-gray-600 rounded-lg px-4 py-2 text-text-primary focus:border-accent-gold focus:outline-none"
                      required
                    />
                  </div>
                ))}
              </div>
              <div>
                <h3 className="text-lg font-medium text-text-primary mb-3">Firefox</h3>
                {cerezData.browserSettings.firefox.map((setting, index) => (
                  <div key={index} className="mb-2">
                    <input
                      type="text"
                      value={setting}
                      onChange={(e) => updateBrowserSetting('firefox', index, e.target.value)}
                      className="w-full bg-primary-bg border border-gray-600 rounded-lg px-4 py-2 text-text-primary focus:border-accent-gold focus:outline-none"
                      required
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Önemli Uyarılar */}
          <div className="bg-primary-card p-6 rounded-xl border border-gray-700">
            <h2 className="text-xl font-serif font-semibold text-text-primary mb-4">Önemli Uyarılar</h2>
            <div className="space-y-3">
              {cerezData.importantWarnings.map((warning, index) => (
                <input
                  key={index}
                  type="text"
                  value={warning}
                  onChange={(e) => updateImportantWarning(index, e.target.value)}
                  className="w-full bg-primary-bg border border-gray-600 rounded-lg px-4 py-2 text-text-primary focus:border-accent-gold focus:outline-none"
                  required
                />
              ))}
            </div>
          </div>

          {/* İletişim */}
          <div className="bg-primary-card p-6 rounded-xl border border-gray-700">
            <h2 className="text-xl font-serif font-semibold text-text-primary mb-4">İletişim Bilgileri</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  E-posta
                </label>
                <input
                  type="email"
                  value={cerezData.contact.email}
                  onChange={(e) => updateContact('email', e.target.value)}
                  className="w-full bg-primary-bg border border-gray-600 rounded-lg px-4 py-2 text-text-primary focus:border-accent-gold focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Telefon
                </label>
                <input
                  type="text"
                  value={cerezData.contact.phone}
                  onChange={(e) => updateContact('phone', e.target.value)}
                  className="w-full bg-primary-bg border border-gray-600 rounded-lg px-4 py-2 text-text-primary focus:border-accent-gold focus:outline-none"
                  required
                />
              </div>
            </div>
          </div>

          {/* Kaydet Butonu */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="bg-accent-gold hover:bg-yellow-500 disabled:bg-yellow-500/50 text-primary-bg px-8 py-3 rounded-lg transition-colors duration-300 flex items-center space-x-2 font-medium"
            >
              {saving ? (
                <>
                  <div className="w-5 h-5 border-2 border-primary-bg border-t-transparent rounded-full animate-spin"></div>
                  <span>Kaydediliyor...</span>
                </>
              ) : (
                <>
                  <Cookie size={20} />
                  <span>Kaydet</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}

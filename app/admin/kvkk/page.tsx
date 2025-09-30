'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { FileText, Shield } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import AdminLayout from '@/components/AdminLayout'

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

export default function AdminKVKKPage() {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const [kvkkData, setKvkkData] = useState<KVKKData>({
    title: '',
    subtitle: '',
    lastUpdated: '',
    sections: [],
    introduction: '',
    rights: {
      basicRights: [],
      requestRights: []
    },
    contact: {
      phone: '',
      email: ''
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
      fetchKVKKData()
    }
  }, [isAuthenticated])

  const fetchKVKKData = async () => {
    try {
      const response = await fetch('/api/kvkk')
      if (response.ok) {
        const data = await response.json()
        setKvkkData(data)
      }
    } catch (error) {
      console.error('KVKK verisi yüklenemedi:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch('/api/kvkk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(kvkkData),
      })

      if (response.ok) {
        setMessage({ type: 'success', text: 'KVKK politikası başarıyla kaydedildi' })
        setTimeout(() => setMessage(null), 3000)
      } else {
        throw new Error('Veri kaydedilemedi')
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'KVKK politikası kaydedilirken hata oluştu' })
    } finally {
      setSaving(false)
    }
  }

  const updateSection = (index: number, field: keyof typeof kvkkData.sections[0], value: string) => {
    setKvkkData(prev => ({
      ...prev,
      sections: prev.sections.map((section, i) =>
        i === index ? { ...section, [field]: value } : section
      )
    }))
  }

  const updateRights = (type: 'basicRights' | 'requestRights', index: number, value: string) => {
    setKvkkData(prev => ({
      ...prev,
      rights: {
        ...prev.rights,
        [type]: prev.rights[type].map((right, i) => i === index ? value : right)
      }
    }))
  }

  const updateContact = (field: keyof typeof kvkkData.contact, value: string) => {
    setKvkkData(prev => ({
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
              <FileText size={24} className="text-primary-bg" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-serif font-bold text-text-primary mb-1">
                KVKK Politikası Düzenleme
              </h1>
              <p className="text-text-secondary text-sm">
                Kişisel verilerin korunması politikası içeriğini düzenleyin
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
                  value={kvkkData.title}
                  onChange={(e) => setKvkkData(prev => ({ ...prev, title: e.target.value }))}
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
                  value={kvkkData.subtitle}
                  onChange={(e) => setKvkkData(prev => ({ ...prev, subtitle: e.target.value }))}
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
                  value={kvkkData.lastUpdated}
                  onChange={(e) => setKvkkData(prev => ({ ...prev, lastUpdated: e.target.value }))}
                  className="w-full bg-primary-bg border border-gray-600 rounded-lg px-4 py-2 text-text-primary focus:border-accent-gold focus:outline-none"
                  placeholder="28.09.2025"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Giriş Metni
              </label>
              <textarea
                value={kvkkData.introduction}
                onChange={(e) => setKvkkData(prev => ({ ...prev, introduction: e.target.value }))}
                rows={4}
                className="w-full bg-primary-bg border border-gray-600 rounded-lg px-4 py-2 text-text-primary focus:border-accent-gold focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Bölümler */}
          <div className="bg-primary-card p-6 rounded-xl border border-gray-700">
            <h2 className="text-xl font-serif font-semibold text-text-primary mb-4">Bölümler</h2>
            <div className="space-y-6">
              {kvkkData.sections.map((section, index) => (
                <div key={index} className="border border-gray-600 rounded-lg p-4">
                  <div className="grid grid-cols-1 gap-4 mb-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-text-secondary mb-2">
                        Başlık
                      </label>
                      <input
                        type="text"
                        value={section.title}
                        onChange={(e) => updateSection(index, 'title', e.target.value)}
                        className="w-full bg-primary-bg border border-gray-600 rounded-lg px-4 py-2 text-text-primary focus:border-accent-gold focus:outline-none"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      İçerik
                    </label>
                    <textarea
                      value={section.content}
                      onChange={(e) => updateSection(index, 'content', e.target.value)}
                      rows={6}
                      className="w-full bg-primary-bg border border-gray-600 rounded-lg px-4 py-2 text-text-primary focus:border-accent-gold focus:outline-none"
                      required
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Haklar */}
          <div className="bg-primary-card p-6 rounded-xl border border-gray-700">
            <h2 className="text-xl font-serif font-semibold text-text-primary mb-4">Kişisel Veri Sahibinin Hakları</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-text-primary mb-3">Temel Haklar</h3>
                {kvkkData.rights.basicRights.map((right, index) => (
                  <div key={index} className="mb-3">
                    <input
                      type="text"
                      value={right}
                      onChange={(e) => updateRights('basicRights', index, e.target.value)}
                      className="w-full bg-primary-bg border border-gray-600 rounded-lg px-4 py-2 text-text-primary focus:border-accent-gold focus:outline-none"
                      required
                    />
                  </div>
                ))}
              </div>

              <div>
                <h3 className="text-lg font-medium text-text-primary mb-3">Talep Hakları</h3>
                {kvkkData.rights.requestRights.map((right, index) => (
                  <div key={index} className="mb-3">
                    <input
                      type="text"
                      value={right}
                      onChange={(e) => updateRights('requestRights', index, e.target.value)}
                      className="w-full bg-primary-bg border border-gray-600 rounded-lg px-4 py-2 text-text-primary focus:border-accent-gold focus:outline-none"
                      required
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* İletişim */}
          <div className="bg-primary-card p-6 rounded-xl border border-gray-700">
            <h2 className="text-xl font-serif font-semibold text-text-primary mb-4">İletişim Bilgileri</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Telefon
                </label>
                <input
                  type="text"
                  value={kvkkData.contact.phone}
                  onChange={(e) => updateContact('phone', e.target.value)}
                  className="w-full bg-primary-bg border border-gray-600 rounded-lg px-4 py-2 text-text-primary focus:border-accent-gold focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  E-posta
                </label>
                <input
                  type="email"
                  value={kvkkData.contact.email}
                  onChange={(e) => updateContact('email', e.target.value)}
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
                  <Shield size={20} />
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

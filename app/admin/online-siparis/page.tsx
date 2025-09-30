'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Settings,
  ShoppingBag,
  Save,
  ExternalLink,
  Phone,
  ToggleLeft,
  ToggleRight,
  AlertCircle
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import AdminLayout from '@/components/AdminLayout'

interface OnlineOrderSettings {
  [key: string]: {
    name: string
    active: boolean
    link: string
  }
}

export default function AdminOnlineSiparisPage() {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const [settings, setSettings] = useState<OnlineOrderSettings>({})
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/admin/login')
    }
  }, [isAuthenticated, loading, router])

  useEffect(() => {
    if (isAuthenticated) {
      fetchSettings()
    }
  }, [isAuthenticated])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/online-siparis')
      if (response.ok) {
        const data = await response.json()
        setSettings(data)
      }
    } catch (error) {
      console.error('Online sipariş ayarları yüklenemedi:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch('/api/online-siparis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      })

      if (response.ok) {
        setMessage({ type: 'success', text: 'Online sipariş ayarları başarıyla kaydedildi' })
        setTimeout(() => setMessage(null), 3000)
      } else {
        throw new Error('Ayarlar kaydedilemedi')
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Ayarlar kaydedilirken hata oluştu' })
      setTimeout(() => setMessage(null), 3000)
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (companyKey: string, field: string, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      [companyKey]: {
        ...prev[companyKey],
        [field]: value
      }
    }))
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
              <ShoppingBag size={24} className="text-primary-bg" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-serif font-bold text-text-primary mb-1">
                Online Sipariş Ayarları
              </h1>
              <p className="text-text-secondary text-sm">
                Sipariş platformlarını yönetin ve ayarlarını düzenleyin
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
                <AlertCircle size={20} className="text-red-500" />
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Object.entries(settings).map(([companyKey, company]) => (
              <motion.div
                key={companyKey}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-primary-card to-primary-secondary rounded-xl p-6 shadow-lg border border-gray-700"
              >
                
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg p-1` }>
                      <img
                        src={getCompanyLogo(companyKey)}
                        alt={company.name}
                        className="w-full h-full object-contain rounded-lg"
                        onError={(e) => {
                          const target = e.currentTarget as HTMLImageElement
                          const fallback = target.nextElementSibling as HTMLDivElement
                          target.style.display = 'none'
                          if (fallback) fallback.style.display = 'block'
                        }}
                      />
                      <div className="text-xl hidden">🍴</div>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-text-primary">
                        {company.name}
                      </h3>
                      <p className="text-text-secondary text-sm">
                        Platform ayarları
                      </p>
                    </div>
                  </div>

                  
                  <button
                    type="button"
                    onClick={() => handleInputChange(companyKey, 'active', !company.active)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-300 ${
                      company.active
                        ? 'bg-green-500/20 text-green-500'
                        : 'bg-gray-500/20 text-gray-500'
                    }`}
                  >
                    {company.active ? (
                      <ToggleRight size={20} />
                    ) : (
                      <ToggleLeft size={20} />
                    )}
                    <span className="text-sm font-medium">
                      {company.active ? 'Aktif' : 'Pasif'}
                    </span>
                  </button>
                </div>

                
                <div className="space-y-4">
                  
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Sipariş Linki
                    </label>
                    <div className="relative">
                      <ExternalLink size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" />
                      <input
                        type="url"
                        value={company.link}
                        onChange={(e) => handleInputChange(companyKey, 'link', e.target.value)}
                        className="w-full bg-primary-bg border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-text-primary focus:border-accent-gold focus:outline-none"
                        placeholder="https://..."
                      />
                    </div>
                  </div>

                  
                  {company.link && (
                    <div className="mt-4 p-3 bg-primary-bg rounded-lg border border-gray-600">
                      <p className="text-xs text-text-secondary mb-2">Önizleme:</p>
                      <div className="flex space-x-2">
                        <a
                          href={company.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs bg-accent-gold text-primary-bg px-2 py-1 rounded flex items-center space-x-1"
                        >
                          <ExternalLink size={12} />
                          <span>Sipariş Ver</span>
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="bg-accent-gold hover:bg-yellow-500 text-primary-bg px-8 py-3 rounded-lg transition-colors duration-300 disabled:opacity-50 flex items-center space-x-2 font-medium"
            >
              {saving ? (
                <>
                  <div className="w-5 h-5 border-2 border-primary-bg border-t-transparent rounded-full animate-spin"></div>
                  <span>Kaydediliyor...</span>
                </>
              ) : (
                <>
                  <Save size={20} />
                  <span>Ayarları Kaydet</span>
                </>
              )}
            </button>
          </div>
        </form>

        
        <div className="bg-primary-card rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center space-x-2">
            <AlertCircle size={20} className="text-accent-gold" />
            <span>Bilgilendirme</span>
          </h3>
          <div className="space-y-2 text-text-secondary text-sm">
            <p>• Aktif olan platformlar ana sayfada görüntülenecektir</p>
            <p>• Link olmayan platformlar &quot;Yakında aktif olacak&quot; olarak gösterilir</p>
            <p>• Değişikliklerin etkili olması için ayarları kaydetmeyi unutmayın</p>
            <p>• Platform logolarını değiştirmek için geliştirici ile iletişime geçin</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}


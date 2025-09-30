'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Info,
  Users,
  Target,
  Eye,
  BarChart3,
  Save,
  Upload,
  X,
  Plus,
  Edit,
  Trash2,
  RefreshCw,
  CheckCircle,
  XCircle
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import AdminLayout from '@/components/AdminLayout'

interface AboutSettings {
  hero: {
    description: string
  }
  story: {
    title: string
    paragraphs: string[]
  }
  mission: {
    title: string
    description: string
  }
  vision: {
    title: string
    description: string
  }
  stats: Array<{
    icon: string
    number: string
    label: string
  }>
  team: Array<{
    id: string
    name: string
    role: string
    image: string
    description: string
  }>
  updatedAt: string
}

interface Notification {
  show: boolean
  type: 'success' | 'error'
  title: string
  message: string
}

export default function AdminAboutPage() {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const [settings, setSettings] = useState<AboutSettings | null>(null)
  const [loadingSettings, setLoadingSettings] = useState(true)
  const [savingSettings, setSavingSettings] = useState(false)
  const [uploadingImage, setUploadingImage] = useState<string | null>(null)
  const [notification, setNotification] = useState<Notification | null>(null)

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


  useEffect(() => {
    if (notification?.show) {
      const timer = setTimeout(() => {
        setNotification(null)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [notification])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/about/settings')
      const data = await response.json()
      setSettings(data)
    } catch (error) {
      console.error('Ayarlar yüklenemedi:', error)
      setNotification({
        show: true,
        type: 'error',
        title: 'Hata!',
        message: 'Hakkımızda ayarları yüklenemedi.'
      })
    } finally {
      setLoadingSettings(false)
    }
  }

  const handleSaveSettings = async () => {
    if (!settings) return

    setSavingSettings(true)
    try {
      const response = await fetch('/api/about/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      })

      if (response.ok) {
        setNotification({
          show: true,
          type: 'success',
          title: 'Ayarlar Kaydedildi!',
          message: 'Hakkımızda ayarları başarıyla kaydedildi.'
        })
      } else {
        throw new Error('Ayarlar kaydedilemedi')
      }
    } catch (error) {
      setNotification({
        show: true,
        type: 'error',
        title: 'Hata!',
        message: 'Hakkımızda ayarları kaydedilirken bir hata oluştu.'
      })
      console.error('Ayar kaydetme hatası:', error)
    } finally {
      setSavingSettings(false)
    }
  }

  const handleImageUpload = async (memberId: string, file: File) => {
    setUploadingImage(memberId)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('memberId', memberId)

      const response = await fetch('/api/about/settings', {
        method: 'PUT',
        body: formData
      })

      const data = await response.json()

      if (data.success) {

        setSettings(prev => prev ? {
          ...prev,
          team: prev.team.map(member =>
            member.id === memberId
              ? { ...member, image: data.imageUrl }
              : member
          )
        } : null)

        setNotification({
          show: true,
          type: 'success',
          title: 'Resim Yükleme Başarılı!',
          message: 'Ekip üyesi resmi başarıyla güncellendi.'
        })
      } else {
        throw new Error(data.error || 'Resim yüklenemedi')
      }
    } catch (error) {
      setNotification({
        show: true,
        type: 'error',
        title: 'Resim Yükleme Hatası!',
        message: 'Resim yüklenirken bir hata oluştu.'
      })
      console.error('Resim yükleme hatası:', error)
    } finally {
      setUploadingImage(null)
    }
  }

  const addTeamMember = () => {
    if (!settings) return

    const newMember = {
      id: Date.now().toString(),
      name: '',
      role: '',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      description: ''
    }

    setSettings(prev => prev ? {
      ...prev,
      team: [...prev.team, newMember]
    } : null)
  }

  const removeTeamMember = (memberId: string) => {
    if (!settings) return

    setSettings(prev => prev ? {
      ...prev,
      team: prev.team.filter(member => member.id !== memberId)
    } : null)
  }

  const updateTeamMember = (memberId: string, field: string, value: string) => {
    if (!settings) return

    setSettings(prev => prev ? {
      ...prev,
      team: prev.team.map(member =>
        member.id === memberId
          ? { ...member, [field]: value }
          : member
      )
    } : null)
  }

  const updateParagraph = (index: number, value: string) => {
    if (!settings) return

    setSettings(prev => prev ? {
      ...prev,
      story: {
        ...prev.story,
        paragraphs: prev.story.paragraphs.map((para, i) =>
          i === index ? value : para
        )
      }
    } : null)
  }

  const addParagraph = () => {
    if (!settings) return

    setSettings(prev => prev ? {
      ...prev,
      story: {
        ...prev.story,
        paragraphs: [...prev.story.paragraphs, '']
      }
    } : null)
  }

  const removeParagraph = (index: number) => {
    if (!settings) return

    setSettings(prev => prev ? {
      ...prev,
      story: {
        ...prev.story,
        paragraphs: prev.story.paragraphs.filter((_, i) => i !== index)
      }
    } : null)
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

  if (loadingSettings || !settings) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-accent-gold">Ayarlar yükleniyor...</div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        
        <div className="bg-gradient-to-r from-primary-card to-primary-secondary p-6 rounded-xl border border-gray-700 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-serif font-bold text-text-primary mb-1">
                Hakkımızda Ayarları
              </h1>
              <p className="text-text-secondary text-sm">
                Hakkımızda sayfasındaki içerikleri düzenleyin
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSaveSettings}
              disabled={savingSettings}
              className="bg-accent-gold hover:bg-yellow-500 text-primary-bg px-6 py-3 rounded-lg font-semibold transition-colors duration-300 disabled:opacity-50 flex items-center space-x-2"
            >
              {savingSettings ? (
                <>
                  <RefreshCw size={18} className="animate-spin" />
                  <span>Kaydediliyor...</span>
                </>
              ) : (
                <>
                  <Save size={18} />
                  <span>Tümünü Kaydet</span>
                </>
              )}
            </motion.button>
          </div>
        </div>

        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-primary-card to-primary-secondary rounded-xl p-6 shadow-lg border border-gray-700"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-accent-gold to-yellow-500 rounded-lg flex items-center justify-center">
              <Info size={20} className="text-primary-bg" />
            </div>
            <div>
              <h2 className="text-xl font-serif font-semibold text-text-primary">
                Hero Bölümü
              </h2>
              <p className="text-text-secondary text-sm">
                Ana sayfa açıklaması
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Açıklama Metni
            </label>
            <textarea
              value={settings.hero.description}
              onChange={(e) => setSettings(prev => prev ? {
                ...prev,
                hero: { ...prev.hero, description: e.target.value }
              } : null)}
              rows={2}
              className="w-full bg-primary-bg border border-gray-600 rounded-lg px-4 py-2 text-text-primary focus:border-accent-gold focus:outline-none resize-none"
              placeholder="Hero açıklaması..."
            />
          </div>
        </motion.div>

        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-primary-card to-primary-secondary rounded-xl p-6 shadow-lg border border-gray-700"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-accent-gold to-yellow-500 rounded-lg flex items-center justify-center">
              <Info size={20} className="text-primary-bg" />
            </div>
            <div>
              <h2 className="text-xl font-serif font-semibold text-text-primary">
                Hikayemiz Bölümü
              </h2>
              <p className="text-text-secondary text-sm">
                Restoran hikayesi metinleri
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Başlık
              </label>
              <input
                type="text"
                value={settings.story.title}
                onChange={(e) => setSettings(prev => prev ? {
                  ...prev,
                  story: { ...prev.story, title: e.target.value }
                } : null)}
                className="w-full bg-primary-bg border border-gray-600 rounded-lg px-4 py-2 text-text-primary focus:border-accent-gold focus:outline-none"
                placeholder="Hikayemiz..."
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-text-secondary">
                  Paragraflar
                </label>
                <button
                  onClick={addParagraph}
                  className="text-accent-gold hover:text-yellow-500 text-sm flex items-center space-x-1"
                >
                  <Plus size={14} />
                  <span>Paragraf Ekle</span>
                </button>
              </div>
              <div className="space-y-3">
                {settings.story.paragraphs.map((paragraph, index) => (
                  <div key={index} className="flex space-x-2">
                    <textarea
                      value={paragraph}
                      onChange={(e) => updateParagraph(index, e.target.value)}
                      rows={3}
                      className="flex-1 bg-primary-bg border border-gray-600 rounded-lg px-4 py-2 text-text-primary focus:border-accent-gold focus:outline-none resize-none"
                      placeholder={`Paragraf ${index + 1}...`}
                    />
                    {settings.story.paragraphs.length > 1 && (
                      <button
                        onClick={() => removeParagraph(index)}
                        className="p-2 text-red-500 hover:text-red-400 transition-colors"
                        title="Paragrafı Sil"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-primary-card to-primary-secondary rounded-xl p-6 shadow-lg border border-gray-700"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-accent-gold to-yellow-500 rounded-lg flex items-center justify-center">
                <Target size={20} className="text-primary-bg" />
              </div>
              <div>
                <h2 className="text-xl font-serif font-semibold text-text-primary">
                  Misyon
                </h2>
                <p className="text-text-secondary text-sm">
                  Misyon metni
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Başlık
                </label>
                <input
                  type="text"
                  value={settings.mission.title}
                  onChange={(e) => setSettings(prev => prev ? {
                    ...prev,
                    mission: { ...prev.mission, title: e.target.value }
                  } : null)}
                  className="w-full bg-primary-bg border border-gray-600 rounded-lg px-4 py-2 text-text-primary focus:border-accent-gold focus:outline-none"
                  placeholder="Misyonumuz..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Açıklama
                </label>
                <textarea
                  value={settings.mission.description}
                  onChange={(e) => setSettings(prev => prev ? {
                    ...prev,
                    mission: { ...prev.mission, description: e.target.value }
                  } : null)}
                  rows={4}
                  className="w-full bg-primary-bg border border-gray-600 rounded-lg px-4 py-2 text-text-primary focus:border-accent-gold focus:outline-none resize-none"
                  placeholder="Misyon açıklaması..."
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-primary-card to-primary-secondary rounded-xl p-6 shadow-lg border border-gray-700"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-accent-gold to-yellow-500 rounded-lg flex items-center justify-center">
                <Eye size={20} className="text-primary-bg" />
              </div>
              <div>
                <h2 className="text-xl font-serif font-semibold text-text-primary">
                  Vizyon
                </h2>
                <p className="text-text-secondary text-sm">
                  Vizyon metni
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Başlık
                </label>
                <input
                  type="text"
                  value={settings.vision.title}
                  onChange={(e) => setSettings(prev => prev ? {
                    ...prev,
                    vision: { ...prev.vision, title: e.target.value }
                  } : null)}
                  className="w-full bg-primary-bg border border-gray-600 rounded-lg px-4 py-2 text-text-primary focus:border-accent-gold focus:outline-none"
                  placeholder="Vizyonumuz..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Açıklama
                </label>
                <textarea
                  value={settings.vision.description}
                  onChange={(e) => setSettings(prev => prev ? {
                    ...prev,
                    vision: { ...prev.vision, description: e.target.value }
                  } : null)}
                  rows={4}
                  className="w-full bg-primary-bg border border-gray-600 rounded-lg px-4 py-2 text-text-primary focus:border-accent-gold focus:outline-none resize-none"
                  placeholder="Vizyon açıklaması..."
                />
              </div>
            </div>
          </motion.div>
        </div>

        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-primary-card to-primary-secondary rounded-xl p-6 shadow-lg border border-gray-700"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-accent-gold to-yellow-500 rounded-lg flex items-center justify-center">
              <BarChart3 size={20} className="text-primary-bg" />
            </div>
            <div>
              <h2 className="text-xl font-serif font-semibold text-text-primary">
                İstatistikler
              </h2>
              <p className="text-text-secondary text-sm">
                Rakamlarla Restly bölümündeki istatistikler
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {settings.stats.map((stat, index) => (
              <div key={index} className="space-y-3 p-4 bg-primary-bg rounded-lg border border-gray-600">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    İkon
                  </label>
                  <select
                    value={stat.icon}
                    onChange={(e) => setSettings(prev => prev ? {
                      ...prev,
                      stats: prev.stats.map((s, i) =>
                        i === index ? { ...s, icon: e.target.value } : s
                      )
                    } : null)}
                    className="w-full bg-primary-secondary border border-gray-600 rounded px-3 py-2 text-text-primary focus:border-accent-gold focus:outline-none"
                  >
                    <option value="Award">Award</option>
                    <option value="Users">Users</option>
                    <option value="Clock">Clock</option>
                    <option value="Heart">Heart</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Sayı
                  </label>
                  <input
                    type="text"
                    value={stat.number}
                    onChange={(e) => setSettings(prev => prev ? {
                      ...prev,
                      stats: prev.stats.map((s, i) =>
                        i === index ? { ...s, number: e.target.value } : s
                      )
                    } : null)}
                    className="w-full bg-primary-secondary border border-gray-600 rounded px-3 py-2 text-text-primary focus:border-accent-gold focus:outline-none"
                    placeholder="15+"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Etiket
                  </label>
                  <input
                    type="text"
                    value={stat.label}
                    onChange={(e) => setSettings(prev => prev ? {
                      ...prev,
                      stats: prev.stats.map((s, i) =>
                        i === index ? { ...s, label: e.target.value } : s
                      )
                    } : null)}
                    className="w-full bg-primary-secondary border border-gray-600 rounded px-3 py-2 text-text-primary focus:border-accent-gold focus:outline-none"
                    placeholder="Yıl Deneyim"
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-primary-card to-primary-secondary rounded-xl p-6 shadow-lg border border-gray-700"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-accent-gold to-yellow-500 rounded-lg flex items-center justify-center">
                <Users size={20} className="text-primary-bg" />
              </div>
              <div>
                <h2 className="text-xl font-serif font-semibold text-text-primary">
                  Ekibimiz
                </h2>
                <p className="text-text-secondary text-sm">
                  Ekip üyeleri bilgileri ve fotoğrafları
                </p>
              </div>
            </div>
            <button
              onClick={addTeamMember}
              className="bg-accent-gold hover:bg-yellow-500 text-primary-bg px-4 py-2 rounded-lg font-semibold transition-colors duration-300 flex items-center space-x-2"
            >
              <Plus size={16} />
              <span>Üye Ekle</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {settings.team.map((member) => (
              <div key={member.id} className="bg-primary-bg rounded-lg p-4 border border-gray-600">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-text-primary">Ekip Üyesi</h3>
                  <button
                    onClick={() => removeTeamMember(member.id)}
                    className="text-red-500 hover:text-red-400 transition-colors"
                    title="Üyeyi Sil"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Profil Fotoğrafı
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          handleImageUpload(member.id, file)
                        }
                      }}
                      className="hidden"
                      id={`image-${member.id}`}
                      disabled={uploadingImage === member.id}
                    />
                    <label
                      htmlFor={`image-${member.id}`}
                      className="relative w-20 h-20 mx-auto block cursor-pointer group"
                    >
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover rounded-full border-2 border-gray-600 group-hover:border-accent-gold transition-colors"
                      />
                      {uploadingImage === member.id ? (
                        <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                          <RefreshCw size={16} className="text-white animate-spin" />
                        </div>
                      ) : (
                        <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Upload size={16} className="text-white" />
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                
                <div className="mb-3">
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    İsim
                  </label>
                  <input
                    type="text"
                    value={member.name}
                    onChange={(e) => updateTeamMember(member.id, 'name', e.target.value)}
                    className="w-full bg-primary-secondary border border-gray-600 rounded px-3 py-2 text-text-primary focus:border-accent-gold focus:outline-none"
                    placeholder="İsim Soyisim"
                  />
                </div>

                
                <div className="mb-3">
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Görevi
                  </label>
                  <input
                    type="text"
                    value={member.role}
                    onChange={(e) => updateTeamMember(member.id, 'role', e.target.value)}
                    className="w-full bg-primary-secondary border border-gray-600 rounded px-3 py-2 text-text-primary focus:border-accent-gold focus:outline-none"
                    placeholder="Baş Şef"
                  />
                </div>

                
                <div className="mb-3">
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Açıklama
                  </label>
                  <textarea
                    value={member.description}
                    onChange={(e) => updateTeamMember(member.id, 'description', e.target.value)}
                    rows={3}
                    className="w-full bg-primary-secondary border border-gray-600 rounded px-3 py-2 text-text-primary focus:border-accent-gold focus:outline-none resize-none"
                    placeholder="Kısa açıklama..."
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      
      {notification?.show && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed top-4 right-4 z-[10000] max-w-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2, delay: 0.1 }}
            className={`p-4 rounded-lg shadow-lg border backdrop-blur-sm ${
              notification.type === 'success'
                ? 'bg-green-500/90 border-green-400 text-white'
                : 'bg-red-500/90 border-red-400 text-white'
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                {notification.type === 'success' ? (
                  <CheckCircle size={24} className="text-white" />
                ) : (
                  <XCircle size={24} className="text-white" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-white">
                  {notification.title}
                </h4>
                <p className="text-sm text-white/90 mt-1">
                  {notification.message}
                </p>
              </div>
              <button
                onClick={() => setNotification(null)}
                className="flex-shrink-0 text-white/70 hover:text-white transition-colors duration-200"
              >
                <X size={16} />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AdminLayout>
  )
}



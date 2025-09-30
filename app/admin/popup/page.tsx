'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Send,
  Bell,
  Users,
  CheckCircle,
  XCircle,
  RefreshCw,
  AlertCircle,
  MessageSquare,
  Eye,
  Settings,
  Save,
  X
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import AdminLayout from '@/components/AdminLayout'

interface Subscription {
  endpoint: string
  keys: {
    p256dh: string
    auth: string
  }
  subscribedAt: string
  updatedAt?: string
}

interface PushNotificationData {
  title: string
  body: string
  url: string
}

interface PopupSettings {
  defaultTitle: string
  defaultMessage: string
  defaultUrl: string
  autoShowDelay: number
  enablePopup: boolean
  popupTitle: string
  popupMessage: string
  showOnAllPages: boolean
  excludedPages: string[]
  maxShowsPerUser: number
  showAgainAfterDays: number
  updatedAt: string
}

export default function AdminPopupPage() {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loadingSubs, setLoadingSubs] = useState(true)
  const [sending, setSending] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [savingSettings, setSavingSettings] = useState(false)
  const [notification, setNotification] = useState<{
    show: boolean
    type: 'success' | 'error'
    title: string
    message: string
  } | null>(null)

  const [notificationData, setNotificationData] = useState<PushNotificationData>({
    title: 'Restly Restaurant',
    body: '',
    url: '/'
  })

  const [popupSettings, setPopupSettings] = useState<PopupSettings>({
    defaultTitle: 'Restly Restaurant',
    defaultMessage: 'Yeni kampanyalarımızdan haberdar olmak ister misiniz?',
    defaultUrl: '/',
    autoShowDelay: 3000,
    enablePopup: true,
    popupTitle: 'Hoş Geldiniz! 👋',
    popupMessage: 'Restly Restaurant\'a hoş geldiniz! Özel lezzetlerimiz, kampanyalarımız ve rezervasyon fırsatlarımızdan haberdar olmak ister misiniz?',
    showOnAllPages: true,
    excludedPages: ['/admin', '/api'],
    maxShowsPerUser: 3,
    showAgainAfterDays: 7,
    updatedAt: new Date().toISOString()
  })

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/admin/login')
    }
  }, [isAuthenticated, loading, router])

  useEffect(() => {
    if (isAuthenticated) {
      fetchSubscriptions()
      fetchPopupSettings()
    }
  }, [isAuthenticated])


  useEffect(() => {
    if (notification?.show) {
      const timer = setTimeout(() => {
        setNotification(null)
      }, 3000) // 3 saniye sonra kapan

      return () => clearTimeout(timer)
    }
  }, [notification])

  const fetchSubscriptions = async () => {
    try {
      const response = await fetch('/api/notifications/subscriptions')
      if (response.ok) {
        const data = await response.json()
        setSubscriptions(data.subscriptions || [])
      }
    } catch (error) {
      console.error('Abonelikler yüklenemedi:', error)
    } finally {
      setLoadingSubs(false)
    }
  }

  const fetchPopupSettings = async () => {
    try {
      const response = await fetch('/api/popup/settings')
      if (response.ok) {
        const data = await response.json()
        if (data.settings) {
          setPopupSettings(data.settings)

          setNotificationData({
            title: data.settings.defaultTitle || 'Restly Restaurant',
            body: data.settings.defaultMessage || '',
            url: data.settings.defaultUrl || '/'
          })
        }
      }
    } catch (error) {
      console.error('Popup ayarları yüklenemedi:', error)
    }
  }

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault()
    setSavingSettings(true)

    try {
      const response = await fetch('/api/popup/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(popupSettings)
      })

      if (response.ok) {
        setNotification({
          show: true,
          type: 'success',
          title: 'Ayarlar Kaydedildi!',
          message: 'Popup ayarları başarıyla kaydedildi.'
        })
        setTimeout(() => setMessage(null), 3000)
      } else {
        throw new Error('Ayarlar kaydedilemedi')
      }
    } catch (error) {
      setNotification({
        show: true,
        type: 'error',
        title: 'Hata!',
        message: 'Popup ayarları kaydedilirken bir hata oluştu.'
      })
      console.error('Ayar kaydetme hatası:', error)
    } finally {
      setSavingSettings(false)
    }
  }

  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!notificationData.body.trim()) {
      setMessage({ type: 'error', text: 'Lütfen bildirim mesajını girin' })
      return
    }

    if (subscriptions.length === 0) {
      setMessage({ type: 'error', text: 'Gönderilecek abone bulunamadı. Önce kullanıcıların abone olması gerekiyor.' })
      return
    }

    setSending(true)

    try {
      console.log('Bildirim gönderme başlatıldı:', {
        title: notificationData.title,
        body: notificationData.body,
        url: notificationData.url,
        subscriberCount: subscriptions.length
      })

      const response = await fetch('/api/notifications/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notificationData)
      })

      console.log('API Response status:', response.status)
      console.log('API Response ok:', response.ok)

      const responseData = await response.json()
      console.log('API Response data:', responseData)

      if (response.ok) {
        setMessage({
          type: 'success',
          text: `${responseData.results?.filter((r: any) => r.success).length || subscriptions.length}/${subscriptions.length} aboneye bildirim başarıyla gönderildi!`
        })
        setNotificationData(prev => ({ ...prev, body: '' }))


        await fetchSubscriptions()

        setTimeout(() => setMessage(null), 5000)
      } else {
        throw new Error(responseData.message || `HTTP ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      console.error('Bildirim gönderme hatası:', error)
      const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen hata'
      setMessage({
        type: 'error',
        text: `Bildirim gönderilemedi: ${errorMessage}. Lütfen tekrar deneyin.`
      })
    } finally {
      setSending(false)
    }
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
              <Bell size={24} className="text-primary-bg" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-serif font-bold text-text-primary mb-1">
                Popup İşlemleri
              </h1>
              <p className="text-text-secondary text-sm">
                Push notification gönderme ve abonelik yönetimi
              </p>
            </div>
          </div>
        </div>

        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-primary-card to-primary-secondary rounded-xl p-6 shadow-lg border border-gray-700"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Users size={24} className="text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-text-primary">
                  {loadingSubs ? '...' : subscriptions.length}
                </div>
                <div className="text-text-secondary text-sm">Toplam Abone</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-primary-card to-primary-secondary rounded-xl p-6 shadow-lg border border-gray-700"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <Send size={24} className="text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-text-primary">
                  {sending ? 'Gönderiliyor...' : 'Hazır'}
                </div>
                <div className="text-text-secondary text-sm">Gönderme Durumu</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-primary-card to-primary-secondary rounded-xl p-6 shadow-lg border border-gray-700"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Bell size={24} className="text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-text-primary">
                  {subscriptions.length > 0 ? 'Aktif' : 'Pasif'}
                </div>
                <div className="text-text-secondary text-sm">Sistem Durumu</div>
              </div>
            </div>
          </motion.div>
        </div>

        
        {subscriptions.length === 0 && !loadingSubs && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-xl p-6 border border-yellow-500/30"
          >
            <div className="flex items-start space-x-3">
              <AlertCircle size={24} className="text-yellow-500 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-yellow-500 mb-2">
                  Abone Bulunamadı
                </h3>
                <p className="text-yellow-500/80 mb-4">
                  Push notification göndermek için önce kullanıcıların abone olması gerekiyor.
                </p>
                <div className="space-y-2 text-sm text-yellow-600">
                  <p><strong>Kullanıcılar nasıl abone olabilir:</strong></p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Ana sayfayı ziyaret edin</li>
                    <li>Tarayıcıda bildirim izni isteyin</li>
                    <li>&quot;İzin Ver&quot; butonuna tıklayın</li>
                    <li>Push notification&apos;a abone olun</li>
                  </ul>
                </div>
                <div className="mt-4 p-3 bg-yellow-500/20 rounded-lg">
                  <p className="text-yellow-600 text-sm">
                    <strong>Test için:</strong> <code className="bg-yellow-500/30 px-2 py-1 rounded">/push-test</code> sayfasını kullanarak manuel abonelik alabilirsiniz.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-primary-card to-primary-secondary rounded-xl p-6 shadow-lg border border-gray-700"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Settings size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-serif font-semibold text-text-primary">
                Popup Ayarları
              </h2>
              <p className="text-text-secondary text-sm">
                Popup modal ayarlarını yönetin
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-text-primary">Genel Ayarlar</h3>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Popup Başlığı
                  </label>
                  <input
                    type="text"
                    value={popupSettings.popupTitle}
                    onChange={(e) => setPopupSettings(prev => ({ ...prev, popupTitle: e.target.value }))}
                    className="w-full bg-primary-bg border border-gray-600 rounded-lg px-4 py-2 text-text-primary focus:border-accent-gold focus:outline-none"
                    placeholder="Hoş Geldiniz! 👋"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Popup Mesajı
                  </label>
                  <textarea
                    value={popupSettings.popupMessage}
                    onChange={(e) => setPopupSettings(prev => ({ ...prev, popupMessage: e.target.value }))}
                    rows={3}
                    className="w-full bg-primary-bg border border-gray-600 rounded-lg px-4 py-2 text-text-primary focus:border-accent-gold focus:outline-none resize-none"
                    placeholder="Popup mesajı..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Otomatik Gösterim Gecikmesi (ms)
                  </label>
                  <input
                    type="number"
                    value={popupSettings.autoShowDelay}
                    onChange={(e) => setPopupSettings(prev => ({ ...prev, autoShowDelay: Number(e.target.value) }))}
                    className="w-full bg-primary-bg border border-gray-600 rounded-lg px-4 py-2 text-text-primary focus:border-accent-gold focus:outline-none"
                    min="1000"
                    max="10000"
                    step="500"
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="enablePopup"
                    checked={popupSettings.enablePopup}
                    onChange={(e) => setPopupSettings(prev => ({ ...prev, enablePopup: e.target.checked }))}
                    className="w-4 h-4 text-accent-gold bg-primary-bg border-gray-600 rounded focus:ring-accent-gold focus:ring-2"
                  />
                  <label htmlFor="enablePopup" className="text-sm font-medium text-text-secondary">
                    Popup&apos;u Etkinleştir
                  </label>
                </div>
              </div>

              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-text-primary">Varsayılan Bildirim Ayarları</h3>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Varsayılan Başlık
                  </label>
                  <input
                    type="text"
                    value={popupSettings.defaultTitle}
                    onChange={(e) => setPopupSettings(prev => ({ ...prev, defaultTitle: e.target.value }))}
                    className="w-full bg-primary-bg border border-gray-600 rounded-lg px-4 py-2 text-text-primary focus:border-accent-gold focus:outline-none"
                    placeholder="Restly Restaurant"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Varsayılan Mesaj
                  </label>
                  <textarea
                    value={popupSettings.defaultMessage}
                    onChange={(e) => setPopupSettings(prev => ({ ...prev, defaultMessage: e.target.value }))}
                    rows={3}
                    className="w-full bg-primary-bg border border-gray-600 rounded-lg px-4 py-2 text-text-primary focus:border-accent-gold focus:outline-none resize-none"
                    placeholder="Bildirim mesajı..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Varsayılan URL
                  </label>
                  <input
                    type="text"
                    value={popupSettings.defaultUrl}
                    onChange={(e) => setPopupSettings(prev => ({ ...prev, defaultUrl: e.target.value }))}
                    className="w-full bg-primary-bg border border-gray-600 rounded-lg px-4 py-2 text-text-primary focus:border-accent-gold focus:outline-none"
                    placeholder="/"
                  />
                </div>
              </div>
            </div>

            
            <div className="border-t border-gray-700 pt-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Gelişmiş Ayarlar</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Kullanıcı Başına Max Gösterim
                  </label>
                  <input
                    type="number"
                    value={popupSettings.maxShowsPerUser}
                    onChange={(e) => setPopupSettings(prev => ({ ...prev, maxShowsPerUser: Number(e.target.value) }))}
                    className="w-full bg-primary-bg border border-gray-600 rounded-lg px-4 py-2 text-text-primary focus:border-accent-gold focus:outline-none"
                    min="1"
                    max="10"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Tekrar Gösterim (Gün)
                  </label>
                  <input
                    type="number"
                    value={popupSettings.showAgainAfterDays}
                    onChange={(e) => setPopupSettings(prev => ({ ...prev, showAgainAfterDays: Number(e.target.value) }))}
                    className="w-full bg-primary-bg border border-gray-600 rounded-lg px-4 py-2 text-text-primary focus:border-accent-gold focus:outline-none"
                    min="1"
                    max="365"
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="showOnAllPages"
                    checked={popupSettings.showOnAllPages}
                    onChange={(e) => setPopupSettings(prev => ({ ...prev, showOnAllPages: e.target.checked }))}
                    className="w-4 h-4 text-accent-gold bg-primary-bg border-gray-600 rounded focus:ring-accent-gold focus:ring-2"
                  />
                  <label htmlFor="showOnAllPages" className="text-sm font-medium text-text-secondary">
                    Tüm Sayfalarda Göster
                  </label>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Hariç Tutulan Sayfalar (virgülle ayırın)
                </label>
                <input
                  type="text"
                  value={popupSettings.excludedPages.join(', ')}
                  onChange={(e) => setPopupSettings(prev => ({
                    ...prev,
                    excludedPages: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                  }))}
                  className="w-full bg-primary-bg border border-gray-600 rounded-lg px-4 py-2 text-text-primary focus:border-accent-gold focus:outline-none"
                  placeholder="/admin, /api, /login"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-700">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
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
                    <span>Ayarları Kaydet</span>
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>

        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-primary-card to-primary-secondary rounded-xl p-6 shadow-lg border border-gray-700"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-accent-gold to-yellow-500 rounded-lg flex items-center justify-center">
              <Send size={20} className="text-primary-bg" />
            </div>
            <div>
              <h2 className="text-xl font-serif font-semibold text-text-primary">
                Bildirim Gönder
              </h2>
              <p className="text-text-secondary text-sm">
                Tüm abonelere push notification gönderin
              </p>
            </div>
          </div>

          <form onSubmit={handleSendNotification} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Başlık
              </label>
              <input
                type="text"
                value={notificationData.title}
                onChange={(e) => setNotificationData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full bg-primary-bg border border-gray-600 rounded-lg px-4 py-2 text-text-primary focus:border-accent-gold focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Mesaj <span className="text-red-500">*</span>
              </label>
              <textarea
                value={notificationData.body}
                onChange={(e) => setNotificationData(prev => ({ ...prev, body: e.target.value }))}
                rows={3}
                className="w-full bg-primary-bg border border-gray-600 rounded-lg px-4 py-2 text-text-primary focus:border-accent-gold focus:outline-none resize-none"
                placeholder="Bildirim mesajını yazın..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Yönlendirme URL&apos;i
              </label>
              <input
                type="text"
                value={notificationData.url}
                onChange={(e) => setNotificationData(prev => ({ ...prev, url: e.target.value }))}
                className="w-full bg-primary-bg border border-gray-600 rounded-lg px-4 py-2 text-text-primary focus:border-accent-gold focus:outline-none"
                placeholder="/"
              />
            </div>

            <div className="flex items-center justify-between pt-4">
              <div className="text-sm text-text-secondary">
                {subscriptions.length} aboneye gönderilecek
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={sending || subscriptions.length === 0}
                className="bg-accent-gold hover:bg-yellow-500 text-primary-bg px-6 py-3 rounded-lg font-semibold transition-colors duration-300 disabled:opacity-50 flex items-center space-x-2"
              >
                {sending ? (
                  <>
                    <RefreshCw size={18} className="animate-spin" />
                    <span>Gönderiliyor...</span>
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    <span>Gönder</span>
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>

        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-primary-card to-primary-secondary rounded-xl p-6 shadow-lg border border-gray-700"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Users size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-serif font-semibold text-text-primary">
                  Abonelikler
                </h2>
                <p className="text-text-secondary text-sm">
                  Push notification aboneleri
                </p>
              </div>
            </div>

            <button
              onClick={fetchSubscriptions}
              className="flex items-center space-x-2 text-accent-gold hover:text-yellow-500 transition-colors duration-300"
            >
              <RefreshCw size={18} />
              <span>Yenile</span>
            </button>
          </div>

          {loadingSubs ? (
            <div className="text-center py-8">
              <RefreshCw size={24} className="mx-auto text-accent-gold animate-spin mb-2" />
              <p className="text-text-secondary">Abonelikler yükleniyor...</p>
            </div>
          ) : subscriptions.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle size={48} className="mx-auto text-text-secondary mb-4" />
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                Henüz Abone Yok
              </h3>
              <p className="text-text-secondary">
                Kullanıcılar henüz push notification&apos;a abone olmamış.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {subscriptions.map((sub, index) => (
                <motion.div
                  key={sub.endpoint}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-primary-bg rounded-lg p-4 border border-gray-600 hover:border-accent-gold/50 transition-colors duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                        <CheckCircle size={16} className="text-green-500" />
                      </div>
                      <div>
                        <div className="text-text-primary font-medium">
                          Abone #{index + 1}
                        </div>
                        <div className="text-text-secondary text-xs">
                          {new Date(sub.subscribedAt).toLocaleDateString('tr-TR')}
                          {sub.updatedAt && sub.updatedAt !== sub.subscribedAt && (
                            <span className="ml-2">
                              (Güncellendi: {new Date(sub.updatedAt).toLocaleDateString('tr-TR')})
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-text-secondary text-xs">
                      Aktif
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      
      <AnimatePresence>
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
      </AnimatePresence>
    </AdminLayout>
  )
}



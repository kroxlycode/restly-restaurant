'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, X, CheckCircle, AlertCircle, Loader2, Eye } from 'lucide-react'
import { usePushNotifications } from '@/hooks/usePushNotifications'

export default function PushNotificationConsent() {
  const [showBanner, setShowBanner] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [hasShownBefore, setHasShownBefore] = useState(false)

  const { isSupported, permission, isSubscribed, isLoading, requestPermission, subscribe } = usePushNotifications()

  useEffect(() => {

    const pushConsent = localStorage.getItem('push-notification-consent')
    const hasSubscribed = localStorage.getItem('push-subscribed')

    if (pushConsent === 'dismissed' || hasSubscribed === 'true') {
      setHasShownBefore(true)
      return
    }


    const cookieConsent = localStorage.getItem('cookie-consent')
    if (cookieConsent) {
      const timer = setTimeout(() => {

        setShowBanner(true)
      }, 3000) // Cookie'den sonra 3 saniye bekle

      return () => clearTimeout(timer)
    }
  }, [])

  const handleSubscribe = async () => {

    if (permission !== 'granted') {
      const granted = await requestPermission()
      if (!granted) return
    }


    const success = await subscribe()
    if (success) {
      localStorage.setItem('push-subscribed', 'true')
      setShowBanner(false)
      setShowSettings(false)
    }
  }

  const handleDismiss = () => {
    localStorage.setItem('push-notification-consent', 'dismissed')
    setShowBanner(false)
  }

  const handleShowSettings = () => {
    setShowSettings(true)
  }

  const handleSettingsSubscribe = async () => {
    await handleSubscribe()
  }


  if (!isSupported || isSubscribed || hasShownBefore) {
    return null
  }

  return (
    <AnimatePresence>
      {showBanner && (
        <>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 z-[9998]"
          />

          
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 z-[9999] p-4"
          >
            <div className="max-w-4xl mx-auto">
              <div className="bg-primary-secondary border border-gray-700 rounded-xl shadow-2xl p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <Bell className="w-8 h-8 text-accent-gold" />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-lg font-serif font-bold text-text-primary mb-2">
                      Hoş Geldiniz! 👋
                    </h3>
                    <p className="text-text-secondary text-sm mb-4 leading-relaxed">
                      Restly Restaurant&apos;a hoş geldiniz! Özel lezzetlerimiz, kampanyalarımız ve
                      rezervasyon fırsatlarımızdan haberdar olmak ister misiniz?
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={handleSubscribe}
                        disabled={isLoading}
                        className="flex items-center justify-center space-x-2 btn-primary px-6 py-2 disabled:opacity-50"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 size={16} className="animate-spin" />
                            <span>Abone olunuyor...</span>
                          </>
                        ) : (
                          <>
                            <Bell size={16} />
                            <span>Bildirimleri Aç</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={handleShowSettings}
                        className="flex items-center justify-center space-x-2 text-text-secondary hover:text-accent-gold transition-colors duration-300 px-6 py-2 border border-gray-700 rounded-lg hover:border-accent-gold"
                      >
                        <Eye size={16} />
                        <span>Daha Fazla Bilgi</span>
                      </button>

                      <button
                        onClick={handleDismiss}
                        className="flex items-center justify-center space-x-2 text-text-secondary hover:text-red-400 transition-colors duration-300 px-6 py-2 border border-gray-700 rounded-lg hover:border-red-400"
                      >
                        <X size={16} />
                        <span>Şimdi Değil</span>
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleDismiss}
                    className="flex-shrink-0 text-text-secondary hover:text-accent-gold transition-colors duration-300"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          
          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
              >
                <div className="bg-primary-bg border border-gray-700 rounded-xl shadow-2xl max-w-md w-full">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-serif font-bold text-text-primary">
                        Bildirim Ayarları
                      </h3>
                      <button
                        onClick={() => setShowSettings(false)}
                        className="text-text-secondary hover:text-accent-gold transition-colors duration-300"
                      >
                        <X size={24} />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div className="text-center">
                        <Bell size={48} className="mx-auto text-accent-gold mb-4" />
                        <h4 className="text-lg font-semibold text-text-primary mb-2">
                          Restly Restaurant
                        </h4>
                        <p className="text-text-secondary text-sm mb-4">
                          Modern gastronomi ile geleneksel lezzetleri buluşturan eşsiz bir deneyim.
                          Özel menülerimiz, kampanyalarımız ve rezervasyon fırsatlarımızdan
                          haberdar olmak istemez misiniz?
                        </p>
                      </div>

                      <div className="bg-primary-secondary rounded-lg p-4 border border-gray-600">
                        <div className="flex items-start space-x-3">
                          <AlertCircle size={20} className="text-yellow-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <h5 className="font-medium text-text-primary text-sm mb-1">
                              Bildirim Aboneliği
                            </h5>
                            <p className="text-text-secondary text-xs">
                              Push notification&apos;lara abone olarak özel teklifler, yeni menü öğeleri
                              ve önemli duyurular hakkında anında bilgilendirilirsiniz.
                              İstediğiniz zaman aboneliğinizi iptal edebilirsiniz.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3">
                        <button
                          onClick={handleSettingsSubscribe}
                          disabled={isLoading}
                          className="flex items-center justify-center space-x-2 btn-primary px-6 py-3 disabled:opacity-50"
                        >
                          {isLoading ? (
                            <>
                              <Loader2 size={16} className="animate-spin" />
                              <span>Abone olunuyor...</span>
                            </>
                          ) : (
                            <>
                              <Bell size={16} />
                              <span>Push Bildirimlerini Aç</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => setShowSettings(false)}
                          className="flex items-center justify-center space-x-2 btn-secondary px-6 py-3"
                        >
                          <span>Şimdi Abone Olmayacağım</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  )
}



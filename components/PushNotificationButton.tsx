'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Bell, BellOff, Loader2 } from 'lucide-react'
import { usePushNotifications } from '@/hooks/usePushNotifications'

export default function PushNotificationButton() {
  const {
    isSupported,
    permission,
    isSubscribed,
    isLoading,
    requestPermission,
    subscribe,
    unsubscribe,
    sendTestNotification
  } = usePushNotifications()

  const [showPrompt, setShowPrompt] = useState(false)

  const handleSubscribe = async () => {
    if (permission !== 'granted') {
      const granted = await requestPermission()
      if (!granted) {
        alert('Bildirim izni verilmedi. Tarayıcı ayarlarından bildirimleri etkinleştirebilirsiniz.')
        return
      }
    }

    const success = await subscribe()
    if (success) {
      setShowPrompt(false)

      setTimeout(() => {
        sendTestNotification()
      }, 1000)
    } else {
      alert('Bildirim aboneliği başarısız oldu. Lütfen tekrar deneyin.')
    }
  }

  const handleUnsubscribe = async () => {
    const success = await unsubscribe()
    if (!success) {
      alert('Abonelik iptal edilemedi. Lütfen tekrar deneyin.')
    }
  }

  if (!isSupported) {
    return null // Don't show if not supported
  }

  return (
    <>
      
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          if (isSubscribed) {
            handleUnsubscribe()
          } else {
            setShowPrompt(true)
          }
        }}
        disabled={isLoading}
        className={`fixed bottom-6 right-6 z-[9998] p-4 rounded-full shadow-lg transition-all duration-300 ${
          isSubscribed 
            ? 'bg-green-500 hover:bg-green-600 text-white' 
            : 'bg-accent-gold hover:bg-yellow-500 text-primary-bg'
        }`}
        title={isSubscribed ? 'Bildirimleri kapat' : 'Bildirimleri aç'}
      >
        {isLoading ? (
          <Loader2 size={24} className="animate-spin" />
        ) : isSubscribed ? (
          <Bell size={24} />
        ) : (
          <BellOff size={24} />
        )}
      </motion.button>

      
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
        >
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowPrompt(false)} />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative bg-primary-secondary border border-gray-700 rounded-xl shadow-2xl p-6 max-w-md w-full"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-accent-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell size={32} className="text-accent-gold" />
              </div>
              
              <h3 className="text-xl font-serif font-bold text-text-primary mb-2">
                Bildirimler
              </h3>
              
              <p className="text-text-secondary mb-6 leading-relaxed">
                Özel kampanyalar, yeni menü öğeleri ve rezervasyon onayları hakkında 
                bildirim almak ister misiniz?
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={handleSubscribe}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center space-x-2 btn-primary py-3"
                >
                  {isLoading ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <Bell size={20} />
                  )}
                  <span>
                    {isLoading ? 'Abone olunuyor...' : 'Bildirimleri Aç'}
                  </span>
                </button>
                
                <button
                  onClick={() => setShowPrompt(false)}
                  className="w-full btn-secondary py-3"
                >
                  Şimdi Değil
                </button>
              </div>
              
              <p className="text-xs text-text-secondary mt-4">
                Bildirimleri istediğiniz zaman kapatabilirsiniz.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  )
}



'use client'

import { useState } from 'react'
import { usePushNotifications } from '@/hooks/usePushNotifications'
import { motion } from 'framer-motion'
import {
  Bell,
  BellOff,
  CheckCircle,
  XCircle,
  Send,
  RefreshCw,
  AlertCircle,
  MessageSquare,
  Eye,
  Users
} from 'lucide-react'

export default function PushNotificationTest() {
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

  const [testMessage, setTestMessage] = useState('')

  const handleTestNotification = async () => {
    try {
      const response = await fetch('/api/notifications/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'Test Bildirimi',
          body: testMessage || 'Bu bir test bildirimidir!',
          url: '/'
        })
      })

      if (response.ok) {
        alert('Test bildirimi gönderildi!')
      } else {
        alert('Test bildirimi gönderilemedi')
      }
    } catch (error) {
      console.error('Test bildirimi hatası:', error)
      alert('Test bildirimi gönderilirken hata oluştu')
    }
  }

  if (!isSupported) {
    return (
      <div className="min-h-screen bg-primary-bg flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary-card rounded-xl p-8 max-w-md w-full text-center border border-gray-700"
        >
          <AlertCircle size={48} className="mx-auto text-yellow-500 mb-4" />
          <h2 className="text-xl font-serif font-bold text-text-primary mb-2">
            Push Notifications Desteklenmiyor
          </h2>
          <p className="text-text-secondary">
            Tarayıcınız push notifications desteklemiyor veya HTTPS bağlantısı gerektiriyor.
          </p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-primary-bg p-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary-card rounded-xl p-8 border border-gray-700 shadow-lg"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-serif font-bold text-text-primary mb-2">
              Push Notification Testi
            </h1>
            <p className="text-text-secondary">
              Push notification sistemini test edin
            </p>
          </div>

          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-primary-secondary rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">
                {permission === 'granted' ? (
                  <CheckCircle className="mx-auto text-green-500" size={32} />
                ) : permission === 'denied' ? (
                  <XCircle className="mx-auto text-red-500" size={32} />
                ) : (
                  <Bell className="mx-auto text-yellow-500" size={32} />
                )}
              </div>
              <div className="text-sm text-text-secondary">İzin Durumu</div>
              <div className="font-semibold text-text-primary capitalize">
                {permission === 'granted' ? 'Verildi' :
                 permission === 'denied' ? 'Reddedildi' :
                 'Bekleniyor'}
              </div>
            </div>

            <div className="bg-primary-secondary rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">
                {isSubscribed ? (
                  <Bell className="mx-auto text-green-500" size={32} />
                ) : (
                  <BellOff className="mx-auto text-gray-500" size={32} />
                )}
              </div>
              <div className="text-sm text-text-secondary">Abonelik Durumu</div>
              <div className="font-semibold text-text-primary">
                {isSubscribed ? 'Aktif' : 'Pasif'}
              </div>
            </div>

            <div className="bg-primary-secondary rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">
                {isLoading ? (
                  <RefreshCw className="mx-auto text-accent-gold animate-spin" size={32} />
                ) : (
                  <CheckCircle className="mx-auto text-green-500" size={32} />
                )}
              </div>
              <div className="text-sm text-text-secondary">Durum</div>
              <div className="font-semibold text-text-primary">
                {isLoading ? 'Yükleniyor...' : 'Hazır'}
              </div>
            </div>
          </div>

          
          <div className="space-y-4">
            
            {permission !== 'granted' && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={requestPermission}
                disabled={isLoading}
                className="w-full bg-accent-gold hover:bg-yellow-500 text-primary-bg py-3 px-6 rounded-lg font-semibold transition-colors duration-300 disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                <Bell size={20} />
                <span>İzin İste</span>
              </motion.button>
            )}

            
            {permission === 'granted' && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={isSubscribed ? unsubscribe : subscribe}
                disabled={isLoading}
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors duration-300 disabled:opacity-50 flex items-center justify-center space-x-2 ${
                  isSubscribed
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
              >
                {isSubscribed ? <BellOff size={20} /> : <Bell size={20} />}
                <span>{isSubscribed ? 'Aboneliği İptal Et' : 'Abone Ol'}</span>
              </motion.button>
            )}

            
            {isSubscribed && (
              <div className="space-y-4 pt-6 border-t border-gray-700">
                <h3 className="text-lg font-semibold text-text-primary">
                  Bildirim Gönder Testi
                </h3>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Test Mesajı
                  </label>
                  <textarea
                    value={testMessage}
                    onChange={(e) => setTestMessage(e.target.value)}
                    rows={2}
                    className="w-full bg-primary-bg border border-gray-600 rounded-lg px-4 py-2 text-text-primary focus:border-accent-gold focus:outline-none resize-none"
                    placeholder="Test bildirimi mesajı..."
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleTestNotification}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-300 flex items-center justify-center space-x-2"
                  >
                    <Send size={18} />
                    <span>Test Bildirimi Gönder</span>
                  </button>

                  <button
                    onClick={async () => {
                      try {
                        const response = await fetch('/api/notifications/subscriptions')
                        const data = await response.json()
                        alert(`Toplam abone: ${data.count}\n\nDetaylar konsolda.`)
                        console.log('Abonelikler:', data)
                      } catch (error) {
                        alert('Abonelik bilgileri alınamadı')
                        console.error(error)
                      }
                    }}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-300 flex items-center justify-center space-x-2"
                  >
                    <Users size={18} />
                    <span>Abonelikleri Kontrol Et</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          
          <div className="mt-8 p-4 bg-primary-secondary rounded-lg">
            <h4 className="text-sm font-semibold text-text-primary mb-2">Debug Bilgileri:</h4>
            <div className="text-xs text-text-secondary space-y-1">
              <div>Destekleniyor: {isSupported ? 'Evet' : 'Hayır'}</div>
              <div>İzin: {permission}</div>
              <div>Abone: {isSubscribed ? 'Evet' : 'Hayır'}</div>
              <div>Yükleniyor: {isLoading ? 'Evet' : 'Hayır'}</div>
              <div>HTTPS/Localhost: {location.protocol === 'https:' || location.hostname === 'localhost' ? 'Evet' : 'Hayır'}</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}


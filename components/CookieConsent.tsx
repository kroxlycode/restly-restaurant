'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cookie, X, Settings, Check } from 'lucide-react'

interface CookieSettings {
  necessary: boolean
  analytics: boolean
  marketing: boolean
  preferences: boolean
}

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [settings, setSettings] = useState<CookieSettings>({
    necessary: true, // Always true, cannot be disabled
    analytics: false,
    marketing: false,
    preferences: false
  })

  useEffect(() => {

    const consent = localStorage.getItem('cookie-consent')
    if (!consent) {

      const timer = setTimeout(() => {
        setShowBanner(true)
      }, 2000)
      return () => clearTimeout(timer)
    } else {

      try {
        const savedSettings = JSON.parse(consent)
        setSettings(savedSettings)
      } catch (error) {
        console.error('Cookie ayarları yüklenemedi:', error)
      }
    }
  }, [])

  const acceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true
    }
    saveSettings(allAccepted)
  }

  const acceptNecessary = () => {
    const necessaryOnly = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false
    }
    saveSettings(necessaryOnly)
  }

  const saveCustomSettings = () => {
    saveSettings(settings)
  }

  const saveSettings = (newSettings: CookieSettings) => {
    localStorage.setItem('cookie-consent', JSON.stringify(newSettings))
    setSettings(newSettings)
    setShowBanner(false)
    setShowSettings(false)


    applyCookieSettings(newSettings)
  }

  const applyCookieSettings = (settings: CookieSettings) => {

    if (settings.analytics) {

      console.log('Analytics cookies enabled')
    } else {

      console.log('Analytics cookies disabled')
    }


    if (settings.marketing) {

      console.log('Marketing cookies enabled')
    } else {

      console.log('Marketing cookies disabled')
    }


    if (settings.preferences) {

      console.log('Preferences cookies enabled')
    } else {

      console.log('Preferences cookies disabled')
    }
  }

  return (
    <AnimatePresence>
      {showBanner && (
        <>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 z-[9999]"
          />

          
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 z-[10000] p-4"
          >
            <div className="max-w-6xl mx-auto">
              <div className="bg-primary-secondary border border-gray-700 rounded-xl shadow-2xl p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <Cookie className="w-8 h-8 text-accent-gold" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-serif font-bold text-text-primary mb-2">
                      Çerez Kullanımı
                    </h3>
                    <p className="text-text-secondary text-sm mb-4 leading-relaxed">
                      Web sitemizde deneyiminizi geliştirmek için çerezler kullanıyoruz. 
                      Zorunlu çerezler site işlevselliği için gereklidir. Diğer çerezler 
                      için izninizi istiyoruz. Çerez tercihlerinizi istediğiniz zaman 
                      değiştirebilirsiniz.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={acceptAll}
                        className="flex items-center justify-center space-x-2 btn-primary px-6 py-2"
                      >
                        <Check size={16} />
                        <span>Tümünü Kabul Et</span>
                      </button>
                      
                      <button
                        onClick={acceptNecessary}
                        className="flex items-center justify-center space-x-2 btn-secondary px-6 py-2"
                      >
                        <span>Sadece Gerekli</span>
                      </button>
                      
                      <button
                        onClick={() => setShowSettings(true)}
                        className="flex items-center justify-center space-x-2 text-text-secondary hover:text-accent-gold transition-colors duration-300 px-6 py-2 border border-gray-700 rounded-lg hover:border-accent-gold"
                      >
                        <Settings size={16} />
                        <span>Ayarlar</span>
                      </button>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setShowBanner(false)}
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
                className="fixed inset-0 z-[10001] flex items-center justify-center p-4"
              >
                <div className="bg-primary-bg border border-gray-700 rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-serif font-bold text-text-primary">
                        Çerez Ayarları
                      </h3>
                      <button
                        onClick={() => setShowSettings(false)}
                        className="text-text-secondary hover:text-accent-gold transition-colors duration-300"
                      >
                        <X size={24} />
                      </button>
                    </div>

                    <div className="space-y-6">
                      
                      <div className="border border-gray-700 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-text-primary">Zorunlu Çerezler</h4>
                          <div className="bg-green-500 text-white text-xs px-2 py-1 rounded">
                            Zorunlu
                          </div>
                        </div>
                        <p className="text-text-secondary text-sm mb-3">
                          Bu çerezler web sitesinin düzgün çalışması için gereklidir ve devre dışı bırakılamaz.
                        </p>
                      </div>

                      
                      <div className="border border-gray-700 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-text-primary">Analitik Çerezler</h4>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.analytics}
                              onChange={(e) => setSettings(prev => ({ ...prev, analytics: e.target.checked }))}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-gold"></div>
                          </label>
                        </div>
                        <p className="text-text-secondary text-sm">
                          Site trafiğini analiz etmek ve kullanıcı deneyimini geliştirmek için kullanılır.
                        </p>
                      </div>

                      
                      <div className="border border-gray-700 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-text-primary">Pazarlama Çerezleri</h4>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.marketing}
                              onChange={(e) => setSettings(prev => ({ ...prev, marketing: e.target.checked }))}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-gold"></div>
                          </label>
                        </div>
                        <p className="text-text-secondary text-sm">
                          Size özel reklamlar göstermek ve pazarlama kampanyalarının etkinliğini ölçmek için kullanılır.
                        </p>
                      </div>

                      
                      <div className="border border-gray-700 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-text-primary">Tercih Çerezleri</h4>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.preferences}
                              onChange={(e) => setSettings(prev => ({ ...prev, preferences: e.target.checked }))}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-gold"></div>
                          </label>
                        </div>
                        <p className="text-text-secondary text-sm">
                          Dil, tema ve diğer kişisel tercihlerinizi hatırlamak için kullanılır.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t border-gray-700">
                      <button
                        onClick={saveCustomSettings}
                        className="flex items-center justify-center space-x-2 btn-primary px-6 py-2"
                      >
                        <Check size={16} />
                        <span>Ayarları Kaydet</span>
                      </button>
                      
                      <button
                        onClick={acceptAll}
                        className="flex items-center justify-center space-x-2 btn-secondary px-6 py-2"
                      >
                        <span>Tümünü Kabul Et</span>
                      </button>
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



'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, Upload, Shield, AlertTriangle, CheckCircle, Loader, RotateCcw, X } from 'lucide-react'
import AdminLayout from '@/components/AdminLayout'

interface BackupSettings {
  enabled: boolean
  intervalHours: number
  intervalMinutes: number
  email: string
  lastBackupTime?: string
  logs: BackupLog[]
}

interface BackupLog {
  id: string
  timestamp: string
  type: 'manual' | 'auto'
  status: 'success' | 'error'
  emailSent: boolean
  fileSize?: string
  errorMessage?: string
}

interface SecurityQuestion {
  question: string
  answer: string
}

const securityQuestions: SecurityQuestion[] = [
  { question: "Türkiye'nin başkenti?", answer: "ankara" },
  { question: "Türkiye'nin en kalabalık şehri?", answer: "istanbul" },
  { question: "Türkiye cumhuriyetinin kurucusu?", answer: "atatürk" }
]

export default function BackupPage() {
  const [isCreatingBackup, setIsCreatingBackup] = useState(false)
  const [isRestoringBackup, setIsRestoringBackup] = useState(false)
  const [isResettingSystem, setIsResettingSystem] = useState(false)
  const [showResetModal, setShowResetModal] = useState(false)
  const [showSecurityModal, setShowSecurityModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [lastBackupResult, setLastBackupResult] = useState<any>(null)
  const [backupStatus, setBackupStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [restoreStatus, setRestoreStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [resetStatus, setResetStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [statusMessage, setStatusMessage] = useState('')
  const [randomQuestions, setRandomQuestions] = useState<SecurityQuestion[]>([])
  const [securityAnswers, setSecurityAnswers] = useState<string[]>([''])
  const [smtpSettings, setSmtpSettings] = useState<any>(null)
  const [autoBackupSettings, setAutoBackupSettings] = useState<BackupSettings>({
    enabled: false,
    intervalHours: 24,
    intervalMinutes: 0,
    email: '',
    logs: []
  })
  const [lastBackupTime, setLastBackupTime] = useState<string | null>(null)

  useEffect(() => {
    const loadSettings = async () => {
      try {

        const smtpResponse = await fetch('/api/smtp')
        if (smtpResponse.ok) {
          const smtpData = await smtpResponse.json()
          setSmtpSettings(smtpData)
        }


        const backupResponse = await fetch('/api/backup/settings')
        if (backupResponse.ok) {
          const backupData = await backupResponse.json()
          setAutoBackupSettings(backupData)
          setLastBackupTime(backupData.lastBackupTime || null)
        }
      } catch (error) {
        console.error('Ayarlar yüklenirken hata:', error)
      }
    }

    loadSettings()
  }, [])


  const saveBackupSettings = async (settings: Partial<BackupSettings>) => {
    try {
      const response = await fetch('/api/backup/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      })

      if (!response.ok) {
        throw new Error('Ayarlar kaydedilemedi')
      }

      const result = await response.json()
      setAutoBackupSettings(result.settings)
      return true
    } catch (error) {
      console.error('Ayarlar kaydetme hatası:', error)
      return false
    }
  }


  const addBackupLog = async (logData: Omit<BackupLog, 'id' | 'timestamp'>) => {
    try {
      await fetch('/api/backup/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(logData),
      })


      const response = await fetch('/api/backup/settings')
      if (response.ok) {
        const data = await response.json()
        setAutoBackupSettings(data)
      }
    } catch (error) {
      console.error('Log ekleme hatası:', error)
    }
  }

  const createBackup = async () => {
    setIsCreatingBackup(true)
    setBackupStatus('idle')
    setStatusMessage('')

    try {
      const response = await fetch('/api/backup', {
        method: 'GET',
      })

      if (!response.ok) {
        throw new Error('Yedekleme oluşturulamadı')
      }

      const backupData: any = await response.json()


      const dataStr = JSON.stringify(backupData, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)

      const link = document.createElement('a')
      link.href = url
      link.download = `restly-backup-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      URL.revokeObjectURL(url)

      setBackupStatus('success')
      setStatusMessage('Yedekleme başarıyla oluşturuldu ve indirildi!')
      setLastBackupTime(new Date().toLocaleString('tr-TR'))


      await addBackupLog({
        type: 'manual',
        status: 'success',
        emailSent: false,
        fileSize: 'Hesaplanamadı'
      })

    } catch (error) {
      console.error('Yedekleme hatası:', error)
      setBackupStatus('error')
      setStatusMessage('Yedekleme oluşturulurken hata oluştu!')


      await addBackupLog({
        type: 'manual',
        status: 'error',
        emailSent: false,
        errorMessage: error instanceof Error ? error.message : 'Bilinmeyen hata'
      })

    } finally {
      setIsCreatingBackup(false)
    }
  }

  const runAutoBackup = async () => {
    try {
      const response = await fetch('/api/backup/auto', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: autoBackupSettings.email || 'admin@restly.com',
          interval: autoBackupSettings.intervalHours
        })
      })

      if (response.ok) {
        const result = await response.json()
        setBackupStatus('success')
        setStatusMessage(`Otomatik yedekleme başarıyla çalıştırıldı! E-posta gönderildi. (${result.fileSize})`)


        setLastBackupResult(result)
        setShowSuccessModal(true)


        await addBackupLog({
          type: 'auto',
          status: 'success',
          emailSent: true,
          fileSize: result.fileSize
        })

      } else {
        throw new Error('Otomatik yedekleme başarısız')
      }
    } catch (error) {
      setBackupStatus('error')
      setStatusMessage('Otomatik yedekleme çalıştırılırken hata oluştu!')
      console.error('Otomatik yedekleme hatası:', error)


      await addBackupLog({
        type: 'auto',
        status: 'error',
        emailSent: false,
        errorMessage: error instanceof Error ? error.message : 'Bilinmeyen hata'
      })
    }
  }

  const restoreBackup = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsRestoringBackup(true)
    setRestoreStatus('idle')
    setStatusMessage('')

    const formData = new FormData(event.currentTarget)
    const file = formData.get('backupFile') as File

    if (!file) {
      setRestoreStatus('error')
      setStatusMessage('Lütfen bir yedekleme dosyası seçin!')
      setIsRestoringBackup(false)
      return
    }

    try {
      const fileContent = await file.text()
      const backupData: any = JSON.parse(fileContent)


      if (!backupData.timestamp || !backupData.version) {
        throw new Error('Geçersiz yedekleme dosyası formatı')
      }

      const response = await fetch('/api/backup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(backupData),
      })

      if (!response.ok) {
        throw new Error('Yedekleme geri yüklenemedi')
      }

      setRestoreStatus('success')
      setStatusMessage('Yedekleme başarıyla geri yüklendi!')


      setTimeout(() => {
        window.location.reload()
      }, 2000)

    } catch (error) {
      console.error('Geri yükleme hatası:', error)
      setRestoreStatus('error')
      setStatusMessage(error instanceof Error ? error.message : 'Yedekleme geri yüklenirken hata oluştu!')
    } finally {
      setIsRestoringBackup(false)
    }
  }

  const resetSystem = async () => {

    const userAnswer = securityAnswers[0].toLowerCase().trim()
    const correctAnswer = randomQuestions[0].answer

    if (userAnswer !== correctAnswer) {
      setResetStatus('error')
      setStatusMessage('Güvenlik sorusu yanlış cevaplandı!')
      return
    }

    setIsResettingSystem(true)
    setResetStatus('idle')
    setStatusMessage('')

    try {
      const response = await fetch('/api/reset', {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Sistem sıfırlanamadı')
      }

      setResetStatus('success')
      setStatusMessage('Sistem başarıyla sıfırlandı! Sayfa yenileniyor...')


      setShowSecurityModal(false)
      setSecurityAnswers([''])

      setTimeout(() => {
        window.location.reload()
      }, 2000)

    } catch (error) {
      console.error('Sistem sıfırlama hatası:', error)
      setResetStatus('error')
      setStatusMessage('Sistem sıfırlanırken hata oluştu!')
    } finally {
      setIsResettingSystem(false)
    }
  }

  const openResetModal = () => {
    setShowResetModal(true)
  }

  const confirmReset = () => {
    setShowResetModal(false)

    const randomIndex = Math.floor(Math.random() * securityQuestions.length)
    setRandomQuestions([securityQuestions[randomIndex]])
    setSecurityAnswers([''])
    setShowSecurityModal(true)
  }

  const cancelReset = () => {
    setShowResetModal(false)
    setShowSecurityModal(false)
    setSecurityAnswers([''])
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-primary-card to-primary-secondary p-6 rounded-xl border border-gray-700 shadow-lg">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-accent-gold to-yellow-500 rounded-lg flex items-center justify-center">
              <Shield size={24} className="text-primary-bg" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-serif font-bold text-text-primary mb-1">
                Sistem Yedekleme
              </h1>
              <p className="text-text-secondary text-sm">
                Sisteminizi yedekleyin veya yedekten geri yükleyin
              </p>
            </div>
          </div>
        </div>

        {(backupStatus !== 'idle' || restoreStatus !== 'idle' || resetStatus !== 'idle') && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-lg border ${
              (backupStatus === 'success' || restoreStatus === 'success' || resetStatus === 'success')
                ? 'bg-green-500/10 border-green-500/30 text-green-400'
                : 'bg-red-500/10 border-red-500/30 text-red-400'
            }`}
          >
            <div className="flex items-center space-x-2">
              {backupStatus === 'success' || restoreStatus === 'success' || resetStatus === 'success' ? (
                <CheckCircle size={20} />
              ) : (
                <AlertTriangle size={20} />
              )}
              <span>{statusMessage}</span>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-primary-card p-6 rounded-xl border border-gray-700">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                <Download size={20} className="text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-serif font-semibold text-text-primary">Yedekleme Oluştur</h3>
                <p className="text-text-secondary text-sm">Sisteminizin tamamını yedekleyin</p>
              </div>
            </div>

            <div className="space-y-4">
              {smtpSettings?.host && (
                <div className="bg-green-500/10 border border-green-500/30 p-3 rounded-lg">
                  <div className="flex items-center space-x-2 text-green-400">
                    <CheckCircle size={16} />
                    <span className="text-sm font-medium">Otomatik Yedekleme Aktif</span>
                  </div>
                  <p className="text-xs text-green-300 mt-1">
                    SMTP ayarları yapılandırılmış - Otomatik yedekleme sistemi çalışıyor
                  </p>
                </div>
              )}

              {lastBackupTime && (
                <div className="bg-primary-secondary p-3 rounded-lg">
                  <p className="text-sm text-text-secondary">
                    <span className="font-medium">Son Yedekleme:</span> {lastBackupTime}
                  </p>
                </div>
              )}

              <div className="bg-primary-secondary p-4 rounded-lg">
                <h4 className="font-medium text-text-primary mb-2">Yedeklenecek Veriler:</h4>
                <ul className="text-sm text-text-secondary space-y-1">
                  <li>• İletişim mesajları</li>
                  <li>• Rezervasyonlar</li>
                  <li>• Menü verileri</li>
                  <li>• Galeri resimleri</li>
                  <li>• Sistem ayarları</li>
                  <li>• SEO ayarları</li>
                </ul>
              </div>

              <button
                onClick={createBackup}
                disabled={isCreatingBackup}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-600/50 text-white px-6 py-3 rounded-lg transition-colors duration-300 flex items-center justify-center space-x-2"
              >
                {isCreatingBackup ? (
                  <>
                    <Loader size={20} className="animate-spin" />
                    <span>Yedekleniyor...</span>
                  </>
                ) : (
                  <>
                    <Download size={20} />
                    <span>Yedekleme Oluştur</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="bg-primary-card p-6 rounded-xl border border-gray-700">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <Upload size={20} className="text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-serif font-semibold text-text-primary">Yedekten Geri Yükle</h3>
                <p className="text-text-secondary text-sm">Yedekleme dosyasından sistemi geri yükleyin</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertTriangle size={16} className="text-red-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-red-400 mb-1">Dikkat!</h4>
                    <p className="text-sm text-red-300">
                      Bu işlem mevcut tüm verilerinizi değiştirecek. Geri dönüşü olmayan bir işlemdir.
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={restoreBackup} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Yedekleme Dosyası
                  </label>
                  <input
                    type="file"
                    name="backupFile"
                    accept=".json"
                    required
                    className="w-full bg-primary-bg border border-gray-600 rounded-lg px-4 py-2 text-text-primary focus:border-accent-gold focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-accent-gold file:text-primary-bg hover:file:bg-yellow-500"
                  />
                  <p className="text-xs text-text-secondary mt-1">
                    Sadece .json formatındaki yedekleme dosyaları kabul edilir
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isRestoringBackup}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white px-6 py-3 rounded-lg transition-colors duration-300 flex items-center justify-center space-x-2"
                >
                  {isRestoringBackup ? (
                    <>
                      <Loader size={20} className="animate-spin" />
                      <span>Geri Yükleniyor...</span>
                    </>
                  ) : (
                    <>
                      <Upload size={20} />
                      <span>Yedekten Geri Yükle</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          <div className="bg-primary-card p-6 rounded-xl border border-gray-700">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center">
                <RotateCcw size={20} className="text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-serif font-semibold text-text-primary">Sistem Sıfırla</h3>
                <p className="text-text-secondary text-sm">Sistemi fabrika ayarlarına döndürün</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertTriangle size={16} className="text-red-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-red-400 mb-1">Tehlikeli İşlem!</h4>
                    <p className="text-sm text-red-300">
                      Bu işlem TÜM verilerinizi kalıcı olarak silecektir. Geri dönüşü yoktur!
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={openResetModal}
                disabled={isResettingSystem}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-600/50 text-white px-6 py-3 rounded-lg transition-colors duration-300 flex items-center justify-center space-x-2"
              >
                {isResettingSystem ? (
                  <>
                    <Loader size={20} className="animate-spin" />
                    <span>Sıfırlanıyor...</span>
                  </>
                ) : (
                  <>
                    <RotateCcw size={20} />
                    <span>Sistemi Sıfırla</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {smtpSettings?.host && (
          <div className="bg-primary-card p-6 rounded-xl border border-gray-700">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <Shield size={20} className="text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg font-serif font-semibold text-text-primary">Otomatik Yedekleme</h3>
                <p className="text-text-secondary text-sm">Düzenli yedekleme ayarları</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Yedekleme Aralığı
                  </label>
                  <div className="flex space-x-2">
                    <select
                      value={autoBackupSettings.intervalHours}
                      onChange={async (e) => {
                        const newValue = parseInt(e.target.value)
                        setAutoBackupSettings(prev => ({ ...prev, intervalHours: newValue }))
                        await saveBackupSettings({ intervalHours: newValue })
                      }}
                      className="flex-1 bg-primary-bg border border-gray-600 rounded-lg px-3 py-2 text-text-primary focus:border-accent-gold focus:outline-none"
                    >
                      <option value={1}>1 Saat</option>
                      <option value={6}>6 Saat</option>
                      <option value={12}>12 Saat</option>
                      <option value={24}>24 Saat</option>
                      <option value={48}>48 Saat</option>
                      <option value={168}>1 Hafta</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Bildirim E-posta
                  </label>
                  <input
                    type="email"
                    value={autoBackupSettings.email}
                    onChange={async (e) => {
                      const newValue = e.target.value
                      setAutoBackupSettings(prev => ({ ...prev, email: newValue }))
                      await saveBackupSettings({ email: newValue })
                    }}
                    className="w-full bg-primary-bg border border-gray-600 rounded-lg px-3 py-2 text-text-primary focus:border-accent-gold focus:outline-none"
                    placeholder="admin@restly.com"
                  />
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-lg">
                <h4 className="font-medium text-blue-400 mb-2">Otomatik Yedekleme Özellikleri</h4>
                <ul className="text-sm text-blue-300 space-y-1">
                  <li>• Düzenli zaman aralıklarında otomatik yedekleme</li>
                  <li>• Yedekleme sonrası e-posta bildirimi</li>
                  <li>• Yedek dosyası e-posta eki olarak gönderilir</li>
                  <li>• Sistem durumu hakkında detaylı rapor</li>
                </ul>
              </div>

              <button
                onClick={runAutoBackup}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors duration-300 flex items-center justify-center space-x-2"
              >
                <Shield size={20} />
                <span>Otomatik Yedekleme Çalıştır</span>
              </button>
            </div>
          </div>
        )}

        {autoBackupSettings.logs && autoBackupSettings.logs.length > 0 && (
          <div className="bg-primary-card p-6 rounded-xl border border-gray-700">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-indigo-500/10 rounded-lg flex items-center justify-center">
                <Shield size={20} className="text-indigo-400" />
              </div>
              <div>
                <h3 className="text-lg font-serif font-semibold text-text-primary">Yedekleme Geçmişi</h3>
                <p className="text-text-secondary text-sm">Son yedekleme işlemleri</p>
              </div>
            </div>

            <div className="space-y-3 max-h-64 overflow-y-auto">
              {autoBackupSettings.logs.slice(0, 10).map((log) => (
                <div key={log.id} className="bg-primary-secondary p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        log.status === 'success'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                      }`}>
                        {log.status === 'success' ? 'Başarılı' : 'Hata'}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        log.type === 'manual'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                          : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
                      }`}>
                        {log.type === 'manual' ? 'Manuel' : 'Otomatik'}
                      </span>
                      {log.emailSent && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                          E-posta Gönderildi
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-text-secondary">
                      {new Date(log.timestamp).toLocaleString('tr-TR')}
                    </span>
                  </div>

                  {log.fileSize && (
                    <p className="text-sm text-text-secondary">
                      <span className="font-medium">Dosya Boyutu:</span> {log.fileSize}
                    </p>
                  )}

                  {log.errorMessage && (
                    <p className="text-sm text-red-400 mt-1">
                      <span className="font-medium">Hata:</span> {log.errorMessage}
                    </p>
                  )}
                </div>
              ))}

              {autoBackupSettings.logs.length === 0 && (
                <div className="text-center py-8 text-text-secondary">
                  <Shield size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Henüz yedekleme geçmişi bulunmuyor</p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="bg-primary-card p-6 rounded-xl border border-gray-700">
          <h3 className="text-lg font-serif font-semibold text-text-primary mb-4">Yedekleme Bilgileri</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-text-primary mb-2">Yedekleme İçeriği</h4>
              <ul className="text-sm text-text-secondary space-y-1">
                <li>• Tüm mesajlar ve rezervasyonlar</li>
                <li>• Menü kategorileri ve ürünleri</li>
                <li>• Galeri resimleri ve açıklamaları</li>
                <li>• İletişim bilgileri ve çalışma saatleri</li>
                <li>• SEO ve SMTP ayarları</li>
                <li>• Hakkımızda sayfası içeriği</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-text-primary mb-2">Güvenlik Notları</h4>
              <ul className="text-sm text-text-secondary space-y-1">
                <li>• Yedekleme dosyalarını güvenli yerde saklayın</li>
                <li>• Geri yükleme işlemi geri alınamaz</li>
                <li>• Büyük yedeklemeler için yeterli disk alanı</li>
                <li>• Düzenli yedekleme alın</li>
              </ul>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {showResetModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-primary-card p-6 rounded-xl border border-gray-700 max-w-md w-full"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center">
                    <AlertTriangle size={24} className="text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-serif font-semibold text-text-primary">Emin misiniz?</h3>
                    <p className="text-text-secondary text-sm">Bu işlem geri alınamaz</p>
                  </div>
                </div>

                <p className="text-text-secondary mb-6">
                  Sistem sıfırlama işlemi tüm verilerinizi kalıcı olarak silecektir. Bu işlem geri alınamaz.
                  Devam etmek istediğinizden emin misiniz?
                </p>

                <div className="flex space-x-3">
                  <button
                    onClick={cancelReset}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors duration-300"
                  >
                    İptal
                  </button>
                  <button
                    onClick={confirmReset}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-300"
                  >
                    Devam Et
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showSuccessModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 20 }}
                transition={{ type: "spring", duration: 0.6, bounce: 0.3 }}
                className="bg-primary-card p-8 rounded-xl border border-gray-700 max-w-md w-full text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
                  className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.4, type: "spring", bounce: 0.6 }}
                  >
                    <CheckCircle size={40} className="text-green-400" />
                  </motion.div>
                </motion.div>

                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="text-2xl font-serif font-bold text-text-primary mb-2"
                >
                  Yedekleme Başarılı!
                </motion.h3>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="text-text-secondary mb-6"
                >
                  Otomatik yedekleme başarıyla oluşturuldu ve e-posta ile gönderildi.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="bg-primary-secondary p-4 rounded-lg mb-6"
                >
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Dosya Boyutu:</span>
                      <span className="text-text-primary font-medium">{lastBackupResult?.fileSize}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Gönderilen E-posta:</span>
                      <span className="text-text-primary font-medium">{autoBackupSettings.email || 'admin@restly.com'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Tarih:</span>
                      <span className="text-text-primary font-medium">{new Date().toLocaleString('tr-TR')}</span>
                    </div>
                  </div>
                </motion.div>

                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9 }}
                  onClick={() => setShowSuccessModal(false)}
                  className="w-full bg-accent-gold hover:bg-yellow-500 text-primary-bg px-6 py-3 rounded-lg transition-colors duration-300 font-medium"
                >
                  Tamam
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AdminLayout>
  )
}


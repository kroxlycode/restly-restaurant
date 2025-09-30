'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Users,
  AlertCircle,
  CheckCircle,
  Clock,
  Calendar,
  Settings,
  Save,
  RefreshCw,
  BarChart3
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import AdminLayout from '@/components/AdminLayout'
import { Switch } from '@/components/ui/Switch'

interface CapacitySettings {
  isEnabled: boolean
  maxGuestsPerSlot: number
  maxTablesPerSlot: number
  averageGuestsPerTable: number
  timeSlots: string[]
  specialDays: {
    date: string
    capacity: number
    reason: string
  }[]
}

interface CapacityStats {
  todayReservations: number
  todayCapacity: number
  todayUtilization: number
  weeklyReservations: number
  weeklyCapacity: number
  weeklyUtilization: number
  popularSlots: {
    time: string
    reservations: number
    utilization: number
  }[]
}

export default function CapacityManagementPage() {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const [settings, setSettings] = useState<CapacitySettings | null>(null)
  const [stats, setStats] = useState<CapacityStats | null>(null)
  const [loadingData, setLoadingData] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null)

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/admin/login')
    }
  }, [isAuthenticated, loading, router])

  useEffect(() => {
    if (isAuthenticated) {
      fetchCapacityData()
    }
  }, [isAuthenticated])

  const fetchCapacityData = async () => {
    try {
      const [settingsRes, statsRes] = await Promise.all([
        fetch('/api/capacity/settings'),
        fetch('/api/capacity/stats')
      ])

      if (settingsRes.ok) {
        const settingsData = await settingsRes.json()
        setSettings(settingsData)
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setStats(statsData)
      }
    } catch (error) {
      console.error('Kapasite verileri alınamadı:', error)
      setMessage({type: 'error', text: 'Veriler yüklenirken hata oluştu'})
    } finally {
      setLoadingData(false)
    }
  }

  const handleToggleCapacity = async (checked: boolean) => {
    if (!settings) return

    setSaving(true)
    try {
      const response = await fetch('/api/capacity/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...settings,
          isEnabled: checked
        })
      })

      if (response.ok) {
        setSettings(prev => prev ? {...prev, isEnabled: checked} : null)
        setMessage({
          type: 'success',
          text: `Kapasite ${checked ? 'açıldı' : 'kapatıldı'}`
        })
      } else {
        throw new Error('Ayarlar kaydedilemedi')
      }
    } catch (error) {
      setMessage({type: 'error', text: 'Ayarlar kaydedilemedi'})
    } finally {
      setSaving(false)
    }
  }

  const handleSaveSettings = async () => {
    if (!settings) return

    setSaving(true)
    try {
      const response = await fetch('/api/capacity/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings)
      })

      if (response.ok) {
        setMessage({type: 'success', text: 'Ayarlar başarıyla kaydedildi'})
      } else {
        throw new Error('Ayarlar kaydedilemedi')
      }
    } catch (error) {
      setMessage({type: 'error', text: 'Ayarlar kaydedilemedi'})
    } finally {
      setSaving(false)
    }
  }

  const updateSetting = (key: keyof CapacitySettings, value: any) => {
    if (!settings) return
    setSettings(prev => prev ? {...prev, [key]: value} : null)
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

  if (loadingData || !settings || !stats) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-accent-gold">Veriler yükleniyor...</div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-primary-card to-primary-secondary p-6 rounded-xl border border-gray-700 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-accent-gold to-yellow-500 rounded-lg flex items-center justify-center">
                <Users size={24} className="text-primary-bg" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-serif font-bold text-text-primary mb-1">
                  Kapasite Yönetimi
                </h1>
                <p className="text-text-secondary text-sm">
                  Restoran kapasitesini ve rezervasyon ayarlarını yönetin
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={fetchCapacityData}
                className="flex items-center space-x-2 text-text-secondary hover:text-accent-gold transition-colors duration-300"
                title="Yenile"
              >
                <RefreshCw size={18} />
              </button>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg border ${
            settings.isEnabled
              ? 'bg-green-500/10 border-green-500/30'
              : 'bg-red-500/10 border-red-500/30'
          }`}
        >
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-3">
              {settings.isEnabled ? (
                <CheckCircle size={20} className="text-green-500" />
              ) : (
                <AlertCircle size={20} className="text-red-500" />
              )}
              <div>
                <h3 className={`font-semibold ${
                  settings.isEnabled ? 'text-green-500' : 'text-red-500'
                }`}>
                  {settings.isEnabled ? 'Kapasite Aktif' : 'Kapasite Kapalı'}
                </h3>
                <p className="text-text-secondary text-sm">
                  {settings.isEnabled
                    ? 'Rezervasyonlar kapasite kontrolü ile alınıyor'
                    : 'Kapasite kontrolü devre dışı - tüm rezervasyonlar kabul ediliyor'
                  }
                </p>
              </div>
              <div className="ml-auto">
                <Switch
                  checked={settings.isEnabled}
                  onCheckedChange={handleToggleCapacity}
                  disabled={saving}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {message && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`p-4 rounded-lg border ${
              message.type === 'success'
                ? 'bg-green-500/10 border-green-500/30'
                : 'bg-red-500/10 border-red-500/30'
            }`}
          >
            <div className="flex items-center space-x-2">
              {message.type === 'success' ? (
                <CheckCircle size={16} className="text-green-500" />
              ) : (
                <AlertCircle size={16} className="text-red-500" />
              )}
              <span className={
                message.type === 'success' ? 'text-green-500' : 'text-red-500'
              }>
                {message.text}
              </span>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-primary-card to-primary-secondary rounded-xl p-6 shadow-lg border border-gray-700">
              <div className="flex items-center space-x-3 mb-6">
                <Settings size={20} className="text-accent-gold" />
                <h2 className="text-lg font-serif font-semibold text-text-primary">
                  Kapasite Ayarları
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Saat Başına Maksimum Kişi Sayısı
                  </label>
                  <input
                    type="number"
                    value={settings.maxGuestsPerSlot}
                    onChange={(e) => updateSetting('maxGuestsPerSlot', parseInt(e.target.value))}
                    className="w-full bg-primary-bg border border-gray-600 rounded-lg px-3 py-2 text-text-primary focus:border-accent-gold focus:outline-none"
                    min="1"
                    max="200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Saat Başına Maksimum Masa Sayısı
                  </label>
                  <input
                    type="number"
                    value={settings.maxTablesPerSlot}
                    onChange={(e) => updateSetting('maxTablesPerSlot', parseInt(e.target.value))}
                    className="w-full bg-primary-bg border border-gray-600 rounded-lg px-3 py-2 text-text-primary focus:border-accent-gold focus:outline-none"
                    min="1"
                    max="50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Ortalama Masa Başına Kişi Sayısı
                  </label>
                  <input
                    type="number"
                    value={settings.averageGuestsPerTable}
                    onChange={(e) => updateSetting('averageGuestsPerTable', parseFloat(e.target.value))}
                    className="w-full bg-primary-bg border border-gray-600 rounded-lg px-3 py-2 text-text-primary focus:border-accent-gold focus:outline-none"
                    min="1"
                    max="10"
                    step="0.1"
                  />
                </div>

                <div className="pt-4">
                  <button
                    onClick={handleSaveSettings}
                    disabled={saving}
                    className="w-full flex items-center justify-center space-x-2 bg-accent-gold hover:bg-yellow-500 text-primary-bg py-3 px-4 rounded-lg transition-colors duration-300 disabled:opacity-50"
                  >
                    {saving ? (
                      <RefreshCw size={18} className="animate-spin" />
                    ) : (
                      <Save size={18} />
                    )}
                    <span>Ayarları Kaydet</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-primary-card to-primary-secondary rounded-xl p-6 shadow-lg border border-gray-700">
              <div className="flex items-center space-x-3 mb-6">
                <BarChart3 size={20} className="text-accent-gold" />
                <h2 className="text-lg font-serif font-semibold text-text-primary">
                  Kapasite İstatistikleri
                </h2>
              </div>

              <div className="space-y-4">
                <div className="bg-primary-bg rounded-lg p-4 border border-gray-600">
                  <h3 className="font-semibold text-text-primary mb-3 flex items-center space-x-2">
                    <Calendar size={16} />
                    <span>Bugün</span>
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-text-secondary text-sm">Rezervasyon</p>
                      <p className="text-lg font-bold text-accent-gold">{stats.todayReservations}</p>
                    </div>
                    <div>
                      <p className="text-text-secondary text-sm">Kapasite</p>
                      <p className="text-lg font-bold text-text-primary">{stats.todayCapacity}</p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-text-secondary">Doluluk</span>
                      <span className="text-accent-gold">{stats.todayUtilization.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-accent-gold h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(stats.todayUtilization, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-primary-bg rounded-lg p-4 border border-gray-600">
                  <h3 className="font-semibold text-text-primary mb-3 flex items-center space-x-2">
                    <Clock size={16} />
                    <span>Bu Hafta</span>
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-text-secondary text-sm">Rezervasyon</p>
                      <p className="text-lg font-bold text-accent-gold">{stats.weeklyReservations}</p>
                    </div>
                    <div>
                      <p className="text-text-secondary text-sm">Kapasite</p>
                      <p className="text-lg font-bold text-text-primary">{stats.weeklyCapacity}</p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-text-secondary">Doluluk</span>
                      <span className="text-accent-gold">{stats.weeklyUtilization.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-accent-gold h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(stats.weeklyUtilization, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-primary-bg rounded-lg p-4 border border-gray-600">
                  <h3 className="font-semibold text-text-primary mb-3">
                    Popüler Saatler
                  </h3>
                  <div className="space-y-2">
                    {stats.popularSlots.slice(0, 3).map((slot, index) => (
                      <div key={slot.time} className="flex items-center justify-between">
                        <span className="text-text-secondary text-sm">{slot.time}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-accent-gold text-sm">{slot.reservations} rez.</span>
                          <div className="w-16 bg-gray-700 rounded-full h-1">
                            <div
                              className="bg-accent-gold h-1 rounded-full transition-all duration-300"
                              style={{ width: `${Math.min(slot.utilization, 100)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

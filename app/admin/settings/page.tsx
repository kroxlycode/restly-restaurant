'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Mail, Settings, Phone } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import AdminLayout from '@/components/AdminLayout'
import SmtpSettingsForm from '@/components/admin/SmtpSettingsForm'
import ContactSettingsForm from '@/components/admin/ContactSettingsForm'
import TimesSettingsForm from '@/components/admin/TimesSettingsForm'
import SeoSettingsForm from '@/components/admin/SeoSettingsForm'

interface SmtpSettings {
  host: string
  port: number
  secure: boolean
  user: string
  pass: string
  fromName: string
  fromEmail: string
}

interface DaySchedule {
  open: string
  close: string
  isOpen: boolean
}

interface TimesSettings {
  weekdays: DaySchedule
  saturday: DaySchedule
  sunday: DaySchedule
}

interface SeoSettings {
  siteTitle: string
  metaTitle: string
  metaDescription: string
  footerDescription: string
  faviconUrl: string
  socialLinks: {
    facebook: string
    instagram: string
    twitter: string
    linkedin: string
  }
}

interface ContactSettings {
  location: string
  phone: string
  email: string
  googleMapsUrl: string
}

export default function AdminSettingsPage() {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const [settings, setSettings] = useState<SmtpSettings>({
    host: '',
    port: 587,
    secure: false,
    user: '',
    pass: '',
    fromName: '',
    fromEmail: ''
  })
  const [timesSettings, setTimesSettings] = useState<TimesSettings>({
    weekdays: { open: '11:00', close: '23:00', isOpen: true },
    saturday: { open: '12:00', close: '01:00', isOpen: true },
    sunday: { open: '12:00', close: '22:00', isOpen: true }
  })
  const [contactSettings, setContactSettings] = useState<ContactSettings>({
    location: '',
    phone: '',
    email: '',
    googleMapsUrl: ''
  })
  const [seoSettings, setSeoSettings] = useState<SeoSettings>({
    siteTitle: '',
    metaTitle: '',
    metaDescription: '',
    footerDescription: '',
    faviconUrl: '',
    socialLinks: {
      facebook: '',
      instagram: '',
      twitter: '',
      linkedin: ''
    }
  })
  const [saving, setSaving] = useState(false)
  const [savingTimes, setSavingTimes] = useState(false)
  const [savingContact, setSavingContact] = useState(false)
  const [savingSeo, setSavingSeo] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [timesMessage, setTimesMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [contactMessage, setContactMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [seoMessage, setSeoMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/admin/login')
    }
  }, [isAuthenticated, loading, router])

  useEffect(() => {
    if (isAuthenticated) {
      fetchSettings()
      fetchTimesSettings()
      fetchContactSettings()
      fetchSeoSettings()
    }
  }, [isAuthenticated])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/smtp')
      if (response.ok) {
        const data = await response.json()
        setSettings(data)
      }
    } catch (error) {
      console.error('SMTP ayarları yüklenemedi:', error)
    }
  }

  const fetchTimesSettings = async () => {
    try {
      const response = await fetch('/api/times')
      if (response.ok) {
        const data = await response.json()
        setTimesSettings(data)
      }
    } catch (error) {
      console.error('Çalışma saatleri yüklenemedi:', error)
    }
  }

  const fetchContactSettings = async () => {
    try {
      const response = await fetch('/api/contact')
      if (response.ok) {
        const data = await response.json()
        setContactSettings(data)
      }
    } catch (error) {
      console.error('İletişim ayarları yüklenemedi:', error)
    }
  }

  const fetchSeoSettings = async () => {
    try {
      const response = await fetch('/api/seo')
      if (response.ok) {
        const data = await response.json()
        setSeoSettings(data)
      }
    } catch (error) {
      console.error('SEO ayarları yüklenemedi:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch('/api/smtp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      })

      if (response.ok) {
        setMessage({ type: 'success', text: 'SMTP ayarları başarıyla kaydedildi' })
        setTimeout(() => setMessage(null), 3000)
      } else {
        throw new Error('Ayarlar kaydedilemedi')
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'SMTP ayarları kaydedilirken hata oluştu' })
    } finally {
      setSaving(false)
    }
  }

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSavingContact(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactSettings),
      })

      if (response.ok) {
        setContactMessage({ type: 'success', text: 'İletişim bilgileri başarıyla kaydedildi' })
        setTimeout(() => setContactMessage(null), 3000)
      } else {
        throw new Error('İletişim bilgileri kaydedilemedi')
      }
    } catch (error) {
      setContactMessage({ type: 'error', text: 'İletişim bilgileri kaydedilirken hata oluştu' })
      setTimeout(() => setContactMessage(null), 3000)
    } finally {
      setSavingContact(false)
    }
  }

  const handleTimesSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSavingTimes(true)

    try {
      const response = await fetch('/api/times', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(timesSettings),
      })

      if (response.ok) {
        setTimesMessage({ type: 'success', text: 'Çalışma saatleri başarıyla kaydedildi' })
        setTimeout(() => setTimesMessage(null), 3000)
      } else {
        throw new Error('Çalışma saatleri kaydedilemedi')
      }
    } catch (error) {
      setTimesMessage({ type: 'error', text: 'Çalışma saatleri kaydedilirken hata oluştu' })
      setTimeout(() => setTimesMessage(null), 3000)
    } finally {
      setSavingTimes(false)
    }
  }

  const handleSeoSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSavingSeo(true)

    try {
      const response = await fetch('/api/seo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(seoSettings),
      })

      if (response.ok) {
        setSeoMessage({ type: 'success', text: 'SEO ayarları başarıyla kaydedildi' })
        setTimeout(() => setSeoMessage(null), 3000)
      } else {
        throw new Error('SEO ayarları kaydedilemedi')
      }
    } catch (error) {
      setSeoMessage({ type: 'error', text: 'SEO ayarları kaydedilirken hata oluştu' })
      setTimeout(() => setSeoMessage(null), 3000)
    } finally {
      setSavingSeo(false)
    }
  }

  const handleTimesInputChange = (group: 'weekdays' | 'saturday' | 'sunday', field: keyof DaySchedule, value: string | boolean) => {
    setTimesSettings(prev => ({
      ...prev,
      [group]: {
        ...prev[group],
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
              <Settings size={24} className="text-primary-bg" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-serif font-bold text-text-primary mb-1">
                Sistem Ayarları
              </h1>
              <p className="text-text-secondary text-sm">
                SMTP ayarları, iletişim bilgileri ve çalışma saatlerini yapılandırın
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

        {timesMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`p-4 rounded-lg border ${timesMessage.type === 'success'
              ? 'bg-green-500/10 border-green-500/30'
              : 'bg-red-500/10 border-red-500/30'
              }`}
          >
            <div className="flex items-center space-x-2">
              {timesMessage.type === 'success' ? (
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              ) : (
                <div className="w-5 h-5 bg-red-500 rounded-full"></div>
              )}
              <span className={
                timesMessage.type === 'success' ? 'text-green-500' : 'text-red-500'
              }>
                {timesMessage.text}
              </span>
            </div>
          </motion.div>
        )}

        {contactMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`p-4 rounded-lg border ${contactMessage.type === 'success'
              ? 'bg-green-500/10 border-green-500/30'
              : 'bg-red-500/10 border-red-500/30'
              }`}
          >
            <div className="flex items-center space-x-2">
              {contactMessage.type === 'success' ? (
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              ) : (
                <div className="w-5 h-5 bg-red-500 rounded-full"></div>
              )}
              <span className={
                contactMessage.type === 'success' ? 'text-green-500' : 'text-red-500'
              }>
                {contactMessage.text}
              </span>
            </div>
          </motion.div>
        )}

        {seoMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`p-4 rounded-lg border ${seoMessage.type === 'success'
              ? 'bg-green-500/10 border-green-500/30'
              : 'bg-red-500/10 border-red-500/30'
              }`}
          >
            <div className="flex items-center space-x-2">
              {seoMessage.type === 'success' ? (
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              ) : (
                <div className="w-5 h-5 bg-red-500 rounded-full"></div>
              )}
              <span className={
                seoMessage.type === 'success' ? 'text-green-500' : 'text-red-500'
              }>
                {seoMessage.text}
              </span>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          <SmtpSettingsForm
            settings={settings}
            onSettingsChange={(field, value) => {
              setSettings(prev => ({
                ...prev,
                [field]: value
              }))
            }}
            onSubmit={handleSubmit}
            saving={saving}
          />

          <ContactSettingsForm
            settings={contactSettings}
            onSettingsChange={(field, value) => {
              let formattedValue = value


              if (field === 'phone') {

                const digitsOnly = value.replace(/[^\d+]/g, '')

                if (digitsOnly.startsWith('+90')) {

                  const digits = digitsOnly.substring(3)
                  if (digits.length <= 3) {
                    formattedValue = `+90 ${digits}`
                  } else if (digits.length <= 6) {
                    formattedValue = `+90 ${digits.substring(0, 3)} ${digits.substring(3)}`
                  } else if (digits.length <= 8) {
                    formattedValue = `+90 ${digits.substring(0, 3)} ${digits.substring(3, 6)} ${digits.substring(6)}`
                  } else {
                    formattedValue = `+90 ${digits.substring(0, 3)} ${digits.substring(3, 6)} ${digits.substring(6, 8)} ${digits.substring(8, 10)}`
                  }
                } else if (digitsOnly.startsWith('90')) {

                  const digits = digitsOnly.substring(2)
                  if (digits.length <= 3) {
                    formattedValue = `+90 ${digits}`
                  } else if (digits.length <= 6) {
                    formattedValue = `+90 ${digits.substring(0, 3)} ${digits.substring(3)}`
                  } else if (digits.length <= 8) {
                    formattedValue = `+90 ${digits.substring(0, 3)} ${digits.substring(3, 6)} ${digits.substring(6)}`
                  } else {
                    formattedValue = `+90 ${digits.substring(0, 3)} ${digits.substring(3, 6)} ${digits.substring(6, 8)} ${digits.substring(8, 10)}`
                  }
                } else if (digitsOnly.startsWith('0')) {

                  const digits = digitsOnly.substring(1)
                  if (digits.length <= 3) {
                    formattedValue = `+90 ${digits}`
                  } else if (digits.length <= 6) {
                    formattedValue = `+90 ${digits.substring(0, 3)} ${digits.substring(3)}`
                  } else if (digits.length <= 8) {
                    formattedValue = `+90 ${digits.substring(0, 3)} ${digits.substring(3, 6)} ${digits.substring(6)}`
                  } else {
                    formattedValue = `+90 ${digits.substring(0, 3)} ${digits.substring(3, 6)} ${digits.substring(6, 8)} ${digits.substring(8, 10)}`
                  }
                } else if (digitsOnly.length > 0 && !digitsOnly.startsWith('+')) {

                  if (digitsOnly.length <= 3) {
                    formattedValue = `+90 ${digitsOnly}`
                  } else if (digitsOnly.length <= 6) {
                    formattedValue = `+90 ${digitsOnly.substring(0, 3)} ${digitsOnly.substring(3)}`
                  } else if (digitsOnly.length <= 8) {
                    formattedValue = `+90 ${digitsOnly.substring(0, 3)} ${digitsOnly.substring(3, 6)} ${digitsOnly.substring(6)}`
                  } else {
                    formattedValue = `+90 ${digitsOnly.substring(0, 3)} ${digitsOnly.substring(3, 6)} ${digitsOnly.substring(6, 8)} ${digitsOnly.substring(8, 10)}`
                  }
                }
              }

              setContactSettings(prev => ({
                ...prev,
                [field]: formattedValue
              }))
            }}
            onSubmit={handleContactSubmit}
            saving={savingContact}
          />

          <TimesSettingsForm
            settings={timesSettings}
            onSettingsChange={handleTimesInputChange}
            onSubmit={handleTimesSubmit}
            saving={savingTimes}
          />

          <SeoSettingsForm
            settings={seoSettings}
            onSettingsChange={(field: string, value: string) => {
              if (field.startsWith('socialLinks.')) {
                const socialField = field.split('.')[1]
                setSeoSettings(prev => ({
                  ...prev,
                  socialLinks: {
                    ...prev.socialLinks,
                    [socialField]: value
                  }
                }))
              } else {
                setSeoSettings(prev => ({
                  ...prev,
                  [field]: value
                }))
              }
            }}
            onSubmit={handleSeoSubmit}
            saving={savingSeo}
          />
        </div>

      </div>
    </AdminLayout>
  )
}


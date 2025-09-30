'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Mail, Key, Server, Save, Eye, EyeOff } from 'lucide-react'

interface SmtpSettings {
  host: string
  port: number
  secure: boolean
  user: string
  pass: string
  fromName: string
  fromEmail: string
}

interface SmtpSettingsFormProps {
  settings: SmtpSettings
  onSettingsChange: (field: keyof SmtpSettings, value: string | number | boolean) => void
  onSubmit: (e: React.FormEvent) => void
  saving: boolean
}

export default function SmtpSettingsForm({ settings, onSettingsChange, onSubmit, saving }: SmtpSettingsFormProps) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="bg-gradient-to-br from-primary-card to-primary-secondary rounded-xl p-6 shadow-lg border border-gray-700">
      <form onSubmit={onSubmit} className="space-y-6">
        <h2 className="text-xl font-serif font-semibold text-text-primary mb-4 flex items-center space-x-2">
          <Mail size={20} className="text-accent-gold" />
          <span>SMTP Ayarları</span>
        </h2>

        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              SMTP Sunucu Adresi
            </label>
            <div className="relative">
              <Server size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" />
              <input
                type="text"
                value={settings.host}
                onChange={(e) => onSettingsChange('host', e.target.value)}
                className="w-full bg-primary-bg border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-text-primary focus:border-accent-gold focus:outline-none"
                placeholder="smtp.gmail.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Port
            </label>
            <input
              type="number"
              value={settings.port}
              onChange={(e) => onSettingsChange('port', parseInt(e.target.value))}
              className="w-full bg-primary-bg border border-gray-600 rounded-lg px-3 py-2 text-text-primary focus:border-accent-gold focus:outline-none"
              placeholder="587"
              min="1"
              max="65535"
              required
            />
          </div>
        </div>

        
        <div>
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={settings.secure}
              onChange={(e) => onSettingsChange('secure', e.target.checked)}
              className="w-4 h-4 text-accent-gold bg-primary-bg border-gray-600 rounded focus:ring-accent-gold focus:ring-2"
            />
            <span className="text-sm font-medium text-text-secondary">
              Güvenli Bağlantı (SSL/TLS)
            </span>
          </label>
        </div>

        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Kullanıcı Adı
            </label>
            <input
              type="email"
              value={settings.user}
              onChange={(e) => onSettingsChange('user', e.target.value)}
              className="w-full bg-primary-bg border border-gray-600 rounded-lg px-3 py-2 text-text-primary focus:border-accent-gold focus:outline-none"
              placeholder="your-email@gmail.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Şifre
            </label>
            <div className="relative">
              <Key size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={settings.pass}
                onChange={(e) => onSettingsChange('pass', e.target.value)}
                className="w-full bg-primary-bg border border-gray-600 rounded-lg pl-10 pr-12 py-2 text-text-primary focus:border-accent-gold focus:outline-none"
                placeholder="Uygulama şifresi"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-accent-gold"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
        </div>

        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Gönderen Adı
            </label>
            <input
              type="text"
              value={settings.fromName}
              onChange={(e) => onSettingsChange('fromName', e.target.value)}
              className="w-full bg-primary-bg border border-gray-600 rounded-lg px-3 py-2 text-text-primary focus:border-accent-gold focus:outline-none"
              placeholder="Restoran Adı"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Gönderen E-posta
            </label>
            <input
              type="email"
              value={settings.fromEmail}
              onChange={(e) => onSettingsChange('fromEmail', e.target.value)}
              className="w-full bg-primary-bg border border-gray-600 rounded-lg px-3 py-2 text-text-primary focus:border-accent-gold focus:outline-none"
              placeholder="info@restoran.com"
              required
            />
          </div>
        </div>

        
        <div className="flex justify-end pt-4 border-t border-gray-700">
          <button
            type="submit"
            disabled={saving}
            className="bg-accent-gold hover:bg-yellow-500 text-primary-bg px-6 py-3 rounded-lg transition-colors duration-300 disabled:opacity-50 flex items-center space-x-2"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-primary-bg border-t-transparent rounded-full animate-spin"></div>
                <span>Kaydediliyor...</span>
              </>
            ) : (
              <>
                <Save size={18} />
                <span>Ayarları Kaydet</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}


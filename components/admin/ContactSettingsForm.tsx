'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { MessageSquare, MapPin, Phone, Mail, Save } from 'lucide-react'

interface ContactSettings {
  location: string
  phone: string
  email: string
  googleMapsUrl: string
}

interface ContactSettingsFormProps {
  settings: ContactSettings
  onSettingsChange: (field: keyof ContactSettings, value: string) => void
  onSubmit: (e: React.FormEvent) => void
  saving: boolean
}

export default function ContactSettingsForm({ settings, onSettingsChange, onSubmit, saving }: ContactSettingsFormProps) {

  return (
    <div className="bg-gradient-to-br from-primary-card to-primary-secondary rounded-xl p-6 shadow-lg border border-gray-700">
      <form onSubmit={onSubmit} className="space-y-6">
        <h2 className="text-xl font-serif font-semibold text-text-primary mb-4 flex items-center space-x-2">
          <MessageSquare size={20} className="text-accent-gold" />
          <span>İletişim Bilgileri</span>
        </h2>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Konum Bilgisi
          </label>
          <div className="relative">
            <MapPin size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" />
            <textarea
              value={settings.location}
              onChange={(e) => onSettingsChange('location', e.target.value)}
              className="w-full bg-primary-bg border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-text-primary focus:border-accent-gold focus:outline-none resize-none"
              placeholder="Nişantaşı Mah. Teşvikiye Cad. No:123 Şişli/İstanbul"
              rows={3}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Telefon Numarası
          </label>
          <div className="relative">
            <Phone size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" />
            <input
              type="tel"
              value={settings.phone}
              onChange={(e) => onSettingsChange('phone', e.target.value)}
              className="w-full bg-primary-bg border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-text-primary focus:border-accent-gold focus:outline-none"
              placeholder="+90 555 555 55 55"
              required
            />
          </div>
          <p className="text-xs text-text-secondary mt-1">
            Format: +90 555 555 55 55
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            E-posta Adresi
          </label>
          <div className="relative">
            <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" />
            <input
              type="email"
              value={settings.email}
              onChange={(e) => onSettingsChange('email', e.target.value)}
              className="w-full bg-primary-bg border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-text-primary focus:border-accent-gold focus:outline-none"
              placeholder="info@restly.com"
              required
            />
          </div>
        </div>
        <div>
          <label className='block text-sm font-medium text-text-secondary mb-2'>
            Google Haritası URL
          </label>
          <div className="relative">
            <MapPin size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" />
            <input
              type="url"
              value={settings.googleMapsUrl}
              onChange={(e) => onSettingsChange('googleMapsUrl', e.target.value)}
              className="w-full bg-primary-bg border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-text-primary focus:border-accent-gold focus:outline-none"
              placeholder="https://www.google.com/maps"
              required
            />
          </div>
          <p className="text-xs text-text-secondary mt-1">
            Google haritalara girdikten sonra paylaş butonuna basın ve harita yerleştirmeden src=&quot;&quot; içindeki url kopyalayıp buraya yapıştırın.
          </p>
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
                <span>Bilgileri Kaydet</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}


'use client'

import { useState } from 'react'
import { Save, Globe, FileText, Share2, Upload, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'

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
  }
}

interface SeoSettingsFormProps {
  settings: SeoSettings
  onSettingsChange: (field: string, value: string) => void
  onSubmit: (e: React.FormEvent) => void
  saving: boolean
}

export default function SeoSettingsForm({ settings, onSettingsChange, onSubmit, saving }: SeoSettingsFormProps) {
  const [activeTab, setActiveTab] = useState<'general' | 'social' | 'favicon'>('general')

  return (
    <div className="bg-primary-card p-6 rounded-xl border border-gray-700 shadow-lg">
      <h2 className="text-xl font-serif font-semibold text-text-primary mb-4 flex items-center space-x-2">
        <Globe size={20} className="text-accent-gold" />
        <span>SEO Ayarları</span>
      </h2>

      
      <div className="flex space-x-1 mb-6 bg-primary-secondary p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('general')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 ${activeTab === 'general'
              ? 'bg-accent-gold text-primary-bg'
              : 'text-text-secondary hover:text-text-primary'
            }`}
        >
          Genel
        </button>
        <button
          onClick={() => setActiveTab('social')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 ${activeTab === 'social'
              ? 'bg-accent-gold text-primary-bg'
              : 'text-text-secondary hover:text-text-primary'
            }`}
        >
          Sosyal Ağ
        </button>
        <button
          onClick={() => setActiveTab('favicon')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 ${activeTab === 'favicon'
              ? 'bg-accent-gold text-primary-bg'
              : 'text-text-secondary hover:text-text-primary'
            }`}
        >
          Favicon
        </button>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        {activeTab === 'general' && (
          <div className="space-y-4">
            
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Site Başlığı
              </label>
              <div className="relative">
                <Globe size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" />
                <input
                  type="text"
                  value={settings.siteTitle}
                  onChange={(e) => onSettingsChange('siteTitle', e.target.value)}
                  className="w-full bg-primary-bg border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-text-primary focus:border-accent-gold focus:outline-none"
                  placeholder="Restly Restaurant"
                  required
                />
              </div>
            </div>

            
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Meta Başlık (SEO)
              </label>
              <div className="relative">
                <FileText size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" />
                <input
                  type="text"
                  value={settings.metaTitle}
                  onChange={(e) => onSettingsChange('metaTitle', e.target.value)}
                  className="w-full bg-primary-bg border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-text-primary focus:border-accent-gold focus:outline-none"
                  placeholder="Restly Restaurant | İstanbul'un En İyi Restoranı"
                  maxLength={60}
                  required
                />
              </div>
              <p className="text-xs text-text-secondary mt-1">
                {settings.metaTitle.length}/60 karakter (SEO için ideal)
              </p>
            </div>

            
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Meta Açıklama (SEO)
              </label>
              <textarea
                value={settings.metaDescription}
                onChange={(e) => onSettingsChange('metaDescription', e.target.value)}
                rows={3}
                className="w-full bg-primary-bg border border-gray-600 rounded-lg px-4 py-2 text-text-primary focus:border-accent-gold focus:outline-none resize-none"
                placeholder="Modern gastronomi ile geleneksel lezzetleri..."
                maxLength={160}
                required
              />
              <p className="text-xs text-text-secondary mt-1">
                {settings.metaDescription.length}/160 karakter (SEO için ideal)
              </p>
            </div>

            
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Footer Açıklaması
              </label>
              <textarea
                value={settings.footerDescription}
                onChange={(e) => onSettingsChange('footerDescription', e.target.value)}
                rows={3}
                className="w-full bg-primary-bg border border-gray-600 rounded-lg px-4 py-2 text-text-primary focus:border-accent-gold focus:outline-none resize-none"
                placeholder="Modern gastronomi ile geleneksel lezzetleri..."
                required
              />
            </div>
          </div>
        )}

        {activeTab === 'social' && (
          <div className="space-y-4">
            
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Facebook
              </label>
              <div className="relative">
                <Share2 size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" />
                <input
                  type="url"
                  value={settings.socialLinks.facebook}
                  onChange={(e) => onSettingsChange('socialLinks.facebook', e.target.value)}
                  className="w-full bg-primary-bg border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-text-primary focus:border-accent-gold focus:outline-none"
                  placeholder="https://facebook.com/restlyrestaurant"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Instagram
              </label>
              <div className="relative">
                <Share2 size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" />
                <input
                  type="url"
                  value={settings.socialLinks.instagram}
                  onChange={(e) => onSettingsChange('socialLinks.instagram', e.target.value)}
                  className="w-full bg-primary-bg border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-text-primary focus:border-accent-gold focus:outline-none"
                  placeholder="https://instagram.com/restlyrestaurant"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Twitter
              </label>
              <div className="relative">
                <Share2 size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" />
                <input
                  type="url"
                  value={settings.socialLinks.twitter}
                  onChange={(e) => onSettingsChange('socialLinks.twitter', e.target.value)}
                  className="w-full bg-primary-bg border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-text-primary focus:border-accent-gold focus:outline-none"
                  placeholder="https://twitter.com/restlyrestaurant"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'favicon' && (
          <div className="space-y-6">
            
            {settings.faviconUrl && (
              <div className="text-center">
                <label className="block text-sm font-medium text-text-secondary mb-4">
                  Mevcut Favicon
                </label>
                <div className="inline-block p-4 bg-primary-secondary rounded-lg">
                  <Image
                    src={settings.faviconUrl}
                    alt="Mevcut Favicon"
                    width={64}
                    height={64}
                    className="w-16 h-16 rounded"
                    onError={(e) => {
                      e.currentTarget.src = '/favicon.svg'
                    }}
                  />
                </div>
                <p className="text-xs text-text-secondary mt-2">
                  32x32 piksel (favicon için optimize edilmiş)
                </p>
              </div>
            )}

            
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Favicon Yükleme
              </label>
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center bg-gray-800/50">
                <Upload size={48} className="text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400 text-sm">
                  Dosya yükleme bakımda
                </p>
              </div>
            </div>

            
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Favicon URL (Manuel)
              </label>
              <div className="relative">
                <ImageIcon size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" />
                <input
                  type="url"
                  value={settings.faviconUrl}
                  onChange={(e) => onSettingsChange('faviconUrl', e.target.value)}
                  className="w-full bg-primary-bg border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-text-primary focus:border-accent-gold focus:outline-none"
                  placeholder="https://example.com/favicon.png"
                />
              </div>
              <p className="text-xs text-text-secondary mt-1">
                Cloudinary URL&apos;si veya harici favicon URL&apos;si
              </p>
            </div>
          </div>
        )}

        
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
                <span>SEO Ayarlarını Kaydet</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}


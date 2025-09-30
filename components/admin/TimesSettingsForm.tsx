'use client'

import { motion } from 'framer-motion'
import { Clock, Calendar, Save } from 'lucide-react'

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

interface TimesSettingsFormProps {
  settings: TimesSettings
  onSettingsChange: (group: 'weekdays' | 'saturday' | 'sunday', field: keyof DaySchedule, value: string | boolean) => void
  onSubmit: (e: React.FormEvent) => void
  saving: boolean
}

export default function TimesSettingsForm({ settings, onSettingsChange, onSubmit, saving }: TimesSettingsFormProps) {
  return (
    <div className="bg-gradient-to-br from-primary-card to-primary-secondary rounded-xl p-6 shadow-lg border border-gray-700">
      <form onSubmit={onSubmit} className="space-y-6">
        <h2 className="text-xl font-serif font-semibold text-text-primary mb-4 flex items-center space-x-2">
          <Clock size={20} className="text-accent-gold" />
          <span>Çalışma Saatleri</span>
        </h2>

        
        <div className="space-y-6">
          
          <div className="bg-primary-bg rounded-lg p-4 border border-gray-600">
            <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center space-x-2">
              <Calendar size={18} className="text-accent-gold" />
              <span>Pazartesi - Cuma (Hafta İçi)</span>
            </h3>

            <div className="flex items-center justify-between mb-3">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={settings.weekdays.isOpen}
                  onChange={(e) => onSettingsChange('weekdays', 'isOpen', e.target.checked)}
                  className="w-4 h-4 text-accent-gold bg-primary-bg border-gray-600 rounded focus:ring-accent-gold focus:ring-2"
                />
                <span className="text-sm font-medium text-text-secondary">
                  {settings.weekdays.isOpen ? 'Açık' : 'Kapalı'}
                </span>
              </label>
            </div>

            {settings.weekdays.isOpen && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Açılış Saati
                  </label>
                  <input
                    type="time"
                    value={settings.weekdays.open}
                    onChange={(e) => onSettingsChange('weekdays', 'open', e.target.value)}
                    className="w-full bg-primary-bg border border-gray-600 rounded-lg px-3 py-2 text-text-primary focus:border-accent-gold focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Kapanış Saati
                  </label>
                  <input
                    type="time"
                    value={settings.weekdays.close}
                    onChange={(e) => onSettingsChange('weekdays', 'close', e.target.value)}
                    className="w-full bg-primary-bg border border-gray-600 rounded-lg px-3 py-2 text-text-primary focus:border-accent-gold focus:outline-none"
                    required
                  />
                </div>
              </div>
            )}
          </div>

          
          <div className="bg-primary-bg rounded-lg p-4 border border-gray-600">
            <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center space-x-2">
              <Calendar size={18} className="text-accent-gold" />
              <span>Cumartesi</span>
            </h3>

            <div className="flex items-center justify-between mb-3">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={settings.saturday.isOpen}
                  onChange={(e) => onSettingsChange('saturday', 'isOpen', e.target.checked)}
                  className="w-4 h-4 text-accent-gold bg-primary-bg border-gray-600 rounded focus:ring-accent-gold focus:ring-2"
                />
                <span className="text-sm font-medium text-text-secondary">
                  {settings.saturday.isOpen ? 'Açık' : 'Kapalı'}
                </span>
              </label>
            </div>

            {settings.saturday.isOpen && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Açılış Saati
                  </label>
                  <input
                    type="time"
                    value={settings.saturday.open}
                    onChange={(e) => onSettingsChange('saturday', 'open', e.target.value)}
                    className="w-full bg-primary-bg border border-gray-600 rounded-lg px-3 py-2 text-text-primary focus:border-accent-gold focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Kapanış Saati
                  </label>
                  <input
                    type="time"
                    value={settings.saturday.close}
                    onChange={(e) => onSettingsChange('saturday', 'close', e.target.value)}
                    className="w-full bg-primary-bg border border-gray-600 rounded-lg px-3 py-2 text-text-primary focus:border-accent-gold focus:outline-none"
                    required
                  />
                </div>
              </div>
            )}
          </div>

          
          <div className="bg-primary-bg rounded-lg p-4 border border-gray-600">
            <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center space-x-2">
              <Calendar size={18} className="text-accent-gold" />
              <span>Pazar</span>
            </h3>

            <div className="flex items-center justify-between mb-3">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={settings.sunday.isOpen}
                  onChange={(e) => onSettingsChange('sunday', 'isOpen', e.target.checked)}
                  className="w-4 h-4 text-accent-gold bg-primary-bg border-gray-600 rounded focus:ring-accent-gold focus:ring-2"
                />
                <span className="text-sm font-medium text-text-secondary">
                  {settings.sunday.isOpen ? 'Açık' : 'Kapalı'}
                </span>
              </label>
            </div>

            {settings.sunday.isOpen && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Açılış Saati
                  </label>
                  <input
                    type="time"
                    value={settings.sunday.open}
                    onChange={(e) => onSettingsChange('sunday', 'open', e.target.value)}
                    className="w-full bg-primary-bg border border-gray-600 rounded-lg px-3 py-2 text-text-primary focus:border-accent-gold focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Kapanış Saati
                  </label>
                  <input
                    type="time"
                    value={settings.sunday.close}
                    onChange={(e) => onSettingsChange('sunday', 'close', e.target.value)}
                    className="w-full bg-primary-bg border border-gray-600 rounded-lg px-3 py-2 text-text-primary focus:border-accent-gold focus:outline-none"
                    required
                  />
                </div>
              </div>
            )}
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
                <span>Çalışma Saatlerini Kaydet</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}


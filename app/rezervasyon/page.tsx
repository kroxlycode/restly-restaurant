'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { Calendar, Clock, Users, CheckCircle, Phone, Mail, MessageSquare } from 'lucide-react'
import { addReservation } from '@/lib/dataStore'

type ReservationData = {
  name: string
  email: string
  phone: string
  date: string
  time: string
  guests: number
  specialRequests: string
  kvkkConsent: boolean
  marketingConsent: boolean
}

const timeSlots = [
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
  '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30'
]

const guestOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

export default function ReservationPage() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [capacityStatus, setCapacityStatus] = useState<{available: boolean, message: string, capacityEnabled?: boolean} | null>(null)
  const [isCheckingCapacity, setIsCheckingCapacity] = useState(false)
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<ReservationData>()

  const selectedDate = watch('date')
  const selectedTime = watch('time')
  const selectedGuests = watch('guests')


  const checkCapacity = async (date: string, time: string, guests: number) => {
    if (!date || !time || !guests) return
    
    setIsCheckingCapacity(true)
    try {
      const response = await fetch('/api/capacity/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date, time, guests })
      })
      
      const result = await response.json()
      setCapacityStatus(result)
    } catch (error) {
      console.error('Kapasite kontrolü hatası:', error)
      setCapacityStatus({
        available: false,
        message: 'Kapasite kontrolü yapılamadı. Lütfen tekrar deneyin.'
      })
    } finally {
      setIsCheckingCapacity(false)
    }
  }


  React.useEffect(() => {
    if (selectedDate && selectedTime && selectedGuests) {
      checkCapacity(selectedDate, selectedTime, Number(selectedGuests))
    } else {
      setCapacityStatus(null)
    }
  }, [selectedDate, selectedTime, selectedGuests])

  const onSubmit = async (data: ReservationData) => {

    if (capacityStatus && !capacityStatus.available && capacityStatus.capacityEnabled) {
      alert('Seçtiğiniz tarih ve saatte kapasite bulunmamaktadır.')
      return
    }


    if (capacityStatus && !capacityStatus.capacityEnabled) {

    }

    try {
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          date: data.date,
          time: data.time,
          guests: data.guests,
          specialRequests: data.specialRequests,
          kvkkConsent: data.kvkkConsent,
          marketingConsent: data.marketingConsent
        })
      })
      
      if (response.ok) {
        setIsSubmitted(true)
        reset()
        

        setTimeout(() => {
          setIsSubmitted(false)
        }, 5000)
      } else {
        throw new Error('Failed to submit reservation')
      }
    } catch (error) {
      console.error('Error submitting reservation:', error)

    }
  }


  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="min-h-screen pt-20">
      
      <section className="section-padding bg-gradient-to-r from-primary-bg to-primary-secondary">
        <div className="container-max text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-gradient mb-4">
              Rezervasyon
            </h1>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              Unutulmaz bir yemek deneyimi için masanızı ayırtın
            </p>
          </motion.div>
        </div>
      </section>

      
      <section className="section-padding bg-primary-bg">
        <div className="container-max max-w-4xl">
          {isSubmitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card text-center py-12"
            >
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={40} className="text-white" />
              </div>
              <h2 className="text-3xl font-serif font-bold text-text-primary mb-4">
                Rezervasyon Alındı!
              </h2>
              <p className="text-text-secondary text-lg mb-6">
                Rezervasyonunuz başarıyla alınmıştır. En kısa sürede size dönüş yapacağız.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="tel:+902121234567"
                  className="flex items-center justify-center space-x-2 btn-primary"
                >
                  <Phone size={20} />
                  <span>Hemen Ara</span>
                </a>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="btn-secondary"
                >
                  Yeni Rezervasyon
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="card"
            >
              <h2 className="text-2xl font-serif font-bold text-text-primary mb-8 text-center">
                Rezervasyon Formu
              </h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                
                <div className="space-y-6">
                  <h3 className="text-xl font-serif font-semibold text-accent-gold border-b border-gray-700 pb-2">
                    Kişisel Bilgiler
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-text-primary font-medium mb-2">
                        Ad Soyad *
                      </label>
                      <input
                        type="text"
                        {...register('name', { required: 'Ad soyad gereklidir' })}
                        className="w-full px-4 py-3 bg-primary-card border border-gray-700 rounded-lg text-text-primary focus:border-accent-gold focus:outline-none transition-colors duration-300"
                        placeholder="Adınızı ve soyadınızı girin"
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-text-primary font-medium mb-2">
                        Telefon *
                      </label>
                      <input
                        type="tel"
                        {...register('phone', { required: 'Telefon numarası gereklidir' })}
                        className="w-full px-4 py-3 bg-primary-card border border-gray-700 rounded-lg text-text-primary focus:border-accent-gold focus:outline-none transition-colors duration-300"
                        placeholder="Telefon numaranızı girin"
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-text-primary font-medium mb-2">
                      E-posta *
                    </label>
                    <input
                      type="email"
                      {...register('email', { 
                        required: 'E-posta gereklidir',
                        pattern: {
                          value: /^\S+@\S+$/i,
                          message: 'Geçerli bir e-posta adresi girin'
                        }
                      })}
                      className="w-full px-4 py-3 bg-primary-card border border-gray-700 rounded-lg text-text-primary focus:border-accent-gold focus:outline-none transition-colors duration-300"
                      placeholder="E-posta adresinizi girin"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                
                <div className="space-y-6">
                  <h3 className="text-xl font-serif font-semibold text-accent-gold border-b border-gray-700 pb-2">
                    Rezervasyon Detayları
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-text-primary font-medium mb-2">
                        <Calendar size={18} className="inline mr-2" />
                        Tarih *
                      </label>
                      <input
                        type="date"
                        min={today}
                        {...register('date', { required: 'Tarih seçimi gereklidir' })}
                        className="w-full px-4 py-3 bg-primary-card border border-gray-700 rounded-lg text-text-primary focus:border-accent-gold focus:outline-none transition-colors duration-300"
                      />
                      {errors.date && (
                        <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-text-primary font-medium mb-2">
                        <Clock size={18} className="inline mr-2" />
                        Saat *
                      </label>
                      <select
                        {...register('time', { required: 'Saat seçimi gereklidir' })}
                        className="w-full px-4 py-3 bg-primary-card border border-gray-700 rounded-lg text-text-primary focus:border-accent-gold focus:outline-none transition-colors duration-300"
                      >
                        <option value="">Saat seçin</option>
                        {timeSlots.map((time) => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </select>
                      {errors.time && (
                        <p className="text-red-500 text-sm mt-1">{errors.time.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-text-primary font-medium mb-2">
                        <Users size={18} className="inline mr-2" />
                        Kişi Sayısı *
                      </label>
                      <select
                        {...register('guests', { required: 'Kişi sayısı seçimi gereklidir' })}
                        className="w-full px-4 py-3 bg-primary-card border border-gray-700 rounded-lg text-text-primary focus:border-accent-gold focus:outline-none transition-colors duration-300"
                      >
                        <option value="">Kişi sayısı</option>
                        {guestOptions.map((num) => (
                          <option key={num} value={num}>{num} kişi</option>
                        ))}
                      </select>
                      {errors.guests && (
                        <p className="text-red-500 text-sm mt-1">{errors.guests.message}</p>
                      )}
                    </div>
                  </div>

                  
                  {selectedDate && selectedTime && selectedGuests && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      
                      <div className="bg-primary-secondary p-4 rounded-lg border border-accent-gold/30">
                        <h4 className="font-semibold text-accent-gold mb-2">Rezervasyon Özeti:</h4>
                        <div className="text-text-secondary space-y-1">
                          <p>📅 Tarih: {new Date(selectedDate).toLocaleDateString('tr-TR')}</p>
                          <p>🕐 Saat: {selectedTime}</p>
                          <p>👥 Kişi Sayısı: {selectedGuests}</p>
                        </div>
                      </div>

                      
                      <div className={`p-4 rounded-lg border ${
                        isCheckingCapacity 
                          ? 'border-yellow-500/30 bg-yellow-500/10' 
                          : capacityStatus?.available 
                            ? 'border-green-500/30 bg-green-500/10'
                            : 'border-red-500/30 bg-red-500/10'
                      }`}>
                        {isCheckingCapacity ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-yellow-500 font-medium">Kapasite kontrol ediliyor...</span>
                          </div>
                        ) : capacityStatus ? (
                          <div className="flex items-center space-x-2">
                            <span className={`text-lg ${capacityStatus.available ? 'text-green-500' : 'text-red-500'}`}>
                              {capacityStatus.available ? '✅' : '❌'}
                            </span>
                            <span className={`font-medium ${capacityStatus.available ? 'text-green-500' : 'text-red-500'}`}>
                              {capacityStatus.message}
                            </span>
                          </div>
                        ) : null}
                      </div>
                    </motion.div>
                  )}
                </div>

                
                <div className="space-y-4">
                  <h3 className="text-xl font-serif font-semibold text-accent-gold border-b border-gray-700 pb-2">
                    Özel İstekler
                  </h3>
                  
                  <div>
                    <label className="block text-text-primary font-medium mb-2">
                      <MessageSquare size={18} className="inline mr-2" />
                      Özel İstekleriniz
                    </label>
                    <textarea
                      {...register('specialRequests')}
                      rows={4}
                      className="w-full px-4 py-3 bg-primary-card border border-gray-700 rounded-lg text-text-primary focus:border-accent-gold focus:outline-none transition-colors duration-300 resize-none"
                      placeholder="Doğum günü kutlaması, diyet kısıtlamaları, özel masa tercihi vb. isteklerinizi belirtebilirsiniz..."
                    />
                  </div>
                </div>

                
                <div className="space-y-4">
                  <h3 className="text-xl font-serif font-semibold text-accent-gold border-b border-gray-700 pb-2">
                    Onaylar
                  </h3>

                  <div className="space-y-3">
                    <label className="flex items-start space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        {...register('kvkkConsent', { required: 'KVKK onayı gereklidir' })}
                        className="mt-1 w-4 h-4 text-accent-gold bg-primary-card border-gray-700 rounded focus:ring-accent-gold focus:ring-2"
                      />
                      <span className="text-text-secondary text-sm leading-relaxed">
                        <strong className="text-text-primary">KVKK Aydınlatma Metni:</strong> Kişisel verilerimin 
                        rezervasyon işlemleri için işlenmesini kabul ediyorum. 
                        <a href="/kvkk" className="text-accent-gold hover:underline ml-1">
                          Detaylı bilgi için tıklayın.
                        </a>
                      </span>
                    </label>
                    {errors.kvkkConsent && (
                      <p className="text-red-500 text-sm">{errors.kvkkConsent.message}</p>
                    )}

                    <label className="flex items-start space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        {...register('marketingConsent')}
                        className="mt-1 w-4 h-4 text-accent-gold bg-primary-card border-gray-700 rounded focus:ring-accent-gold focus:ring-2"
                      />
                      <span className="text-text-secondary text-sm leading-relaxed">
                        <strong className="text-text-primary">Pazarlama İletişimi:</strong> Kampanyalar ve özel teklifler 
                        hakkında bilgilendirilmek istiyorum. (İsteğe bağlı)
                      </span>
                    </label>
                  </div>
                </div>

                
                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={capacityStatus?.available === false && capacityStatus?.capacityEnabled}
                    className={`w-full flex items-center justify-center space-x-2 py-4 text-lg transition-all duration-300 ${
                      (!capacityStatus || capacityStatus.available || !capacityStatus.capacityEnabled)
                        ? 'btn-primary'
                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <Calendar size={20} />
                    <span>
                      {isCheckingCapacity 
                        ? 'Kapasite Kontrol Ediliyor...' 
                        : capacityStatus?.capacityEnabled === false
                          ? 'Rezervasyon Yap'
                          : capacityStatus?.available 
                            ? 'Rezervasyon Yap' 
                            : 'Rezervasyon Yapılamaz'
                      }
                    </span>
                  </button>
                  
                  <p className="text-text-secondary text-sm text-center mt-4">
                    Rezervasyonunuz onay için incelendikten sonra size dönüş yapılacaktır.
                  </p>
                </div>
              </form>
            </motion.div>
          )}
        </div>
      </section>

      
      <section className="section-padding bg-primary-secondary">
        <div className="container-max text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-serif font-bold text-text-primary mb-4">
              Acil Rezervasyon İçin
            </h3>
            <p className="text-text-secondary mb-6">
              Aynı gün rezervasyon veya özel istekleriniz için direkt iletişime geçin
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+902121234567"
                className="flex items-center justify-center space-x-2 btn-primary"
              >
                <Phone size={20} />
                <span>+90 212 123 45 67</span>
              </a>
              <a
                href="mailto:rezervasyon@restly.com"
                className="flex items-center justify-center space-x-2 btn-secondary"
              >
                <Mail size={20} />
                <span>rezervasyon@restly.com</span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}



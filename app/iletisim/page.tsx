'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react'
import { addContactMessage } from '@/lib/dataStore'

type FormData = {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}

interface ContactInfo {
  icon: any
  title: string
  content: string
  link: string | null
}

export default function ContactPage() {
  const [contactInfo, setContactInfo] = useState<ContactInfo[]>([])
  const [contactSettings, setContactSettings] = useState<any>({})
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>()

  useEffect(() => {
    const loadContactInfo = async () => {
      try {

        const contactResponse = await fetch('/api/contact-info')
        const contactData = await contactResponse.json()


        const timesResponse = await fetch('/api/times')
        const timesData = await timesResponse.json()


        const formatWorkingHours = () => {
          const days = []
          if (timesData.weekdays?.isOpen) {
            days.push(`Hafta içi: ${timesData.weekdays.open} - ${timesData.weekdays.close}`)
          }
          if (timesData.saturday?.isOpen) {
            days.push(`Cumartesi: ${timesData.saturday.open} - ${timesData.saturday.close}`)
          }
          if (timesData.sunday?.isOpen) {
            days.push(`Pazar: ${timesData.sunday.open} - ${timesData.sunday.close}`)
          }
          return days.join('\n')
        }

        const info: ContactInfo[] = [
          {
            icon: MapPin,
            title: 'Adres',
            content: contactData.location || 'Nişantaşı Mah. Teşvikiye Cad. İstanbul/Şişli',
            link: 'https://maps.google.com'
          },
          {
            icon: Phone,
            title: 'Telefon',
            content: contactData.phone || '+90 555 555 55 55',
            link: `tel:${contactData.phone?.replace(/\s/g, '') || '+905555555555'}`
          },
          {
            icon: Mail,
            title: 'E-posta',
            content: contactData.email || 'info@restly.com',
            link: `mailto:${contactData.email || 'info@restly.com'}`
          },
          {
            icon: Clock,
            title: 'Çalışma Saatleri',
            content: formatWorkingHours() || 'Pazartesi - Pazar: 08:00 - 23:00',
            link: null
          }
        ]

        setContactInfo(info)
        setContactSettings(contactData)
      } catch (error) {
        console.error('İletişim bilgileri yüklenirken hata:', error)

        const defaultContactData = {
          location: 'Nişantaşı Mah. Teşvikiye Cad. İstanbul/Şişli',
          phone: '+90 555 555 55 55',
          email: 'info@restly.com',
          googleMapsUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3009.0!2d28.9784!3d41.0082!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDAwJzI5LjUiTiAyOMKwNTgnNDIuMiJF!5e0!3m2!1str!2str!4v1620000000000!5m2!1str!2str'
        }

        setContactSettings(defaultContactData)
        setContactInfo([
          {
            icon: MapPin,
            title: 'Adres',
            content: 'Nişantaşı Mah. Teşvikiye Cad. İstanbul/Şişli',
            link: 'https://maps.google.com'
          },
          {
            icon: Phone,
            title: 'Telefon',
            content: '+90 555 555 55 55',
            link: 'tel:+905555555555'
          },
          {
            icon: Mail,
            title: 'E-posta',
            content: 'info@restly.com',
            link: 'mailto:info@restly.com'
          },
          {
            icon: Clock,
            title: 'Çalışma Saatleri',
            content: 'Hafta içi: 08:00 - 23:00\nCumartesi: 09:00 - 01:00\nPazar: 09:30 - 22:00',
            link: null
          }
        ])
      }
    }

    loadContactInfo()
  }, [])

  const onSubmit = async (data: FormData) => {
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          subject: data.subject,
          message: data.message
        })
      })
      
      if (response.ok) {
        setIsSubmitted(true)
        reset()
        

        setTimeout(() => {
          setIsSubmitted(false)
        }, 3000)
      } else {
        throw new Error('Failed to submit message')
      }
    } catch (error) {
      console.error('Error submitting form:', error)

    }
  }

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
              İletişim
            </h1>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              Sorularınız, önerileriniz veya rezervasyon talepleriniz için bizimle iletişime geçin
            </p>
          </motion.div>
        </div>
      </section>

      
      <section className="section-padding bg-primary-bg">
        <div className="container-max">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gradient mb-4">
              Bize Ulaşın
            </h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              Size en iyi hizmeti sunabilmek için buradayız
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactInfo.map((info, index) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card text-center group hover:scale-105"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-accent-gold to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform duration-300">
                  <info.icon size={32} className="text-primary-bg" />
                </div>
                <h3 className="font-semibold text-text-primary mb-2">{info.title}</h3>
                {info.link ? (
                  <a
                    href={info.link}
                    className="text-text-secondary hover:text-accent-gold transition-colors duration-300 text-sm"
                    target={info.link.startsWith('http') ? '_blank' : '_self'}
                    rel={info.link.startsWith('http') ? 'noopener noreferrer' : ''}
                  >
                    {info.content}
                  </a>
                ) : (
                  <p className="text-text-secondary text-sm">{info.content}</p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      
      <section className="section-padding bg-primary-secondary">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="card">
                <h3 className="text-2xl font-serif font-bold text-text-primary mb-6">
                  Mesaj Gönderin
                </h3>

                {isSubmitted && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-green-500/20 border border-green-500 rounded-lg flex items-center space-x-2"
                  >
                    <CheckCircle size={20} className="text-green-500" />
                    <span className="text-green-500">Mesajınız başarıyla gönderildi!</span>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        Telefon
                      </label>
                      <input
                        type="tel"
                        {...register('phone')}
                        className="w-full px-4 py-3 bg-primary-card border border-gray-700 rounded-lg text-text-primary focus:border-accent-gold focus:outline-none transition-colors duration-300"
                        placeholder="Telefon numaranızı girin"
                      />
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

                  <div>
                    <label className="block text-text-primary font-medium mb-2">
                      Konu *
                    </label>
                    <input
                      type="text"
                      {...register('subject', { required: 'Konu gereklidir' })}
                      className="w-full px-4 py-3 bg-primary-card border border-gray-700 rounded-lg text-text-primary focus:border-accent-gold focus:outline-none transition-colors duration-300"
                      placeholder="Mesajınızın konusunu girin"
                    />
                    {errors.subject && (
                      <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-text-primary font-medium mb-2">
                      Mesaj *
                    </label>
                    <textarea
                      {...register('message', { required: 'Mesaj gereklidir' })}
                      rows={5}
                      className="w-full px-4 py-3 bg-primary-card border border-gray-700 rounded-lg text-text-primary focus:border-accent-gold focus:outline-none transition-colors duration-300 resize-none"
                      placeholder="Mesajınızı yazın..."
                    />
                    {errors.message && (
                      <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center space-x-2 btn-primary py-4"
                  >
                    <Send size={20} />
                    <span>Mesaj Gönder</span>
                  </button>
                </form>
              </div>
            </motion.div>

            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="card p-0 overflow-hidden h-full min-h-[600px]">
                <iframe
                  src={contactSettings?.googleMapsUrl || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3009.0!2d28.9784!3d41.0082!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDAwJzI5LjUiTiAyOMKwNTgnNDIuMiJF!5e0!3m2!1str!2str!4v1620000000000!5m2!1str!2str'}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="grayscale hover:grayscale-0 transition-all duration-500"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}



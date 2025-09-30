'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { MapPin, Phone, Mail, Clock, ArrowRight } from 'lucide-react'

const contactInfo = [
  {
    icon: MapPin,
    title: 'Adres',
    content: 'Nişantaşı Mah. Teşvikiye Cad. No:123 Şişli/İstanbul',
    link: 'https://maps.google.com'
  },
  {
    icon: Phone,
    title: 'Telefon',
    content: '+90 212 123 45 67',
    link: 'tel:+902121234567'
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
    content: 'Pazartesi - Pazar: 11:00 - 23:00',
    link: null
  }
]

export default function LocationContact() {
  return (
    <section className="section-padding bg-primary-secondary">
      <div className="container-max">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gradient mb-4">
            Bizi Ziyaret Edin
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            İstanbul&apos;un kalbinde, size en yakın konumda hizmet veriyoruz
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={info.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="card group hover:scale-105"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-accent-gold to-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 group-hover:rotate-12 transition-transform duration-300">
                      <info.icon size={24} className="text-primary-bg" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-text-primary mb-2">{info.title}</h3>
                      {info.link ? (
                        <a
                          href={info.link}
                          className="text-text-secondary hover:text-accent-gold transition-colors duration-300"
                          target={info.link.startsWith('http') ? '_blank' : '_self'}
                          rel={info.link.startsWith('http') ? 'noopener noreferrer' : ''}
                        >
                          {info.content}
                        </a>
                      ) : (
                        <p className="text-text-secondary">{info.content}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/rezervasyon"
                className="group flex items-center justify-center space-x-2 btn-primary flex-1"
              >
                <span>Rezervasyon Yap</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              <Link
                href="/iletisim"
                className="group flex items-center justify-center space-x-2 btn-secondary flex-1"
              >
                <span>İletişim Sayfası</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
          </motion.div>

          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="card p-0 overflow-hidden h-96">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3009.0!2d28.9784!3d41.0082!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDAwJzI5LjUiTiAyOMKwNTgnNDIuMiJF!5e0!3m2!1str!2str!4v1620000000000!5m2!1str!2str"
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
  )
}


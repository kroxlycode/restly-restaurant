'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Award, Users, Clock } from 'lucide-react'

const stats = [
  { icon: Award, number: '15+', label: 'Yıl Deneyim' },
  { icon: Users, number: '50K+', label: 'Mutlu Müşteri' },
  { icon: Clock, number: '24/7', label: 'Rezervasyon' }
]

export default function AboutPreview() {
  return (
    <section className="section-padding bg-primary-secondary">
      <div className="container-max">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-gradient mb-4">
                Hikayemiz
              </h2>
              <p className="text-text-secondary text-lg leading-relaxed mb-6">
                2009 yılında kurulan Restly, modern gastronomi anlayışını geleneksel Türk mutfağı ile 
                harmanlayarak eşsiz lezzetler sunma vizyonuyla yola çıktı. Deneyimli şef kadromuz ve 
                kaliteli malzemelerimizle her tabakta bir sanat eseri yaratıyoruz.
              </p>
              <p className="text-text-secondary leading-relaxed mb-8">
                Misyonumuz, müşterilerimize sadece yemek değil, unutulmaz bir deneyim sunmaktır. 
                Modern ambiyansımız ve sıcak atmosferimizle her ziyaretinizde kendinizi özel hissetmenizi sağlıyoruz.
              </p>
            </div>

            
            <div className="grid grid-cols-3 gap-6 mb-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-accent-gold to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <stat.icon size={24} className="text-primary-bg" />
                  </div>
                  <div className="text-2xl font-bold text-accent-gold">{stat.number}</div>
                  <div className="text-text-secondary text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            <Link
              href="/hakkimizda"
              className="group inline-flex items-center space-x-2 btn-secondary"
            >
              <span>Daha Fazla Bilgi</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </motion.div>

          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="relative h-48 overflow-hidden rounded-lg">
                  <Image
                    src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                    alt="Restaurant Interior"
                    fill
                    className="object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="relative h-32 overflow-hidden rounded-lg">
                  <Image
                    src="https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                    alt="Chef Cooking"
                    fill
                    className="object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </div>
              <div className="space-y-4 mt-8">
                <div className="relative h-32 overflow-hidden rounded-lg">
                  <Image
                    src="https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                    alt="Fine Dining"
                    fill
                    className="object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="relative h-48 overflow-hidden rounded-lg">
                  <Image
                    src="https://images.unsplash.com/photo-1578474846511-04ba529f0b88?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                    alt="Restaurant Atmosphere"
                    fill
                    className="object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}


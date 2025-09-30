'use client'

import { motion } from 'framer-motion'
import { Leaf, ChefHat, Sparkles, Clock } from 'lucide-react'

const features = [
  {
    icon: Leaf,
    title: 'Taze Malzemeler',
    description: 'Her gün taze tedarik edilen organik ve kaliteli malzemeler kullanıyoruz.'
  },
  {
    icon: ChefHat,
    title: 'Deneyimli Şefler',
    description: 'Michelin yıldızlı restoranlarda çalışmış deneyimli şef kadromuz.'
  },
  {
    icon: Sparkles,
    title: 'Modern Ambiyans',
    description: 'Şık ve modern tasarımla unutulmaz bir yemek deneyimi sunuyoruz.'
  },
  {
    icon: Clock,
    title: 'Hızlı Servis',
    description: 'Profesyonel ekibimizle hızlı ve kaliteli servis garantisi.'
  }
]

export default function FeaturesSection() {
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
            Neden Restly?
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Müşterilerimize en iyi deneyimi sunmak için özenle seçtiğimiz özelliklerimiz
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="card text-center group hover:scale-105"
            >
              <div className="mb-6 flex justify-center">
                <div className="w-16 h-16 bg-gradient-to-br from-accent-gold to-yellow-500 rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                  <feature.icon size={32} className="text-primary-bg" />
                </div>
              </div>
              
              <h3 className="text-xl font-serif font-semibold text-text-primary mb-4">
                {feature.title}
              </h3>
              
              <p className="text-text-secondary leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

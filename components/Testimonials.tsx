'use client'

import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    id: 1,
    name: 'Ayşe Demir',
    role: 'Müdür',
    rating: 5,
    comment: 'Restly\'de geçirdiğimiz akşam gerçekten unutulmazdu. Yemeklerin lezzeti ve sunumu mükemmeldi. Özellikle truffle risotto\'yu herkese tavsiye ederim.',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 2,
    name: 'Mehmet Kaya',
    role: 'Girişimci',
    rating: 5,
    comment: 'İş toplantılarım için sık sık tercih ettiğim bir mekan. Hem atmosferi hem de servisi harika. Wagyu steak\'i denemeyen pişman olur.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 3,
    name: 'Zeynep Özkan',
    role: 'Avukat',
    rating: 5,
    comment: 'Özel günlerimizi kutlamak için gittiğimiz tek yer. Personel çok ilgili ve yemekler her seferinde aynı kalitede. Teşekkürler Restly!',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 4,
    name: 'Can Yılmaz',
    role: 'Mimar',
    rating: 5,
    comment: 'Tasarımı ve ambiyansı gerçekten etkileyici. Yemeklerin yanı sıra mekanın atmosferi de çok özel. Kesinlikle tekrar geleceğim.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
  }
]

export default function Testimonials() {
  return (
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
            Müşteri Yorumları
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Değerli müşterilerimizin deneyimlerini ve görüşlerini sizlerle paylaşıyoruz
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="card relative group hover:scale-105"
            >
              
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-accent-gold rounded-full flex items-center justify-center">
                <Quote size={16} className="text-primary-bg" />
              </div>

              
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={16} className="text-yellow-400 fill-current" />
                ))}
              </div>

              
              <p className="text-text-secondary leading-relaxed mb-6 italic">
                &quot;{testimonial.comment}&quot;
              </p>

              
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="font-semibold text-text-primary">{testimonial.name}</div>
                  <div className="text-text-secondary text-sm">{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}


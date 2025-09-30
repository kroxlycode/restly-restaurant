'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Award, Users, Clock, Heart, Target, Eye } from 'lucide-react'

interface AboutSettings {
  hero: {
    description: string
  }
  story: {
    title: string
    paragraphs: string[]
  }
  mission: {
    title: string
    description: string
  }
  vision: {
    title: string
    description: string
  }
  stats: Array<{
    icon: string
    number: string
    label: string
  }>
  team: Array<{
    id: string
    name: string
    role: string
    image: string
    description: string
  }>
  updatedAt: string
}

const iconMap = {
  Award,
  Users,
  Clock,
  Heart
}

export default function HakkimizdaPage() {
  const [settings, setSettings] = useState<AboutSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {

    setHydrated(true)
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/about/settings')
      if (response.ok) {
        const data = await response.json()
        setSettings(data)
      } else {

        setSettings({
          hero: {
            description: "2009 yılından beri lezzet yolculuğunda sizlerle birlikte"
          },
          story: {
            title: "Hikayemiz",
            paragraphs: [
              "Restly, 2009 yılında İstanbul'un kalbinde, lezzet tutkusu olan bir grup arkadaş tarafından kuruldu. Amacımız, modern gastronomi teknikleri ile geleneksel Türk mutfağının eşsiz lezzetlerini harmanlayarak, misafirlerimize unutulmaz bir deneyim sunmaktı.",
              "Yıllar içinde, kaliteli malzemeler, deneyimli şef kadromuz ve sıcak atmosferimizle İstanbul'un en sevilen restoranlarından biri haline geldik. Her tabakta bir sanat eseri yaratma vizyonumuz, bizi bugünkü konumumuza getirdi.",
              "Bugün, 15 yılı aşkın deneyimimizle, modern gastronomi dünyasında öncü konumumuzu sürdürürken, geleneksel değerlerimizi de korumaya devam ediyoruz."
            ]
          },
          mission: {
            title: "Misyonumuz",
            description: "Müşterilerimize sadece yemek değil, unutulmaz bir deneyim sunmak. Kaliteli malzemeler, yaratıcı sunumlar ve sıcak hizmet anlayışımızla her ziyareti özel kılmak misyonumuzun temelini oluşturuyor."
          },
          vision: {
            title: "Vizyonumuz",
            description: "Türkiye'nin gastronomi haritasında öncü konumumuzu güçlendirerek, uluslararası arenada Türk mutfağının modern yorumunu temsil eden bir marka olmak vizyonumuzun merkezinde yer alıyor."
          },
          stats: [
            { icon: "Award", number: "15+", label: "Yıl Deneyim" },
            { icon: "Users", number: "50K+", label: "Mutlu Müşteri" },
            { icon: "Clock", number: "24/7", label: "Rezervasyon" },
            { icon: "Heart", number: "100%", label: "Memnuniyet" }
          ],
          team: [
            {
              id: "1",
              name: "Chef Marco Rossi",
              role: "Baş Şef",
              image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
              description: "İtalya'da Michelin yıldızlı restoranlarda 20 yıl deneyim"
            },
            {
              id: "2",
              name: "Ayşe Demir",
              role: "Pastry Chef",
              image: "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
              description: "Paris'te Le Cordon Bleu mezunu, tatlı sanatları uzmanı"
            },
            {
              id: "3",
              name: "Mehmet Kaya",
              role: "Sommelier",
              image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
              description: "Uluslararası şarap uzmanı, 15 yıllık deneyim"
            }
          ],
          updatedAt: new Date().toISOString()
        })
      }
    } catch (error) {
      console.error('Hakkımızda ayarları yüklenemedi:', error)

      setSettings({
        hero: { description: "2009 yılından beri lezzet yolculuğunda sizlerle birlikte" },
        story: {
          title: "Hikayemiz",
          paragraphs: [
            "Restly, 2009 yılında İstanbul'un kalbinde, lezzet tutkusu olan bir grup arkadaş tarafından kuruldu.",
            "Yıllar içinde kaliteli malzemeler ve deneyimli şef kadromuzla İstanbul'un en sevilen restoranlarından biri haline geldik."
          ]
        },
        mission: {
          title: "Misyonumuz",
          description: "Müşterilerimize unutulmaz bir deneyim sunmak."
        },
        vision: {
          title: "Vizyonumuz",
          description: "Türk mutfağının modern yorumunu temsil eden bir marka olmak."
        },
        stats: [
          { icon: "Award", number: "15+", label: "Yıl Deneyim" },
          { icon: "Users", number: "50K+", label: "Mutlu Müşteri" },
          { icon: "Clock", number: "24/7", label: "Rezervasyon" },
          { icon: "Heart", number: "100%", label: "Memnuniyet" }
        ],
        team: [
          {
            id: "1",
            name: "Chef Marco Rossi",
            role: "Baş Şef",
            image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
            description: "İtalya'da Michelin yıldızlı restoranlarda 20 yıl deneyim"
          }
        ],
        updatedAt: new Date().toISOString()
      })
    } finally {
      setLoading(false)
    }
  }


  if (!hydrated) {
    return null
  }

  if (loading || !settings) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-primary-bg">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-4 border-accent-gold border-t-transparent rounded-full animate-spin"></div>
          <div className="text-accent-gold font-medium">Hakkımızda Yükleniyor...</div>
        </div>
      </div>
    )
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
              Hakkımızda
            </h1>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              {settings.hero.description}
            </p>
          </motion.div>
        </div>
      </section>

      
      <section className="section-padding bg-primary-bg">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-gradient">
                {settings.story.title}
              </h2>
              <div className="space-y-4 text-text-secondary leading-relaxed">
                {settings.story.paragraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
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

      
      <section className="section-padding bg-primary-secondary">
        <div className="container-max">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="card text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-accent-gold to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target size={32} className="text-primary-bg" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-text-primary mb-4">{settings.mission.title}</h3>
              <p className="text-text-secondary leading-relaxed">{settings.mission.description}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="card text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-accent-gold to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Eye size={32} className="text-primary-bg" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-text-primary mb-4">{settings.vision.title}</h3>
              <p className="text-text-secondary leading-relaxed">{settings.vision.description}</p>
            </motion.div>
          </div>
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
              Rakamlarla Restly
            </h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              15 yıllık yolculuğumuzda elde ettiğimiz başarılar
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {settings.stats.map((stat, index) => {
              const IconComponent = iconMap[stat.icon as keyof typeof iconMap] || Award
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="card text-center group hover:scale-105"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-accent-gold to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform duration-300">
                    <IconComponent size={32} className="text-primary-bg" />
                  </div>
                  <div className="text-3xl font-bold text-accent-gold mb-2">{stat.number}</div>
                  <div className="text-text-secondary">{stat.label}</div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      
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
              Ekibimiz
            </h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              Lezzet yolculuğumuzda bizimle birlikte olan deneyimli ekibimiz
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {settings.team.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card text-center group hover:scale-105"
              >
                <div className="relative w-32 h-32 mx-auto mb-6 overflow-hidden rounded-full">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <h3 className="text-xl font-serif font-semibold text-text-primary mb-2">
                  {member.name}
                </h3>
                <p className="text-accent-gold font-medium mb-4">{member.role}</p>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {member.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}



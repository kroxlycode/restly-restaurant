'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Star, ArrowRight, AlertTriangle, X, MapPin, Clock } from 'lucide-react'
import { useState, useEffect } from 'react'

interface MenuItem {
  id: string
  name: string
  categoryId: string
  description: string
  price: number
  ingredients: string[]
  image: string
  popular: boolean
  rating: number
  allergens: string[]
  createdAt: string
  publicId?: string
  updatedAt?: string
}

interface MenuCategory {
  id: string
  name: string
  description: string
}

const allergenIcons: { [key: string]: string } = {
  shellfish: '🦐',
  dairy: '🥛',
  nuts: '🥜',
  fish: '🐟',
  eggs: '🥚',
  gluten: '🌾'
}

export default function PopularDishes() {
  const [popularDishes, setPopularDishes] = useState<MenuItem[]>([])
  const [categories, setCategories] = useState<MenuCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)
  const [showItemModal, setShowItemModal] = useState(false)

  useEffect(() => {
    fetchMenuData()
  }, [])


  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showItemModal) {
        closeItemModal()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [showItemModal])

  const fetchMenuData = async () => {
    try {
      const response = await fetch('/api/menu')
      if (response.ok) {
        const data = await response.json()
        const allItems = data.items || []
        const allCategories = data.categories || []


        const popularItems = allItems
          .filter((item: MenuItem) => item.popular)
          .slice(0, 6)

        setPopularDishes(popularItems)
        setCategories(allCategories)
      }
    } catch (error) {
      console.error('Popüler yemekler yüklenemedi:', error)
    } finally {
      setLoading(false)
    }
  }

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId)
    return category?.name || 'Kategorisiz'
  }

  const openItemModal = (item: MenuItem) => {
    setSelectedItem(item)
    setShowItemModal(true)
  }

  const closeItemModal = () => {
    setShowItemModal(false)
    setSelectedItem(null)
  }
  if (loading) {
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
              Popüler Lezzetlerimiz
            </h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              Popüler yemekler yükleniyor...
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {[...Array(6)].map((_, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card overflow-hidden"
              >
                <div className="relative mb-4 overflow-hidden rounded-lg bg-gray-200 animate-pulse">
                  <div className="w-full h-48 bg-gray-300"></div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-12"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <>
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
              Popüler Lezzetlerimiz
            </h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              Müşterilerimizin en çok tercih ettiği özel yemeklerimizi keşfedin
            </p>
          </motion.div>

          {popularDishes.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {popularDishes.map((dish: MenuItem, index: number) => (
                  <motion.div
                    key={dish.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="card group hover:scale-105 overflow-hidden cursor-pointer"
                    onClick={() => openItemModal(dish)}
                  >
                    <div className="relative mb-4 overflow-hidden rounded-lg">
                      <Image
                        src={dish.image || '/images/placeholder.jpg'}
                        alt={dish.name}
                        width={400}
                        height={250}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.currentTarget.src = '/images/placeholder.jpg'
                        }}
                      />
                      <div className="absolute top-3 left-3 bg-accent-red text-white px-2 py-1 rounded-full text-xs font-semibold">
                        Popüler
                      </div>
                      <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded-full text-sm font-semibold">
                        ₺{dish.price}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-serif font-semibold text-text-primary">
                          {dish.name}
                        </h3>
                        <div className="flex items-center space-x-1">
                          <Star size={16} className="text-yellow-400 fill-current" />
                          <span className="text-text-secondary text-sm">{dish.rating}</span>
                        </div>
                      </div>

                      <p className="text-text-secondary leading-relaxed">
                        {dish.description}
                      </p>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-accent-gold font-medium">
                          {getCategoryName(dish.categoryId)}
                        </span>
                        {dish.allergens.length > 0 && (
                          <div className="flex items-center space-x-1 text-yellow-500">
                            <AlertTriangle size={14} />
                            <span className="text-xs">
                              {dish.allergens.map(allergen => allergenIcons[allergen]).join(' ')}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <Link
                  href="/menu"
                  className="group inline-flex items-center space-x-2 btn-primary text-lg px-8 py-4"
                >
                  <span>Tüm Menüyü Gör</span>
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </motion.div>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center py-16"
            >
              <div className="text-6xl mb-4">🍽️</div>
              <h3 className="text-xl font-semibold text-text-primary mb-2">
                Henüz Popüler Ürün Eklenmemiş
              </h3>
              <p className="text-text-secondary mb-6">
                Admin panelinden ürünlere &quot;Popüler&quot; işaretleyerek buraya ekleyebilirsiniz
              </p>
              <Link
                href="/menu"
                className="btn-primary inline-block"
              >
                Menüyü İncele
              </Link>
            </motion.div>
          )}
        </div>
      </section>

      
      {showItemModal && selectedItem && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={closeItemModal}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-primary-card rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              
              <button
                onClick={closeItemModal}
                className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
              >
                <X size={24} />
              </button>

              
              <div className="relative h-96 md:h-[500px] rounded-t-xl overflow-hidden">
                <Image
                  src={selectedItem.image || '/images/placeholder.jpg'}
                  alt={selectedItem.name}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/images/placeholder.jpg'
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  <div className="bg-accent-red text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Popüler
                  </div>
                  <div className="bg-accent-gold text-primary-bg px-3 py-1 rounded-full text-sm font-semibold">
                    {getCategoryName(selectedItem.categoryId)}
                  </div>
                </div>

                
                <div className="absolute top-4 right-4">
                  <div className="bg-black/70 text-white px-4 py-2 rounded-full text-xl font-bold">
                    ₺{selectedItem.price}
                  </div>
                </div>

                
                <div className="absolute bottom-6 left-6 right-6">
                  <h1 className="text-3xl md:text-4xl font-serif font-bold text-white mb-2">
                    {selectedItem.name}
                  </h1>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      <Star size={20} className="text-yellow-400 fill-current" />
                      <span className="text-white font-semibold">{selectedItem.rating}</span>
                    </div>
                    <span className="text-white/80">•</span>
                    <span className="text-white/80">
                      {new Date(selectedItem.createdAt).toLocaleDateString('tr-TR')}
                    </span>
                  </div>
                </div>
              </div>

              
              <div className="p-6 md:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  
                  <div className="space-y-6">
                    
                    <div>
                      <h2 className="text-xl font-serif font-semibold text-text-primary mb-3">
                        Açıklama
                      </h2>
                      <p className="text-text-secondary leading-relaxed text-lg">
                        {selectedItem.description}
                      </p>
                    </div>

                    
                    {selectedItem.ingredients.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-text-primary mb-3">
                          İçindekiler
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedItem.ingredients.map((ingredient: string, index: number) => (
                            <span
                              key={index}
                              className="bg-accent-gold/10 text-accent-gold px-3 py-1 rounded-full text-sm font-medium"
                            >
                              {ingredient}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    
                    {selectedItem.allergens.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-text-primary mb-3 flex items-center space-x-2">
                          <AlertTriangle size={20} className="text-yellow-500" />
                          <span>Alerjenler</span>
                        </h3>
                        <div className="space-y-2">
                          {selectedItem.allergens.map((allergen: string) => (
                            <div key={allergen} className="flex items-center space-x-3">
                              <span className="text-2xl">{allergenIcons[allergen]}</span>
                              <span className="text-text-secondary capitalize">
                                {allergen === 'shellfish' ? 'Kabuklular' :
                                 allergen === 'dairy' ? 'Süt Ürünleri' :
                                 allergen === 'nuts' ? 'Kuruyemiş' :
                                 allergen === 'fish' ? 'Balık' :
                                 allergen === 'eggs' ? 'Yumurta' :
                                 allergen === 'gluten' ? 'Gluten' : allergen}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  
                  <div className="space-y-6">
                    
                    <div className="bg-primary-secondary rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-text-primary mb-4">
                        Restly Restaurant
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <MapPin size={20} className="text-accent-gold" />
                          <div>
                            <p className="text-text-primary font-medium">Konum</p>
                            <p className="text-text-secondary text-sm">
                              İstanbul, Türkiye
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Clock size={20} className="text-accent-gold" />
                          <div>
                            <p className="text-text-primary font-medium">Servis Saatleri</p>
                            <p className="text-text-secondary text-sm">
                              Her gün 11:00 - 23:00
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    
                    <div className="space-y-3">
                      <Link
                        href="/rezervasyon"
                        className="w-full bg-accent-gold hover:bg-yellow-500 text-primary-bg py-3 px-6 rounded-xl font-semibold transition-colors duration-300 text-center block"
                      >
                        Rezervasyon Yap
                      </Link>
                      <Link
                        href="/iletisim"
                        className="w-full bg-primary-secondary hover:bg-primary-bg border border-gray-600 text-text-primary py-3 px-6 rounded-xl font-semibold transition-colors duration-300 text-center block"
                      >
                        İletişime Geç
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  )
}



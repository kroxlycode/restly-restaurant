'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Star, AlertTriangle, X, Clock, MapPin, ChevronDown, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react'

interface MenuCategory {
  id: string
  name: string
  description: string
}

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
}

const allergenIcons: { [key: string]: string } = {
  gluten: '🌾',
  dairy: '🥛',
  nuts: '🥜',
  shellfish: '🦐',
  fish: '🐟',
  eggs: '🥚'
}

const ITEMS_PER_PAGE = 9

export default function MenuPage() {
  const [categories, setCategories] = useState<MenuCategory[]>([])
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)
  const [showItemModal, setShowItemModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [showPopularOnly, setShowPopularOnly] = useState(false)
  const [ratingFilter, setRatingFilter] = useState<number | null>(null)
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'rating' | 'name' | null>(null)

  useEffect(() => {
    fetchMenuData()
  }, [])

  useEffect(() => {
    setCurrentPage(1)
  }, [selectedCategory, showPopularOnly, ratingFilter, sortBy])

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
        setCategories(data.categories || [])
        setMenuItems(data.items || [])
      }
    } catch (error) {
      console.error('Menü verileri yüklenemedi:', error)
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

  const filteredItems = (() => {
    let items = menuItems

    if (ratingFilter !== null) {
      items = items.filter((item: MenuItem) => Math.floor(item.rating) >= ratingFilter)
    }

    if (sortBy) {
      items = [...items].sort((a: MenuItem, b: MenuItem) => {
        switch (sortBy) {
          case 'price-asc':
            return a.price - b.price
          case 'price-desc':
            return b.price - a.price
          case 'rating':
            return b.rating - a.rating
          case 'name':
            return a.name.localeCompare(b.name)
          default:
            return 0
        }
      })
    }

    return items
  })()


  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const paginatedItems = filteredItems.slice(startIndex, endIndex)

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  const clearFilters = () => {
    setShowPopularOnly(false)
    setRatingFilter(null)
    setSortBy(null)
  }

  const hasActiveFilters = showPopularOnly || ratingFilter !== null || sortBy !== null

  if (loading) {
    return (
      <div className="min-h-screen pt-20 bg-primary-bg">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-accent-gold text-xl">Menü yükleniyor...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 bg-primary-bg">
      
      <section className="section-padding bg-gradient-to-r from-primary-bg to-primary-secondary">
        <div className="container-max text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-gradient mb-4">
              Menümüz
            </h1>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              Özenle seçilmiş malzemelerle hazırlanan lezzetli yemeklerimizi keşfedin
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container-max flex gap-8">
        
        {/* Desktop Sidebar - Sadece Desktop'ta Görünür */}
        <motion.aside
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="hidden lg:block w-80 bg-primary-card border-r border-gray-700 p-6"
        >
          <div className="space-y-4">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 ${selectedCategory === 'all'
                  ? 'bg-accent-gold text-primary-bg shadow-lg'
                  : 'bg-primary-secondary text-text-secondary hover:text-accent-gold hover:bg-primary-bg border border-gray-700'
                }`}
            >
              Tüm Ürünler
            </button>

            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 ${selectedCategory === category.id
                    ? 'bg-accent-gold text-primary-bg shadow-lg'
                    : 'bg-primary-secondary text-text-secondary hover:text-accent-gold hover:bg-primary-bg border border-gray-700'
                  }`}
              >
                <div className="font-medium">{category.name}</div>
                <div className="text-sm opacity-70 mt-1">{category.description}</div>
              </button>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-700">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Menü İstatistikleri</h3>
            <div className="space-y-2 text-sm text-text-secondary">
              <div className="flex justify-between">
                <span>Toplam Ürün:</span>
                <span className="text-accent-gold font-medium">{menuItems.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Gösterilen:</span>
                <span className="text-accent-gold font-medium">{filteredItems.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Kategori:</span>
                <span className="text-accent-gold font-medium">{categories.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Popüler Ürünler:</span>
                <span className="text-accent-gold font-medium">
                  {menuItems.filter(item => item.popular).length}
                </span>
              </div>
            </div>
          </div>
        </motion.aside>

        
        <main className="flex-1 section-padding">
          
          {/* Mobil Kategori Seçimi */}
          <div className="lg:hidden mb-6">
            <div className="flex items-center justify-between">
              <div className="relative flex-1 max-w-xs">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full appearance-none bg-primary-card border border-gray-600 rounded-lg px-4 py-3 pr-10 text-text-primary focus:ring-2 focus:ring-accent-gold focus:border-transparent"
                >
                  <option value="all">Tüm Kategoriler</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <ChevronDown size={18} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary pointer-events-none" />
              </div>
            </div>
          </div>

          
          {filteredItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="text-6xl mb-4">🍽️</div>
              <h3 className="text-xl font-semibold text-text-primary mb-2">
                Bu kategoride henüz ürün bulunmuyor
              </h3>
              <p className="text-text-secondary">
                Yakında yeni lezzetler eklenecek
              </p>
            </motion.div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-serif font-bold text-text-primary">
                  {selectedCategory === 'all'
                    ? 'Tüm Ürünler'
                    : getCategoryName(selectedCategory)
                  }
                </h2>
                <span className="text-text-secondary">
                  {filteredItems.length} ürün
                  {totalPages > 1 && (
                    <span className="text-accent-gold ml-1">
                      ({currentPage}/{totalPages}. sayfa)
                    </span>
                  )}
                </span>
              </div>

              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="mb-8 bg-primary-secondary rounded-xl p-6 border border-gray-700"
              >
                <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                  <div className="flex flex-wrap gap-4 items-center">
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="popular-filter"
                        checked={showPopularOnly}
                        onChange={(e) => setShowPopularOnly(e.target.checked)}
                        className="w-4 h-4 text-accent-gold bg-primary-bg border-gray-600 rounded focus:ring-accent-gold focus:ring-2"
                      />
                      <label htmlFor="popular-filter" className="text-text-primary text-sm font-medium cursor-pointer">
                        Sadece Popüler Ürünler
                      </label>
                    </div>

                    
                    <div className="relative">
                      <select
                        value={ratingFilter || ''}
                        onChange={(e) => setRatingFilter(e.target.value ? parseInt(e.target.value) : null)}
                        className="appearance-none bg-primary-bg border border-gray-600 rounded-lg px-4 py-2 pr-8 text-text-primary text-sm focus:ring-2 focus:ring-accent-gold focus:border-transparent"
                      >
                        <option value="">Tüm Puanlar</option>
                        <option value="5">5+ Yıldız</option>
                        <option value="4">4+ Yıldız</option>
                        <option value="3">3+ Yıldız</option>
                        <option value="2">2+ Yıldız</option>
                        <option value="1">1+ Yıldız</option>
                      </select>
                      <ChevronDown size={16} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-text-secondary pointer-events-none" />
                    </div>

                    
                    <div className="relative">
                      <select
                        value={sortBy || ''}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="appearance-none bg-primary-bg border border-gray-600 rounded-lg px-4 py-2 pr-8 text-text-primary text-sm focus:ring-2 focus:ring-accent-gold focus:border-transparent"
                      >
                        <option value="">Sıralama</option>
                        <option value="price-asc">Fiyat: Düşükten Yükseğe</option>
                        <option value="price-desc">Fiyat: Yüksekten Düşüğe</option>
                        <option value="rating">Puana Göre</option>
                        <option value="name">İsme Göre</option>
                      </select>
                      <ChevronDown size={16} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-text-secondary pointer-events-none" />
                    </div>
                  </div>

                  
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="flex items-center space-x-2 text-accent-gold hover:text-yellow-400 text-sm font-medium transition-colors"
                    >
                      <RotateCcw size={16} />
                      <span>Filtreleri Temizle</span>
                    </button>
                  )}
                </div>

                
                {hasActiveFilters && (
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <div className="flex flex-wrap gap-2">
                      {showPopularOnly && (
                        <span className="inline-flex items-center space-x-1 bg-accent-red/20 text-accent-red px-3 py-1 rounded-full text-xs font-medium">
                          <span>Popüler Ürünler</span>
                          <button
                            onClick={() => setShowPopularOnly(false)}
                            className="hover:text-red-300"
                          >
                            <X size={12} />
                          </button>
                        </span>
                      )}
                      {ratingFilter !== null && (
                        <span className="inline-flex items-center space-x-1 bg-accent-gold/20 text-accent-gold px-3 py-1 rounded-full text-xs font-medium">
                          <span>{ratingFilter}+ Yıldız</span>
                          <button
                            onClick={() => setRatingFilter(null)}
                            className="hover:text-yellow-300"
                          >
                            <X size={12} />
                          </button>
                        </span>
                      )}
                      {sortBy && (
                        <span className="inline-flex items-center space-x-1 bg-primary-bg text-text-primary px-3 py-1 rounded-full text-xs font-medium border border-gray-600">
                          <span>
                            {sortBy === 'price-asc' ? 'Fiyat: ↑' :
                             sortBy === 'price-desc' ? 'Fiyat: ↓' :
                             sortBy === 'rating' ? 'Puana Göre' :
                             sortBy === 'name' ? 'İsme Göre' : ''}
                          </span>
                          <button
                            onClick={() => setSortBy(null)}
                            className="hover:text-text-secondary"
                          >
                            <X size={12} />
                          </button>
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>

              <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {paginatedItems.map((item: MenuItem, index: number) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="card group hover:scale-105 overflow-hidden cursor-pointer"
                    onClick={() => openItemModal(item)}
                  >
                    <div className="relative mb-4 overflow-hidden rounded-lg">
                      <Image
                        src={item.image || '/images/placeholder.jpg'}
                        alt={item.name}
                        width={400}
                        height={250}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.currentTarget.src = '/images/placeholder.jpg'
                        }}
                      />
                      {item.popular && (
                        <div className="absolute top-3 left-3 bg-accent-red text-white px-2 py-1 rounded-full text-xs font-semibold">
                          Popüler
                        </div>
                      )}
                      <div className="absolute top-3 right-3 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        ₺{item.price}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-serif font-semibold text-text-primary">
                          {item.name}
                        </h3>
                        <div className="flex items-center space-x-1">
                          <Star size={16} className="text-yellow-400 fill-current" />
                          <span className="text-text-secondary text-sm">{item.rating}</span>
                        </div>
                      </div>

                      <p className="text-text-secondary leading-relaxed">
                        {item.description}
                      </p>

                      {item.ingredients.length > 0 && (
                        <div className="text-sm text-text-secondary">
                          <strong>İçindekiler:</strong> {item.ingredients.join(', ')}
                        </div>
                      )}

                      
                      {item.allergens.length > 0 && (
                        <div className="flex items-center space-x-2">
                          <AlertTriangle size={16} className="text-yellow-500" />
                          <div className="flex space-x-1">
                            {item.allergens.map((allergen: string) => (
                              <span key={allergen} className="text-lg" title={allergen}>
                                {allergenIcons[allergen]}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="pt-2 border-t border-gray-700">
                        <span className="text-sm text-text-secondary">
                          {getCategoryName(item.categoryId)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              
              {totalPages > 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  className="mt-12 flex items-center justify-center"
                >
                  <div className="flex items-center space-x-2">
                    
                    <button
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-gray-600 bg-primary-secondary text-text-secondary hover:text-accent-gold hover:border-accent-gold disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:text-text-secondary disabled:hover:border-gray-600 transition-colors duration-300"
                    >
                      <ChevronLeft size={16} />
                      <span className="hidden sm:inline">Önceki</span>
                    </button>

                    
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNumber
                        if (totalPages <= 5) {
                          pageNumber = i + 1
                        } else if (currentPage <= 3) {
                          pageNumber = i + 1
                        } else if (currentPage >= totalPages - 2) {
                          pageNumber = totalPages - 4 + i
                        } else {
                          pageNumber = currentPage - 2 + i
                        }

                        return (
                          <button
                            key={pageNumber}
                            onClick={() => goToPage(pageNumber)}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-300 ${
                              currentPage === pageNumber
                                ? 'bg-accent-gold text-primary-bg'
                                : 'bg-primary-secondary text-text-secondary hover:text-accent-gold hover:bg-primary-bg border border-gray-600'
                            }`}
                          >
                            {pageNumber}
                          </button>
                        )
                      })}
                    </div>

                    
                    <button
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-gray-600 bg-primary-secondary text-text-secondary hover:text-accent-gold hover:border-accent-gold disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:text-text-secondary disabled:hover:border-gray-600 transition-colors duration-300"
                    >
                      <span className="hidden sm:inline">Sonraki</span>
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </motion.div>
              )}
            </>
          )}
        </main>
      </div>

      
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
                  {selectedItem.popular && (
                    <div className="bg-accent-red text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Popüler
                    </div>
                  )}
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
                      <button className="w-full bg-accent-gold hover:bg-yellow-500 text-primary-bg py-3 px-6 rounded-xl font-semibold transition-colors duration-300">
                        Rezervasyon Yap
                      </button>
                      <button className="w-full bg-primary-secondary hover:bg-primary-bg border border-gray-600 text-text-primary py-3 px-6 rounded-xl font-semibold transition-colors duration-300">
                        İletişime Geç
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}



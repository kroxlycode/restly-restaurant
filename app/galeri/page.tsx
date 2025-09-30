'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { X } from 'lucide-react'

interface GalleryItem {
  id: string
  title: string
  description: string
  categories: string[]
  imageUrl: string
  publicId: string
  createdAt: string
}

const categories = ['Tümü', 'Restoran', 'Yemekler', 'Şefler', 'Etkinlikler']

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState('Tümü')
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null)

  useEffect(() => {
    fetchGalleryItems()
  }, [])

  const fetchGalleryItems = async () => {
    try {
      const response = await fetch('/api/gallery')
      if (response.ok) {
        const data = await response.json()
        setGalleryItems(data)
      }
    } catch (error) {
      console.error('Galeri öğeleri alınamadı:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredItems = selectedCategory === 'Tümü'
    ? galleryItems
    : galleryItems.filter(item => item.categories.includes(selectedCategory))

  const closeModal = () => {
    setSelectedImage(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-20">
        <section className="section-padding bg-gradient-to-r from-primary-bg to-primary-secondary">
          <div className="container-max text-center">
            <div className="text-accent-gold">Galeri yükleniyor...</div>
          </div>
        </section>
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
              Galeri
            </h1>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              Restly&apos;nin atmosferini ve lezzetlerini görsel olarak keşfedin
            </p>
          </motion.div>
        </div>
      </section>

      
      <section className="section-padding bg-primary-secondary">
        <div className="container-max">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-4 mb-12"
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-accent-gold text-primary-bg shadow-lg'
                    : 'bg-primary-card text-text-secondary hover:text-accent-gold border border-gray-700 hover:border-accent-gold'
                }`}
              >
                {category}
              </button>
            ))}
          </motion.div>

          
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredItems.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-text-secondary">Bu kategoride henüz resim bulunmamaktadır.</p>
              </div>
            ) : (
              filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="group cursor-pointer"
                  onClick={() => setSelectedImage(item)}
                >
                  <div className="relative overflow-hidden rounded-lg aspect-square">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="text-center text-white p-4">
                        <h3 className="font-serif font-semibold text-lg mb-2">{item.title}</h3>
                        <p className="text-sm">{item.description}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        </div>
      </section>

      
      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={closeModal}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="relative max-w-4xl max-h-full"
            onClick={(e) => e.stopPropagation()}
          >
            
            <button
              onClick={closeModal}
              className="absolute -top-12 right-0 text-white hover:text-accent-gold transition-colors duration-300 z-10"
            >
              <X size={32} />
            </button>

            
            <div className="relative">
              <Image
                src={selectedImage.imageUrl}
                alt={selectedImage.title}
                width={800}
                height={600}
                className="max-w-full max-h-[80vh] object-contain rounded-lg"
              />

              
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-lg">
                <h3 className="text-white font-serif font-semibold text-xl mb-2">
                  {selectedImage.title}
                </h3>
                <p className="text-gray-300">
                  {selectedImage.description}
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  Kategoriler: {selectedImage.categories.join(', ')}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}


'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Image,
  Upload,
  Trash2,
  Edit3,
  Plus,
  Search,
  Filter,
  X,
  Save,
  RefreshCw,
  AlertCircle,
  CheckCircle
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import AdminLayout from '@/components/AdminLayout'

interface GalleryItem {
  id: string
  title: string
  description: string
  categories: string[]
  imageUrl: string
  publicId: string
  createdAt: string
}

interface GalleryForm {
  title: string
  description: string
  categories: string[]
}

const categories = ['Restoran', 'Yemekler', 'Şefler', 'Etkinlikler']

export default function GalleryManagementPage() {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([])
  const [loadingData, setLoadingData] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Tümü')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null)
  const [deleteModal, setDeleteModal] = useState<{ show: boolean, item: GalleryItem | null }>({ show: false, item: null })
  const [uploading, setUploading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)


  const [formData, setFormData] = useState<GalleryForm>({
    title: '',
    description: '',
    categories: [] as string[]
  })
  const [dragOver, setDragOver] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)

    const files = Array.from(e.dataTransfer.files)
    const imageFiles = files.filter(file => file.type.startsWith('image/'))

    if (imageFiles.length > 0) {
      const file = imageFiles[0]
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'Dosya boyutu 5MB\'dan küçük olmalıdır' })
        return
      }

      setSelectedFile(file)


      if (fileInputRef.current) {
        const dataTransfer = new DataTransfer()
        dataTransfer.items.add(file)
        fileInputRef.current.files = dataTransfer.files
      }
    }
  }

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/admin/login')
    }
  }, [isAuthenticated, loading, router])

  useEffect(() => {
    if (isAuthenticated) {
      fetchGalleryItems()
    }
  }, [isAuthenticated])


  const fetchGalleryItems = async () => {
    try {
      const response = await fetch('/api/gallery')
      if (response.ok) {
        const data = await response.json()
        setGalleryItems(data)
      }
    } catch (error) {
      console.error('Galeri öğeleri alınamadı:', error)
      setMessage({ type: 'error', text: 'Veriler yüklenirken hata oluştu' })
    } finally {
      setLoadingData(false)
    }
  }

  const filteredItems = galleryItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'Tümü' || item.categories.includes(selectedCategory)
    return matchesSearch && matchesCategory
  })

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setMessage({ type: 'error', text: 'Dosya boyutu 5MB\'dan küçük olmalıdır' })
        return
      }
      setSelectedFile(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()


    let fileToUpload = selectedFile
    if (!fileToUpload && fileInputRef.current?.files?.[0]) {
      fileToUpload = fileInputRef.current.files[0]
    }

    if (!formData.title || !formData.description || formData.categories.length === 0 || !fileToUpload) {
      setMessage({ type: 'error', text: 'Lütfen tüm alanları doldurun ve bir dosya seçin' })
      return
    }

    setUploading(true)
    try {
      const formDataToSend = new FormData()
      formDataToSend.append('file', fileToUpload)
      formDataToSend.append('title', formData.title)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('categories', JSON.stringify(formData.categories))

      const response = await fetch('/api/gallery/upload', {
        method: 'POST',
        body: formDataToSend
      })

      if (response.ok) {
        setMessage({ type: 'success', text: 'Resim başarıyla yüklendi' })
        setShowAddModal(false)
        setFormData({ title: '', description: '', categories: [] })
        setSelectedFile(null)
        fetchGalleryItems()
      } else {
        throw new Error('Yükleme başarısız')
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Yükleme sırasında hata oluştu' })
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = (item: GalleryItem) => {
    setDeleteModal({ show: true, item })
  }

  const confirmDelete = async () => {
    if (!deleteModal.item) return

    setDeleting(true)
    try {

      const cloudinaryResponse = await fetch('/api/cloudinary/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ publicId: deleteModal.item.publicId })
      })

      if (!cloudinaryResponse.ok) {
        console.error('Cloudinary silme hatası:', cloudinaryResponse.statusText)

      }


      const response = await fetch('/api/gallery/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: deleteModal.item.id, publicId: deleteModal.item.publicId })
      })

      if (response.ok) {
        setMessage({ type: 'success', text: 'Resim başarıyla silindi' })
        fetchGalleryItems()
      } else {
        throw new Error('Veritabanı silme başarısız')
      }
    } catch (error) {
      console.error('Silme hatası:', error)
      setMessage({ type: 'error', text: 'Silme sırasında hata oluştu' })
    } finally {
      setDeleting(false)
      setDeleteModal({ show: false, item: null })
    }
  }

  const openEditModal = (item: GalleryItem) => {
    setEditingItem(item)
    setFormData({
      title: item.title,
      description: item.description,
      categories: item.categories
    })
  }

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!editingItem || !formData.title || !formData.description || formData.categories.length === 0) {
      setMessage({ type: 'error', text: 'Lütfen tüm alanları doldurun ve en az bir kategori seçin' })
      return
    }

    try {
      const response = await fetch('/api/gallery/edit', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: editingItem.id,
          title: formData.title,
          description: formData.description,
          categories: formData.categories
        })
      })

      if (response.ok) {
        setMessage({ type: 'success', text: 'Resim bilgileri güncellendi' })
        setEditingItem(null)
        setFormData({ title: '', description: '', categories: [] })
        fetchGalleryItems()
      } else {
        throw new Error('Güncelleme başarısız')
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Güncelleme sırasında hata oluştu' })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-primary-bg flex items-center justify-center">
        <div className="text-accent-gold">Yükleniyor...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  if (loadingData) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-accent-gold">Veriler yükleniyor...</div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        
        <div className="bg-gradient-to-r from-primary-card to-primary-secondary p-6 rounded-xl border border-gray-700 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-accent-gold to-yellow-500 rounded-lg flex items-center justify-center">
                <Image size={24} className="text-primary-bg" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-serif font-bold text-text-primary mb-1">
                  Galeri Yönetimi
                </h1>
                <p className="text-text-secondary text-sm">
                  Restoran galerisini yönetin ve yeni resimler ekleyin
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={fetchGalleryItems}
                className="flex items-center space-x-2 text-text-secondary hover:text-accent-gold transition-colors duration-300"
                title="Yenile"
              >
                <RefreshCw size={18} />
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center space-x-2 bg-accent-gold hover:bg-yellow-500 text-primary-bg px-4 py-2 rounded-lg transition-colors duration-300"
              >
                <Plus size={18} />
                <span>Resim Ekle</span>
              </button>
            </div>
          </div>
        </div>

        
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`p-4 rounded-lg border ${message?.type === 'success'
              ? 'bg-green-500/10 border-green-500/30'
              : 'bg-red-500/10 border-red-500/30'
              }`}
          >
            <div className="flex items-center space-x-2">
              {message?.type === 'success' ? (
                <CheckCircle size={16} className="text-green-500" />
              ) : (
                <AlertCircle size={16} className="text-red-500" />
              )}
              <span className={
                message?.type === 'success' ? 'text-green-500' : 'text-red-500'
              }>
                {message?.text}
              </span>
            </div>
          </motion.div>
        )}

        
        <div className="bg-gradient-to-br from-primary-card to-primary-secondary rounded-xl p-6 shadow-lg border border-gray-700">
          <div className="flex flex-col md:flex-row gap-4">
            
            <div className="flex-1">
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" />
                <input
                  type="text"
                  placeholder="Resim ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-primary-bg border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-text-primary focus:border-accent-gold focus:outline-none"
                />
              </div>
            </div>

            
            <div className="flex items-center space-x-2">
              <Filter size={20} className="text-text-secondary" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-primary-bg border border-gray-600 rounded-lg px-3 py-2 text-text-primary focus:border-accent-gold focus:outline-none"
              >
                <option value="Tümü">Tüm Kategoriler</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Image size={48} className="mx-auto text-text-secondary mb-4" />
              <p className="text-text-secondary">Henüz galeri öğesi bulunmamaktadır.</p>
            </div>
          ) : (
            filteredItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-br from-primary-card to-primary-secondary rounded-lg overflow-hidden shadow-lg border border-gray-700 group"
              >
                <div className="relative aspect-square">
                  <img
                    src={item.imageUrl}
                    alt={`${item.title} - ${item.categories.join(', ')}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300" />

                  
                  <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={() => openEditModal(item)}
                      className="p-2 bg-accent-gold hover:bg-yellow-500 text-primary-bg rounded-lg transition-colors duration-300"
                      title="Düzenle"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(item)}
                      className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-300"
                      title="Sil"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-1 bg-accent-gold text-primary-bg text-xs font-medium rounded">
                      {item.categories.join(', ')}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-serif font-semibold text-text-primary mb-2 truncate">
                    {item.title}
                  </h3>
                  <p className="text-text-secondary text-sm line-clamp-2">
                    {item.description}
                  </p>
                  <p className="text-text-secondary text-xs mt-2">
                    {new Date(item.createdAt).toLocaleDateString('tr-TR')}
                  </p>
                </div>
              </motion.div>
            ))
          )}
        </div>

        
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-gradient-to-br from-primary-card to-primary-secondary rounded-xl p-6 w-full max-w-md border border-gray-700"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-serif font-semibold text-text-primary">
                  Yeni Resim Ekle
                </h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-text-secondary hover:text-accent-gold transition-colors duration-300"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Resim Dosyası
                  </label>
                  <div
                    className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer group ${dragOver
                        ? 'border-accent-gold bg-accent-gold/10 scale-105 shadow-lg'
                        : 'border-gray-600 hover:border-accent-gold/50 hover:bg-accent-gold/5'
                      }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      ref={fileInputRef}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      required
                    />

                    
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center transition-colors duration-300 ${dragOver ? 'bg-accent-gold/20' : 'bg-gray-600/50 group-hover:bg-accent-gold/10'
                      }`}>
                      <Upload
                        size={32}
                        className={`transition-colors duration-300 ${dragOver ? 'text-accent-gold' : 'text-text-secondary group-hover:text-accent-gold'
                          }`}
                      />
                    </div>

                    
                    <div className="space-y-2">
                      <div className="text-text-primary font-medium text-lg">
                        {dragOver ? 'Resmi buraya bırakın' : 'Resmi sürükleyin veya tıklayın'}
                      </div>
                      <div className="text-text-secondary/70 text-sm space-y-1">
                        <p>Desteklenen formatlar: PNG, JPG, JPEG, WEBP</p>
                        <p className="text-accent-gold font-medium">Maksimum dosya boyutu: 5MB</p>
                      </div>
                    </div>

                    
                    <div className={`absolute inset-0 rounded-xl transition-opacity duration-300 pointer-events-none ${dragOver ? 'opacity-100' : 'opacity-0'
                      }`}>
                      <div className="absolute inset-0 rounded-xl border-2 border-accent-gold animate-pulse"></div>
                    </div>
                  </div>

                  
                  {selectedFile && (
                    <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                          <CheckCircle size={20} className="text-green-500" />
                        </div>
                        <div className="flex-1">
                          <p className="text-green-500 font-medium text-sm">
                            {selectedFile.name}
                          </p>
                          <p className="text-text-secondary text-xs">
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSelectedFile(null)}
                          className="text-red-500 hover:text-red-400 p-1"
                          title="Dosyayı kaldır"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Başlık
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-primary-bg border border-gray-600 rounded-lg px-3 py-2 text-text-primary focus:border-accent-gold focus:outline-none"
                    required
                  />
                </div>

                
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Açıklama
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full bg-primary-bg border border-gray-600 rounded-lg px-3 py-2 text-text-primary focus:border-accent-gold focus:outline-none"
                    required
                  />
                </div>

                
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Kategoriler
                  </label>
                  <div className="space-y-2">
                    {formData.categories.map((category, index) => (
                      <div key={index} className="flex items-center justify-between bg-primary-bg border border-gray-600 rounded-lg px-3 py-2">
                        <span className="text-text-primary">{category}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setFormData({
                              ...formData,
                              categories: formData.categories.filter((_, i) => i !== index)
                            })
                          }}
                          className="text-red-500 hover:text-red-400 ml-2"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                    <select
                      value=""
                      onChange={(e) => {
                        const selectedCategory = e.target.value
                        if (selectedCategory && !formData.categories.includes(selectedCategory)) {
                          setFormData({
                            ...formData,
                            categories: [...formData.categories, selectedCategory]
                          })
                        }
                        e.target.value = "" // Reset selection
                      }}
                      className="w-full bg-primary-bg border border-gray-600 rounded-lg px-3 py-2 text-text-primary focus:border-accent-gold focus:outline-none"
                    >
                      <option value="" disabled>Kategori seçin...</option>
                      {categories
                        .filter(category => !formData.categories.includes(category))
                        .map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                    </select>
                  </div>
                  <p className="text-text-secondary text-xs mt-1">
                    Seçilen kategoriler: {formData.categories.join(', ')}
                  </p>
                </div>

                
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 bg-gray-600 hover:bg-gray-500 text-white py-2 px-4 rounded-lg transition-colors duration-300"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    disabled={uploading}
                    className="flex-1 bg-accent-gold hover:bg-yellow-500 text-primary-bg py-2 px-4 rounded-lg transition-colors duration-300 disabled:opacity-50"
                  >
                    {uploading ? (
                      <>
                        <RefreshCw size={18} className="animate-spin inline mr-2" />
                        Yükleniyor...
                      </>
                    ) : (
                      <>
                        <Upload size={18} className="inline mr-2" />
                        Yükle
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        
        {editingItem && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-gradient-to-br from-primary-card to-primary-secondary rounded-xl p-6 w-full max-w-md border border-gray-700"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-serif font-semibold text-text-primary">
                  Resmi Düzenle
                </h2>
                <button
                  onClick={() => setEditingItem(null)}
                  className="text-text-secondary hover:text-accent-gold transition-colors duration-300"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleEdit} className="space-y-4">
                
                <div className="text-center">
                  <img
                    src={editingItem!.imageUrl}
                    alt={editingItem!.title}
                    className="w-32 h-32 object-cover rounded-lg mx-auto mb-2"
                  />
                  <p className="text-text-secondary text-sm">Mevcut resim</p>
                </div>

                
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Başlık
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-primary-bg border border-gray-600 rounded-lg px-3 py-2 text-text-primary focus:border-accent-gold focus:outline-none"
                    required
                  />
                </div>

                
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Açıklama
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full bg-primary-bg border border-gray-600 rounded-lg px-3 py-2 text-text-primary focus:border-accent-gold focus:outline-none"
                    required
                  />
                </div>

                
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Kategoriler
                  </label>
                  <div className="space-y-2">
                    {formData.categories.map((category, index) => (
                      <div key={index} className="flex items-center justify-between bg-primary-bg border border-gray-600 rounded-lg px-3 py-2">
                        <span className="text-text-primary">{category}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setFormData({
                              ...formData,
                              categories: formData.categories.filter((_, i) => i !== index)
                            })
                          }}
                          className="text-red-500 hover:text-red-400 ml-2"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                    <select
                      value=""
                      onChange={(e) => {
                        const selectedCategory = e.target.value
                        if (selectedCategory && !formData.categories.includes(selectedCategory)) {
                          setFormData({
                            ...formData,
                            categories: [...formData.categories, selectedCategory]
                          })
                        }
                        e.target.value = "" // Reset selection
                      }}
                      className="w-full bg-primary-bg border border-gray-600 rounded-lg px-3 py-2 text-text-primary focus:border-accent-gold focus:outline-none"
                    >
                      <option value="" disabled>Kategori seçin...</option>
                      {categories
                        .filter(category => !formData.categories.includes(category))
                        .map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                    </select>
                  </div>
                  <p className="text-text-secondary text-xs mt-1">
                    Seçilen kategoriler: {formData.categories.join(', ')}
                  </p>
                </div>

                
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setEditingItem(null)}
                    className="flex-1 bg-gray-600 hover:bg-gray-500 text-white py-2 px-4 rounded-lg transition-colors duration-300"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-accent-gold hover:bg-yellow-500 text-primary-bg py-2 px-4 rounded-lg transition-colors duration-300"
                  >
                    <Save size={18} className="inline mr-2" />
                    Kaydet
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>

      
      {deleteModal.show && deleteModal.item && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[9999]">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gradient-to-br from-primary-card to-primary-secondary rounded-xl p-6 w-full max-w-md border border-gray-700"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={32} className="text-red-500" />
              </div>
              <h2 className="text-xl font-serif font-semibold text-text-primary mb-2">
                Resmi Sil
              </h2>
              <p className="text-text-secondary mb-6">
                <strong>{deleteModal.item.title}</strong> resmini silmek istediğinizden emin misiniz?
                Bu işlem geri alınamaz.
              </p>

              <div className="flex space-x-3">
                <button
                  onClick={() => !deleting && setDeleteModal({ show: false, item: null })}
                  disabled={deleting}
                  className="flex-1 bg-gray-600 hover:bg-gray-500 text-white py-2 px-4 rounded-lg transition-colors duration-300 disabled:opacity-50"
                >
                  İptal
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={deleting}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition-colors duration-300 disabled:opacity-50"
                >
                  {deleting ? (
                    <>
                      <RefreshCw size={18} className="animate-spin inline mr-2" />
                      Siliniyor...
                    </>
                  ) : (
                    'Sil'
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AdminLayout>
  )

  return (
    <AdminLayout>
      <div className="space-y-6">
        
        <div className="bg-gradient-to-r from-primary-card to-primary-secondary p-6 rounded-xl border border-gray-700 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-accent-gold to-yellow-500 rounded-lg flex items-center justify-center">
                <Image size={24} className="text-primary-bg" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-serif font-bold text-text-primary mb-1">
                  Galeri Yönetimi
                </h1>
                <p className="text-text-secondary text-sm">
                  Restoran galerisini yönetin ve yeni resimler ekleyin
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={fetchGalleryItems}
                className="flex items-center space-x-2 text-text-secondary hover:text-accent-gold transition-colors duration-300"
                title="Yenile"
              >
                <RefreshCw size={18} />
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center space-x-2 bg-accent-gold hover:bg-yellow-500 text-primary-bg px-4 py-2 rounded-lg transition-colors duration-300"
              >
                <Plus size={18} />
                <span>Resim Ekle</span>
              </button>
            </div>
          </div>
        </div>

        
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`p-4 rounded-lg border ${message?.type === 'success'
              ? 'bg-green-500/10 border-green-500/30'
              : 'bg-red-500/10 border-red-500/30'
              }`}
          >
            <div className="flex items-center space-x-2">
              {message?.type === 'success' ? (
                <CheckCircle size={16} className="text-green-500" />
              ) : (
                <AlertCircle size={16} className="text-red-500" />
              )}
              <span className={
                message?.type === 'success' ? 'text-green-500' : 'text-red-500'
              }>
                {message?.text}
              </span>
            </div>
          </motion.div>
        )}

        
        <div className="bg-gradient-to-br from-primary-card to-primary-secondary rounded-xl p-6 shadow-lg border border-gray-700">
          <div className="flex flex-col md:flex-row gap-4">
            
            <div className="flex-1">
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" />
                <input
                  type="text"
                  placeholder="Resim ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-primary-bg border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-text-primary focus:border-accent-gold focus:outline-none"
                />
              </div>
            </div>

            
            <div className="flex items-center space-x-2">
              <Filter size={20} className="text-text-secondary" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-primary-bg border border-gray-600 rounded-lg px-3 py-2 text-text-primary focus:border-accent-gold focus:outline-none"
              >
                <option value="Tümü">Tüm Kategoriler</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Image size={48} className="mx-auto text-text-secondary mb-4" />
              <p className="text-text-secondary">Henüz galeri öğesi bulunmamaktadır.</p>
            </div>
          ) : (
            filteredItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-br from-primary-card to-primary-secondary rounded-lg overflow-hidden shadow-lg border border-gray-700 group"
              >
                <div className="relative aspect-square">
                  <img
                    src={item.imageUrl}
                    alt={`${item.title} - ${item.categories.join(', ')}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300" />

                  
                  <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={() => openEditModal(item)}
                      className="p-2 bg-accent-gold hover:bg-yellow-500 text-primary-bg rounded-lg transition-colors duration-300"
                      title="Düzenle"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(item)}
                      className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-300"
                      title="Sil"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-1 bg-accent-gold text-primary-bg text-xs font-medium rounded">
                      {item.categories.join(', ')}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-serif font-semibold text-text-primary mb-2 truncate">
                    {item.title}
                  </h3>
                  <p className="text-text-secondary text-sm line-clamp-2">
                    {item.description}
                  </p>
                  <p className="text-text-secondary text-xs mt-2">
                    {new Date(item.createdAt).toLocaleDateString('tr-TR')}
                  </p>
                </div>
              </motion.div>
            ))
          )}
        </div>

        
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-gradient-to-br from-primary-card to-primary-secondary rounded-xl p-6 w-full max-w-md border border-gray-700"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-serif font-semibold text-text-primary">
                  Yeni Resim Ekle
                </h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-text-secondary hover:text-accent-gold transition-colors duration-300"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Resim Dosyası
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="w-full bg-primary-bg border border-gray-600 rounded-lg px-3 py-2 text-text-primary focus:border-accent-gold focus:outline-none"
                    required
                  />
                  {(() => {
                    const file = selectedFile;
                    if (!file) return null;
                    return (
                      <p className="text-text-secondary text-sm mt-1">
                        Seçilen: {file!.name} ({file!.size ? (file!.size / 1024 / 1024).toFixed(2) : '0'} MB)
                      </p>
                    );
                  })()}
                </div>

                
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Başlık
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-primary-bg border border-gray-600 rounded-lg px-3 py-2 text-text-primary focus:border-accent-gold focus:outline-none"
                    required
                  />
                </div>

                
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Açıklama
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full bg-primary-bg border border-gray-600 rounded-lg px-3 py-2 text-text-primary focus:border-accent-gold focus:outline-none"
                    required
                  />
                </div>

                
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Kategoriler
                  </label>
                  <div className="space-y-2">
                    {formData.categories.map((category, index) => (
                      <div key={index} className="flex items-center justify-between bg-primary-bg border border-gray-600 rounded-lg px-3 py-2">
                        <span className="text-text-primary">{category}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setFormData({
                              ...formData,
                              categories: formData.categories.filter((_, i) => i !== index)
                            })
                          }}
                          className="text-red-500 hover:text-red-400 ml-2"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                    <select
                      value=""
                      onChange={(e) => {
                        const selectedCategory = e.target.value
                        if (selectedCategory && !formData.categories.includes(selectedCategory)) {
                          setFormData({
                            ...formData,
                            categories: [...formData.categories, selectedCategory]
                          })
                        }
                        e.target.value = "" // Reset selection
                      }}
                      className="w-full bg-primary-bg border border-gray-600 rounded-lg px-3 py-2 text-text-primary focus:border-accent-gold focus:outline-none"
                    >
                      <option value="" disabled>Kategori seçin...</option>
                      {categories
                        .filter(category => !formData.categories.includes(category))
                        .map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                    </select>
                  </div>
                  <p className="text-text-secondary text-xs mt-1">
                    Seçilen kategoriler: {formData.categories.join(', ')}
                  </p>
                </div>

                
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 bg-gray-600 hover:bg-gray-500 text-white py-2 px-4 rounded-lg transition-colors duration-300"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    disabled={uploading}
                    className="flex-1 bg-accent-gold hover:bg-yellow-500 text-primary-bg py-2 px-4 rounded-lg transition-colors duration-300 disabled:opacity-50"
                  >
                    {uploading ? (
                      <>
                        <RefreshCw size={18} className="animate-spin inline mr-2" />
                        Yükleniyor...
                      </>
                    ) : (
                      <>
                        <Upload size={18} className="inline mr-2" />
                        Yükle
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        
        {editingItem && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-gradient-to-br from-primary-card to-primary-secondary rounded-xl p-6 w-full max-w-md border border-gray-700"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-serif font-semibold text-text-primary">
                  Resmi Düzenle
                </h2>
                <button
                  onClick={() => setEditingItem(null)}
                  className="text-text-secondary hover:text-accent-gold transition-colors duration-300"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleEdit} className="space-y-4">
                
                <div className="text-center">
                  <img
                    src={editingItem!.imageUrl}
                    alt={editingItem!.title}
                    className="w-32 h-32 object-cover rounded-lg mx-auto mb-2"
                  />
                  <p className="text-text-secondary text-sm">Mevcut resim</p>
                </div>

                
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Başlık
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-primary-bg border border-gray-600 rounded-lg px-3 py-2 text-text-primary focus:border-accent-gold focus:outline-none"
                    required
                  />
                </div>

                
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Açıklama
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full bg-primary-bg border border-gray-600 rounded-lg px-3 py-2 text-text-primary focus:border-accent-gold focus:outline-none"
                    required
                  />
                </div>

                
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Kategoriler
                  </label>
                  <div className="space-y-2">
                    {formData.categories.map((category, index) => (
                      <div key={index} className="flex items-center justify-between bg-primary-bg border border-gray-600 rounded-lg px-3 py-2">
                        <span className="text-text-primary">{category}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setFormData({
                              ...formData,
                              categories: formData.categories.filter((_, i) => i !== index)
                            })
                          }}
                          className="text-red-500 hover:text-red-400 ml-2"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                    <select
                      value=""
                      onChange={(e) => {
                        const selectedCategory = e.target.value
                        if (selectedCategory && !formData.categories.includes(selectedCategory)) {
                          setFormData({
                            ...formData,
                            categories: [...formData.categories, selectedCategory]
                          })
                        }
                        e.target.value = "" // Reset selection
                      }}
                      className="w-full bg-primary-bg border border-gray-600 rounded-lg px-3 py-2 text-text-primary focus:border-accent-gold focus:outline-none"
                    >
                      <option value="" disabled>Kategori seçin...</option>
                      {categories
                        .filter(category => !formData.categories.includes(category))
                        .map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                    </select>
                  </div>
                  <p className="text-text-secondary text-xs mt-1">
                    Seçilen kategoriler: {formData.categories.join(', ')}
                  </p>
                </div>

                
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setEditingItem(null)}
                    className="flex-1 bg-gray-600 hover:bg-gray-500 text-white py-2 px-4 rounded-lg transition-colors duration-300"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-accent-gold hover:bg-yellow-500 text-primary-bg py-2 px-4 rounded-lg transition-colors duration-300"
                  >
                    <Save size={18} className="inline mr-2" />
                    Kaydet
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}



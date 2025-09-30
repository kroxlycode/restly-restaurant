'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Utensils,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Upload,
  AlertCircle,
  Star,
  Package,
  CheckCircle
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import AdminLayout from '@/components/AdminLayout'

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

const allergens = [
  { id: 'gluten', name: 'Gluten', icon: '🌾' },
  { id: 'dairy', name: 'Süt Ürünleri', icon: '🥛' },
  { id: 'nuts', name: 'Kuruyemiş', icon: '🥜' },
  { id: 'shellfish', name: 'Kabuklular', icon: '🦐' },
  { id: 'fish', name: 'Balık', icon: '🐟' },
  { id: 'eggs', name: 'Yumurta', icon: '🥚' }
]

export default function AdminMenuPage() {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()

  const [categories, setCategories] = useState<MenuCategory[]>([])
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loadingData, setLoadingData] = useState(true)
  const [activeTab, setActiveTab] = useState<'items' | 'categories'>('items')


  const [showItemForm, setShowItemForm] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [itemForm, setItemForm] = useState({
    name: '',
    categoryId: '',
    description: '',
    price: '',
    ingredients: '',
    image: '',
    popular: false,
    rating: 5.0,
    allergens: [] as string[]
  })
  const [dragOver, setDragOver] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)


  const [showCategoryForm, setShowCategoryForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null)
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: ''
  })


  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/admin/login')
    }
  }, [isAuthenticated, loading, router])

  useEffect(() => {
    if (isAuthenticated) {
      fetchMenuData()
    }
  }, [isAuthenticated])

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
      setMessage({ type: 'error', text: 'Veriler yüklenirken hata oluştu' })
    } finally {
      setLoadingData(false)
    }
  }

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

  const handleItemSubmit = async (e: React.FormEvent) => {
    e.preventDefault()


    let fileToUpload = selectedFile
    if (!fileToUpload && fileInputRef.current?.files?.[0]) {
      fileToUpload = fileInputRef.current.files[0]
    }


    if (!itemForm.name || !itemForm.categoryId || !itemForm.description || !itemForm.price) {
      setMessage({ type: 'error', text: 'Lütfen tüm zorunlu alanları doldurun' })
      return
    }



    if (!editingItem && !fileToUpload) {
      setMessage({ type: 'error', text: 'Lütfen bir resim seçin' })
      return
    }

    if (editingItem && !fileToUpload && !itemForm.image) {
      setMessage({ type: 'error', text: 'Mevcut resim kaldırıldıysa yeni resim seçmelisiniz' })
      return
    }

    setSaving(true)
    try {
      const formDataToSend = new FormData()


      if (fileToUpload) {
        formDataToSend.append('file', fileToUpload)
      }

      else if (editingItem && itemForm.image) {
        formDataToSend.append('existingImage', itemForm.image)
      }

      formDataToSend.append('name', itemForm.name)
      formDataToSend.append('categoryId', itemForm.categoryId)
      formDataToSend.append('description', itemForm.description)
      formDataToSend.append('price', itemForm.price)
      formDataToSend.append('ingredients', itemForm.ingredients)
      formDataToSend.append('popular', itemForm.popular.toString())
      formDataToSend.append('rating', itemForm.rating.toString())
      formDataToSend.append('allergens', JSON.stringify(itemForm.allergens))


      if (editingItem) {
        formDataToSend.append('itemId', editingItem.id)
        formDataToSend.append('action', 'update_item')
      } else {
        formDataToSend.append('action', 'add_item')
      }

      const response = await fetch('/api/menu', {
        method: 'POST',
        body: formDataToSend
      })

      if (response.ok) {
        setMessage({ type: 'success', text: editingItem ? 'Ürün güncellendi' : 'Ürün eklendi' })
        setShowItemForm(false)
        setEditingItem(null)
        resetItemForm()
        setSelectedFile(null)
        fetchMenuData()
      } else {
        throw new Error('Ürün kaydedilemedi')
      }
    } catch (error) {
      console.error('Ürün kaydetme hatası:', error)
      setMessage({ type: 'error', text: 'Ürün kaydedilirken hata oluştu' })
    } finally {
      setSaving(false)
    }
  }

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const action = editingCategory ? 'update_category' : 'add_category'
      const payload = editingCategory
        ? { action, category: { ...categoryForm, id: editingCategory.id } }
        : { action, category: categoryForm }

      const response = await fetch('/api/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        await fetchMenuData()
        setShowCategoryForm(false)
        setEditingCategory(null)
        resetCategoryForm()
        setMessage({ type: 'success', text: `Kategori ${editingCategory ? 'güncellendi' : 'eklendi'}` })
        setTimeout(() => setMessage(null), 3000)
      } else {
        throw new Error('Kategori kaydedilemedi')
      }
    } catch (error) {
      console.error('Kategori kaydetme hatası:', error)
      setMessage({ type: 'error', text: 'Kategori kaydedilirken hata oluştu' })
      setTimeout(() => setMessage(null), 3000)
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm('Bu ürünü silmek istediğinizden emin misiniz?')) return

    try {
      const response = await fetch('/api/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete_item', itemId }),
      })

      if (response.ok) {
        await fetchMenuData()
        setMessage({ type: 'success', text: 'Ürün başarıyla silindi' })
        setTimeout(() => setMessage(null), 3000)
      } else {
        throw new Error('Ürün silinemedi')
      }
    } catch (error) {
      console.error('Ürün silme hatası:', error)
      setMessage({ type: 'error', text: 'Ürün silinirken hata oluştu' })
      setTimeout(() => setMessage(null), 3000)
    }
  }

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm('Bu kategoriyi silmek istediğinizden emin misiniz? Bu kategorideki tüm ürünler de silinecek.')) return

    try {
      const response = await fetch('/api/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete_category', categoryId }),
      })

      if (response.ok) {
        await fetchMenuData()
        setMessage({ type: 'success', text: 'Kategori ve ürünleri başarıyla silindi' })
        setTimeout(() => setMessage(null), 3000)
      } else {
        throw new Error('Kategori silinemedi')
      }
    } catch (error) {
      console.error('Kategori silme hatası:', error)
      setMessage({ type: 'error', text: 'Kategori silinirken hata oluştu' })
      setTimeout(() => setMessage(null), 3000)
    }
  }

  const resetItemForm = () => {
    setItemForm({
      name: '',
      categoryId: '',
      description: '',
      price: '',
      ingredients: '',
      image: '',
      popular: false,
      rating: 5.0,
      allergens: []
    })
    setSelectedFile(null)
  }

  const resetCategoryForm = () => {
    setCategoryForm({
      name: '',
      description: ''
    })
  }

  const startEditItem = (item: MenuItem) => {
    setEditingItem(item)
    setItemForm({
      name: item.name,
      categoryId: item.categoryId,
      description: item.description,
      price: item.price.toString(),
      ingredients: item.ingredients.join(', '),
      image: item.image,
      popular: item.popular,
      rating: item.rating,
      allergens: item.allergens
    })
    setShowItemForm(true)
  }

  const startEditCategory = (category: MenuCategory) => {
    setEditingCategory(category)
    setCategoryForm({
      name: category.name,
      description: category.description
    })
    setShowCategoryForm(true)
  }

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId)
    return category?.name || 'Kategorisiz'
  }

  if (loading || loadingData) {
    return (
      <div className="min-h-screen bg-primary-bg flex items-center justify-center">
        <div className="text-accent-gold">Yükleniyor...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        
        <div className="bg-gradient-to-r from-primary-card to-primary-secondary p-6 rounded-xl border border-gray-700 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-accent-gold to-yellow-500 rounded-lg flex items-center justify-center">
                <Utensils size={24} className="text-primary-bg" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-serif font-bold text-text-primary mb-1">
                  Menü Yönetimi
                </h1>
                <p className="text-text-secondary text-sm">
                  Menü ürünlerini ve kategorilerini yönetin
                </p>
              </div>
            </div>
          </div>
        </div>

        
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`p-4 rounded-lg border ${
              message.type === 'success'
                ? 'bg-green-500/10 border-green-500/30'
                : 'bg-red-500/10 border-red-500/30'
            }`}
          >
            <div className="flex items-center space-x-2">
              {message.type === 'success' ? (
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              ) : (
                <AlertCircle size={20} className="text-red-500" />
              )}
              <span className={
                message.type === 'success' ? 'text-green-500' : 'text-red-500'
              }>
                {message.text}
              </span>
            </div>
          </motion.div>
        )}

        
        <div className="bg-primary-card rounded-xl border border-gray-700 p-6">
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setActiveTab('items')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'items'
                  ? 'bg-accent-gold text-primary-bg'
                  : 'text-text-secondary hover:text-accent-gold'
              }`}
            >
              Ürünler ({loadingData ? '...' : menuItems.length})
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'categories'
                  ? 'bg-accent-gold text-primary-bg'
                  : 'text-text-secondary hover:text-accent-gold'
              }`}
            >
              Kategoriler ({loadingData ? '...' : categories.length})
            </button>
          </div>

          
          {activeTab === 'items' && !loadingData && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-text-primary">Menü Ürünleri</h2>
                <button
                  onClick={() => {
                    resetItemForm()
                    setEditingItem(null)
                    setShowItemForm(true)
                  }}
                  className="bg-accent-gold hover:bg-yellow-500 text-primary-bg px-4 py-2 rounded-lg transition-colors duration-300 flex items-center space-x-2"
                >
                  <Plus size={20} />
                  <span>Yeni Ürün</span>
                </button>
              </div>

              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {menuItems.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-primary-secondary rounded-xl p-4 border border-gray-700"
                  >
                    <div className="relative mb-4">
                      <img
                        src={item.image || '/images/placeholder.jpg'}
                        alt={item.name}
                        className="w-full h-32 object-cover rounded-lg"
                        onError={(e) => {
                          e.currentTarget.src = '/images/placeholder.jpg'
                        }}
                      />
                      {item.popular && (
                        <div className="absolute top-2 left-2 bg-accent-red text-white px-2 py-1 rounded-full text-xs">
                          Popüler
                        </div>
                      )}
                      <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded-full text-sm">
                        ₺{item.price}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-text-primary">{item.name}</h3>
                        <div className="flex items-center space-x-1">
                          <Star size={14} className="text-yellow-400 fill-current" />
                          <span className="text-text-secondary text-sm">{item.rating}</span>
                        </div>
                      </div>

                      <p className="text-text-secondary text-sm line-clamp-2">
                        {item.description}
                      </p>

                      <div className="text-xs text-text-secondary">
                        {getCategoryName(item.categoryId)}
                      </div>

                      <div className="flex justify-end space-x-2 pt-2">
                        <button
                          onClick={() => startEditItem(item)}
                          className="p-2 text-accent-gold hover:bg-accent-gold/20 rounded-lg transition-colors"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="p-2 text-red-500 hover:bg-red-500/20 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {menuItems.length === 0 && (
                <div className="text-center py-16">
                  <Package size={64} className="mx-auto text-text-secondary mb-4" />
                  <h3 className="text-xl font-semibold text-text-primary mb-2">
                    Henüz ürün eklenmemiş
                  </h3>
                  <p className="text-text-secondary">
                    İlk menü ürününü eklemek için &quot;Yeni Ürün&quot; butonuna tıklayın
                  </p>
                </div>
              )}
            </div>
          )}

          
          {activeTab === 'items' && loadingData && (
            <div className="text-center py-16">
              <div className="text-accent-gold text-xl">Ürünler yükleniyor...</div>
            </div>
          )}

          
          {activeTab === 'categories' && !loadingData && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-text-primary">Menü Kategorileri</h2>
                <button
                  onClick={() => {
                    resetCategoryForm()
                    setEditingCategory(null)
                    setShowCategoryForm(true)
                  }}
                  className="bg-accent-gold hover:bg-yellow-500 text-primary-bg px-4 py-2 rounded-lg transition-colors duration-300 flex items-center space-x-2"
                >
                  <Plus size={20} />
                  <span>Yeni Kategori</span>
                </button>
              </div>

              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category) => {
                  const itemCount = menuItems.filter(item => item.categoryId === category.id).length
                  return (
                    <motion.div
                      key={category.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-primary-secondary rounded-xl p-6 border border-gray-700"
                    >
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-semibold text-text-primary mb-1">
                            {category.name}
                          </h3>
                          <p className="text-text-secondary text-sm">
                            {category.description}
                          </p>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <span className="text-text-secondary">Ürün sayısı:</span>
                          <span className="text-accent-gold font-medium">{itemCount}</span>
                        </div>

                        <div className="flex justify-end space-x-2 pt-2">
                          <button
                            onClick={() => startEditCategory(category)}
                            className="p-2 text-accent-gold hover:bg-accent-gold/20 rounded-lg transition-colors"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(category.id)}
                            className="p-2 text-red-500 hover:bg-red-500/20 rounded-lg transition-colors"
                            disabled={itemCount > 0}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>

              {categories.length === 0 && (
                <div className="text-center py-16">
                  <Package size={64} className="mx-auto text-text-secondary mb-4" />
                  <h3 className="text-xl font-semibold text-text-primary mb-2">
                    Henüz kategori eklenmemiş
                  </h3>
                  <p className="text-text-secondary">
                    İlk kategoriyi eklemek için &quot;Yeni Kategori&quot; butonuna tıklayın
                  </p>
                </div>
              )}
            </div>
          )}

          
          {activeTab === 'categories' && loadingData && (
            <div className="text-center py-16">
              <div className="text-accent-gold text-xl">Kategoriler yükleniyor...</div>
            </div>
          )}
        </div>

        
        {showItemForm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-primary-card rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-text-primary">
                    {editingItem ? 'Ürün Düzenle' : 'Yeni Ürün Ekle'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowItemForm(false)
                      setEditingItem(null)
                      resetItemForm()
                    }}
                    className="p-2 hover:bg-primary-secondary rounded-lg transition-colors"
                  >
                    <X size={20} className="text-text-secondary" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleItemSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Ürün Adı *
                    </label>
                    <input
                      type="text"
                      value={itemForm.name}
                      onChange={(e) => setItemForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full bg-primary-bg border border-gray-600 rounded-lg px-4 py-2 text-text-primary focus:border-accent-gold focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Kategori *
                    </label>
                    <select
                      value={itemForm.categoryId}
                      onChange={(e) => setItemForm(prev => ({ ...prev, categoryId: e.target.value }))}
                      className="w-full bg-primary-bg border border-gray-600 rounded-lg px-4 py-2 text-text-primary focus:border-accent-gold focus:outline-none"
                      required
                    >
                      <option value="">Kategori seçin</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Fiyat (₺) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={itemForm.price}
                      onChange={(e) => setItemForm(prev => ({ ...prev, price: e.target.value }))}
                      className="w-full bg-primary-bg border border-gray-600 rounded-lg px-4 py-2 text-text-primary focus:border-accent-gold focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Puan
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      value={itemForm.rating}
                      onChange={(e) => setItemForm(prev => ({ ...prev, rating: parseFloat(e.target.value) }))}
                      className="w-full bg-primary-bg border border-gray-600 rounded-lg px-4 py-2 text-text-primary focus:border-accent-gold focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Açıklama *
                  </label>
                  <textarea
                    value={itemForm.description}
                    onChange={(e) => setItemForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full bg-primary-bg border border-gray-600 rounded-lg px-4 py-2 text-text-primary focus:border-accent-gold focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    İçindekiler (virgülle ayırın)
                  </label>
                  <input
                    type="text"
                    value={itemForm.ingredients}
                    onChange={(e) => setItemForm(prev => ({ ...prev, ingredients: e.target.value }))}
                    placeholder="domates, soğan, sarımsak..."
                    className="w-full bg-primary-bg border border-gray-600 rounded-lg px-4 py-2 text-text-primary focus:border-accent-gold focus:outline-none"
                  />
                </div>

                
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Ürün Resmi
                  </label>

                  
                  {editingItem && itemForm.image && !selectedFile && (
                    <div className="mb-4">
                      <p className="text-text-secondary text-sm mb-2">Mevcut Resim:</p>
                      <div className="relative inline-block">
                        <img
                          src={itemForm.image}
                          alt="Mevcut ürün resmi"
                          className="w-32 h-32 object-cover rounded-lg border border-gray-600"
                          onError={(e) => {
                            e.currentTarget.src = '/images/placeholder.jpg'
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => setItemForm(prev => ({ ...prev, image: '' }))}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 text-xs hover:bg-red-600 transition-colors"
                          title="Mevcut resmi kaldır"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    </div>
                  )}

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
                      required={!editingItem && !itemForm.image}
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
                        {dragOver ? 'Resmi buraya bırakın' :
                         editingItem && itemForm.image ? 'Yeni resim seçin (mevcut resim korunacak)' :
                         'Resmi sürükleyin veya tıklayın'}
                      </div>
                      <div className="text-text-secondary/70 text-sm space-y-1">
                        <p>Desteklenen formatlar: PNG, JPG, JPEG, WEBP</p>
                        <p className="text-accent-gold font-medium">Maksimum dosya boyutu: 5MB</p>
                        {editingItem && itemForm.image && (
                          <p className="text-green-400 font-medium">Yeni resim seçmezseniz mevcut resim korunacak</p>
                        )}
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
                    Alerjenler
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {allergens.map((allergen) => (
                      <label key={allergen.id} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={itemForm.allergens.includes(allergen.id)}
                          onChange={(e) => {
                            const checked = e.target.checked
                            setItemForm(prev => ({
                              ...prev,
                              allergens: checked
                                ? [...prev.allergens, allergen.id]
                                : prev.allergens.filter(a => a !== allergen.id)
                            }))
                          }}
                          className="rounded border-gray-600 text-accent-gold focus:ring-accent-gold"
                        />
                        <span className="text-text-secondary text-sm">
                          {allergen.icon} {allergen.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="popular"
                    checked={itemForm.popular}
                    onChange={(e) => setItemForm(prev => ({ ...prev, popular: e.target.checked }))}
                    className="rounded border-gray-600 text-accent-gold focus:ring-accent-gold"
                  />
                  <label htmlFor="popular" className="text-text-secondary cursor-pointer">
                    Popüler ürün olarak işaretle
                  </label>
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-700">
                  <button
                    type="button"
                    onClick={() => {
                      setShowItemForm(false)
                      setEditingItem(null)
                      resetItemForm()
                    }}
                    className="px-6 py-2 text-text-secondary hover:text-white transition-colors"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-accent-gold hover:bg-yellow-500 text-primary-bg px-6 py-2 rounded-lg transition-colors duration-300 disabled:opacity-50 flex items-center space-x-2"
                  >
                    {saving ? (
                      <>
                        <div className="w-5 h-5 border-2 border-primary-bg border-t-transparent rounded-full animate-spin"></div>
                        <span>Kaydediliyor...</span>
                      </>
                    ) : (
                      <>
                        <Save size={20} />
                        <span>{editingItem ? 'Güncelle' : 'Kaydet'}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        
        {showCategoryForm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-primary-card rounded-xl max-w-md w-full"
            >
              <div className="p-6 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-text-primary">
                    {editingCategory ? 'Kategori Düzenle' : 'Yeni Kategori Ekle'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowCategoryForm(false)
                      setEditingCategory(null)
                      resetCategoryForm()
                    }}
                    className="p-2 hover:bg-primary-secondary rounded-lg transition-colors"
                  >
                    <X size={20} className="text-text-secondary" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleCategorySubmit} className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Kategori Adı *
                  </label>
                  <input
                    type="text"
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-primary-bg border border-gray-600 rounded-lg px-4 py-2 text-text-primary focus:border-accent-gold focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Açıklama *
                  </label>
                  <textarea
                    value={categoryForm.description}
                    onChange={(e) => setCategoryForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full bg-primary-bg border border-gray-600 rounded-lg px-4 py-2 text-text-primary focus:border-accent-gold focus:outline-none"
                    required
                  />
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-700">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCategoryForm(false)
                      setEditingCategory(null)
                      resetCategoryForm()
                    }}
                    className="px-6 py-2 text-text-secondary hover:text-white transition-colors"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-accent-gold hover:bg-yellow-500 text-primary-bg px-6 py-2 rounded-lg transition-colors duration-300 disabled:opacity-50 flex items-center space-x-2"
                  >
                    {saving ? (
                      <>
                        <div className="w-5 h-5 border-2 border-primary-bg border-t-transparent rounded-full animate-spin"></div>
                        <span>Kaydediliyor...</span>
                      </>
                    ) : (
                      <>
                        <Save size={20} />
                        <span>{editingCategory ? 'Güncelle' : 'Kaydet'}</span>
                      </>
                    )}
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



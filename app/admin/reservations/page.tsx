'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar,
  Clock,
  Users,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  Filter,
  Eye,
  Trash2,
  Send,
  X
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import {
  getReservations,
  updateReservationStatus,
  deleteReservation,
  type Reservation
} from '@/lib/dataStore'
import AdminLayout from '@/components/AdminLayout'

export default function AdminReservationsPage() {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loadingData, setLoadingData] = useState(true)
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all')
  const [emailModalOpen, setEmailModalOpen] = useState(false)
  const [emailMessage, setEmailMessage] = useState('')
  const [sendingEmail, setSendingEmail] = useState(false)
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [reservationToDelete, setReservationToDelete] = useState<Reservation | null>(null)
  const [deletingReservation, setDeletingReservation] = useState(false)

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/admin/login')
    }
  }, [isAuthenticated, loading, router])

  useEffect(() => {
    const fetchReservations = async () => {
      if (isAuthenticated) {
        try {
          const data = await getReservations()
          setReservations(data)
        } catch (error) {
          console.error('Rezervasyonlar yüklenemedi:', error)
        } finally {
          setLoadingData(false)
        }
      }
    }

    fetchReservations()
  }, [isAuthenticated])

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

  const filteredReservations = reservations.filter(reservation => {
    const matchesSearch = reservation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.phone.includes(searchTerm)

    const matchesFilter = filterStatus === 'all' || reservation.status === filterStatus

    return matchesSearch && matchesFilter
  })

  const handleStatusUpdate = async (id: string, status: Reservation['status']) => {
    try {
      await updateReservationStatus(id, status)
      const updatedData = await getReservations()
      setReservations(updatedData)
      if (selectedReservation && selectedReservation.id === id) {
        setSelectedReservation({ ...selectedReservation, status })
      }


      const statusText = status === 'confirmed' ? 'onaylandı' : status === 'cancelled' ? 'iptal edildi' : 'güncellendi'
      setNotification({
        type: 'success',
        message: `Rezervasyon başarıyla ${statusText}!`
      })
      setTimeout(() => setNotification(null), 4000)
    } catch (error) {
      console.error('Rezervasyon durumu güncellenemedi:', error)
      setNotification({
        type: 'error',
        message: 'Rezervasyon durumu güncellenirken hata oluştu!'
      })
      setTimeout(() => setNotification(null), 4000)
    }
  }

  const handleDeleteClick = (reservation: Reservation) => {
    setReservationToDelete(reservation)
    setDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!reservationToDelete) return

    setDeletingReservation(true)
    try {
      await deleteReservation(reservationToDelete.id)
      const updatedData = await getReservations()
      setReservations(updatedData)
      if (selectedReservation && selectedReservation.id === reservationToDelete.id) {
        setSelectedReservation(null)
      }


      setNotification({
        type: 'success',
        message: 'Rezervasyon başarıyla silindi!'
      })
      setTimeout(() => setNotification(null), 4000)


      setDeleteModalOpen(false)
      setReservationToDelete(null)
    } catch (error) {
      console.error('Rezervasyon silinemedi:', error)
      setNotification({
        type: 'error',
        message: 'Rezervasyon silinirken hata oluştu!'
      })
      setTimeout(() => setNotification(null), 4000)
    } finally {
      setDeletingReservation(false)
    }
  }

  const handleSendEmail = async () => {
    if (!selectedReservation || !emailMessage.trim()) return

    setSendingEmail(true)
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: selectedReservation.email,
          reservation: selectedReservation,
          message: emailMessage.trim()
        }),
      })

      if (response.ok) {
        setEmailModalOpen(false)
        setEmailMessage('')
        setNotification({ type: 'success', message: 'E-posta başarıyla gönderildi!' })
        setTimeout(() => setNotification(null), 4000)
      } else {
        throw new Error('E-posta gönderilemedi')
      }
    } catch (error) {
      console.error('E-posta gönderme hatası:', error)
      setNotification({ type: 'error', message: 'E-posta gönderilirken bir hata oluştu' })
      setTimeout(() => setNotification(null), 4000)
    } finally {
      setSendingEmail(false)
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  const formatReservationDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return new Intl.DateTimeFormat('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date)
  }

  const getStatusColor = (status: Reservation['status']) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-500 bg-yellow-500/20'
      case 'confirmed':
        return 'text-green-500 bg-green-500/20'
      case 'cancelled':
        return 'text-red-500 bg-red-500/20'
      default:
        return 'text-text-secondary bg-primary-card'
    }
  }

  const getStatusIcon = (status: Reservation['status']) => {
    switch (status) {
      case 'pending':
        return <AlertCircle size={16} />
      case 'confirmed':
        return <CheckCircle size={16} />
      case 'cancelled':
        return <XCircle size={16} />
      default:
        return <Clock size={16} />
    }
  }

  const getStatusText = (status: Reservation['status']) => {
    switch (status) {
      case 'pending':
        return 'Beklemede'
      case 'confirmed':
        return 'Onaylandı'
      case 'cancelled':
        return 'İptal Edildi'
      default:
        return 'Bilinmiyor'
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-serif font-bold text-text-primary mb-2">
              Rezervasyonlar
            </h1>
            <p className="text-text-secondary">
              {reservations.filter(r => r.status === 'pending').length} bekleyen rezervasyon
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" />
            <input
              type="text"
              placeholder="Rezervasyonlarda ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-primary-card border border-gray-700 rounded-lg text-text-primary focus:border-accent-gold focus:outline-none"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-4 py-2 bg-primary-card border border-gray-700 rounded-lg text-text-primary focus:border-accent-gold focus:outline-none"
          >
            <option value="all">Tüm Rezervasyonlar</option>
            <option value="pending">Beklemede</option>
            <option value="confirmed">Onaylandı</option>
            <option value="cancelled">İptal Edildi</option>
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            {filteredReservations.length === 0 ? (
              <div className="card text-center py-8">
                <Calendar size={48} className="mx-auto text-text-secondary mb-4" />
                <p className="text-text-secondary">Rezervasyon bulunamadı</p>
              </div>
            ) : (
              filteredReservations.map((reservation, index) => (
                <motion.div
                  key={reservation.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  onClick={() => setSelectedReservation(reservation)}
                  className={`card cursor-pointer transition-all duration-300 hover:scale-105 ${selectedReservation?.id === reservation.id ? 'border-accent-gold' : ''
                    } ${reservation.status === 'pending' ? 'border-l-4 border-l-yellow-500' : ''}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-text-primary">
                        {reservation.name}
                      </span>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs flex items-center space-x-1 ${getStatusColor(reservation.status)}`}>
                      {getStatusIcon(reservation.status)}
                      <span>{getStatusText(reservation.status)}</span>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-text-secondary">
                    <div className="flex items-center space-x-2">
                      <Calendar size={14} />
                      <span>{formatReservationDate(reservation.date)} - {reservation.time}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users size={14} />
                      <span>{reservation.guests} kişi</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone size={14} />
                      <span>{reservation.phone}</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-700">
                    <span className="text-xs text-text-secondary">
                      {formatDate(reservation.createdAt)}
                    </span>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          <div className="lg:col-span-2">
            {selectedReservation ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="card h-fit"
              >
                <div className="flex items-start justify-between mb-6 pb-4 border-b border-gray-700">
                  <div>
                    <h2 className="text-xl font-serif font-bold text-text-primary mb-2">
                      Rezervasyon Detayları
                    </h2>
                    <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${getStatusColor(selectedReservation.status)}`}>
                      {getStatusIcon(selectedReservation.status)}
                      <span>{getStatusText(selectedReservation.status)}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteClick(selectedReservation)}
                    className="p-2 text-text-secondary hover:text-red-500 transition-colors duration-300"
                    title="Sil"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="font-semibold text-text-primary mb-3">Müşteri Bilgileri</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <Users size={14} className="text-text-secondary" />
                        <span className="text-text-primary">{selectedReservation.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail size={14} className="text-text-secondary" />
                        <span className="text-text-primary">{selectedReservation.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone size={14} className="text-text-secondary" />
                        <span className="text-text-primary">{selectedReservation.phone}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-text-primary mb-3">Rezervasyon Bilgileri</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <Calendar size={14} className="text-text-secondary" />
                        <span className="text-text-primary">{formatReservationDate(selectedReservation.date)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock size={14} className="text-text-secondary" />
                        <span className="text-text-primary">{selectedReservation.time}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users size={14} className="text-text-secondary" />
                        <span className="text-text-primary">{selectedReservation.guests} kişi</span>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedReservation.specialRequests && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-text-primary mb-3">Özel İstekler</h3>
                    <p className="text-text-secondary bg-primary-secondary p-3 rounded-lg">
                      {selectedReservation.specialRequests}
                    </p>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="font-semibold text-text-primary mb-3">Onaylar</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <CheckCircle size={14} className="text-green-500" />
                      <span className="text-text-secondary">KVKK Onayı: Verildi</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {selectedReservation.marketingConsent ? (
                        <CheckCircle size={14} className="text-green-500" />
                      ) : (
                        <XCircle size={14} className="text-red-500" />
                      )}
                      <span className="text-text-secondary">
                        Pazarlama İletişimi: {selectedReservation.marketingConsent ? 'Onaylandı' : 'Onaylanmadı'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-700">
                  <div className="flex flex-wrap gap-3">
                    {selectedReservation.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleStatusUpdate(selectedReservation.id, 'confirmed')}
                          className="btn-primary flex items-center space-x-2"
                        >
                          <CheckCircle size={18} />
                          <span>Onayla</span>
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(selectedReservation.id, 'cancelled')}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-300 flex items-center space-x-2"
                        >
                          <XCircle size={18} />
                          <span>İptal Et</span>
                        </button>
                      </>
                    )}

                    {selectedReservation.status === 'confirmed' && (
                      <button
                        onClick={() => handleStatusUpdate(selectedReservation.id, 'cancelled')}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-300 flex items-center space-x-2"
                      >
                        <XCircle size={18} />
                        <span>İptal Et</span>
                      </button>
                    )}

                    {selectedReservation.status === 'cancelled' && (
                      <button
                        onClick={() => handleStatusUpdate(selectedReservation.id, 'confirmed')}
                        className="btn-primary flex items-center space-x-2"
                      >
                        <CheckCircle size={18} />
                        <span>Yeniden Onayla</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setEmailModalOpen(true)
                        setEmailMessage('')
                      }}
                      className="btn-secondary flex items-center space-x-2"
                    >
                      <Mail size={18} />
                      <span>E-posta Gönder</span>
                    </button>

                    <a
                      href={`tel:${selectedReservation.phone}`}
                      className="btn-secondary flex items-center space-x-2"
                    >
                      <Phone size={18} />
                      <span>Ara</span>
                    </a>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-700 text-xs text-text-secondary">
                  <p>Oluşturulma: {formatDate(selectedReservation.createdAt)}</p>
                </div>
              </motion.div>
            ) : (
              <div className="card h-64 flex items-center justify-center">
                <div className="text-center">
                  <Calendar size={48} className="mx-auto text-text-secondary mb-4" />
                  <p className="text-text-secondary">Görüntülemek için bir rezervasyon seçin</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {emailModalOpen && selectedReservation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-primary-card rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-serif font-bold text-text-primary flex items-center space-x-2">
                  <Mail size={20} className="text-accent-gold" />
                  <span>E-posta Gönder</span>
                </h2>
                <button
                  onClick={() => setEmailModalOpen(false)}
                  className="text-text-secondary hover:text-accent-gold transition-colors duration-300"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="bg-primary-secondary rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-text-primary mb-3">Rezervasyon Bilgileri</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-text-secondary">Müşteri:</span>
                    <p className="text-text-primary font-medium">{selectedReservation.name}</p>
                  </div>
                  <div>
                    <span className="text-text-secondary">E-posta:</span>
                    <p className="text-text-primary">{selectedReservation.email}</p>
                  </div>
                  <div>
                    <span className="text-text-secondary">Tarih:</span>
                    <p className="text-text-primary">{formatReservationDate(selectedReservation.date)} - {selectedReservation.time}</p>
                  </div>
                  <div>
                    <span className="text-text-secondary">Kişi Sayısı:</span>
                    <p className="text-text-primary">{selectedReservation.guests} kişi</p>
                  </div>
                  {selectedReservation.specialRequests && (
                    <div className="md:col-span-2">
                      <span className="text-text-secondary">Özel İstekler:</span>
                      <p className="text-text-primary">{selectedReservation.specialRequests}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Mesajınız
                </label>
                <textarea
                  value={emailMessage}
                  onChange={(e) => setEmailMessage(e.target.value)}
                  rows={6}
                  className="w-full bg-primary-bg border border-gray-600 rounded-lg px-3 py-2 text-text-primary focus:border-accent-gold focus:outline-none resize-none"
                  placeholder="Müşteriye göndereceğiniz mesajı yazın..."
                  required
                />
              </div>

              {emailMessage && (
                <div className="bg-primary-bg rounded-lg p-4 mb-6 border border-gray-600">
                  <h4 className="font-semibold text-text-primary mb-2">E-posta Önizlemesi:</h4>
                  <div className="text-sm text-text-secondary whitespace-pre-wrap">
                    {emailMessage}
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setEmailModalOpen(false)}
                  className="px-4 py-2 text-text-secondary hover:text-accent-gold transition-colors duration-300"
                  disabled={sendingEmail}
                >
                  İptal
                </button>
                <button
                  onClick={handleSendEmail}
                  disabled={!emailMessage.trim() || sendingEmail}
                  className="bg-accent-gold hover:bg-yellow-500 text-primary-bg px-6 py-2 rounded-lg transition-colors duration-300 disabled:opacity-50 flex items-center space-x-2"
                >
                  {sendingEmail ? (
                    <>
                      <div className="w-4 h-4 border-2 border-primary-bg border-t-transparent rounded-full animate-spin"></div>
                      <span>Gönderiliyor...</span>
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      <span>Gönder</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteModalOpen && reservationToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-primary-card rounded-xl p-6 w-full max-w-md mx-4 shadow-2xl border border-gray-700"
            >
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="mb-4"
                >
                  <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto">
                    <AlertCircle size={32} className="text-white" />
                  </div>
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-xl font-serif font-bold text-text-primary mb-2"
                >
                  Rezervasyon Silme Onayı
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-text-secondary mb-6"
                >
                  Bu rezervasyonu silmek istediğinize emin misiniz?
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-primary-secondary rounded-lg p-4 mb-6"
                >
                  <div className="text-sm space-y-2">
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Müşteri:</span>
                      <span className="text-text-primary font-medium">{reservationToDelete.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Tarih:</span>
                      <span className="text-text-primary">{formatReservationDate(reservationToDelete.date)} - {reservationToDelete.time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Kişi Sayısı:</span>
                      <span className="text-text-primary">{reservationToDelete.guests} kişi</span>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="flex justify-end space-x-3"
                >
                  <button
                    onClick={() => {
                      setDeleteModalOpen(false)
                      setReservationToDelete(null)
                    }}
                    className="px-4 py-2 text-text-secondary hover:text-accent-gold transition-colors duration-300"
                    disabled={deletingReservation}
                  >
                    İptal
                  </button>
                  <button
                    onClick={handleDeleteConfirm}
                    disabled={deletingReservation}
                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors duration-300 disabled:opacity-50 flex items-center space-x-2"
                  >
                    {deletingReservation ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Silinıyor...</span>
                      </>
                    ) : (
                      <>
                        <Trash2 size={18} />
                        <span>Sil</span>
                      </>
                    )}
                  </button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {notification && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-primary-card rounded-xl p-8 max-w-sm w-full mx-4 shadow-2xl border border-gray-700"
            >
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="mb-4"
                >
                  {notification.type === 'success' ? (
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle size={32} className="text-white" />
                    </div>
                  ) : (
                    <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto">
                      <XCircle size={32} className="text-white" />
                    </div>
                  )}
                </motion.div>

                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className={`text-lg font-semibold mb-2 ${notification.type === 'success' ? 'text-green-500' : 'text-red-500'
                    }`}
                >
                  {notification.type === 'success' ? 'Başarılı!' : 'Hata!'}
                </motion.h3>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-text-secondary text-sm"
                >
                  {notification.message}
                </motion.p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AdminLayout>
  )
}


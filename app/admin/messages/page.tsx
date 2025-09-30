'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Mail, 
  MailOpen, 
  Trash2, 
  Eye, 
  Phone, 
  Calendar,
  Search,
  Filter,
  Send,
  X,
  RefreshCw,
  CheckCircle,
  XCircle
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import AdminLayout from '@/components/AdminLayout'

interface ContactMessage {
  id: string
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  createdAt: string
  read: boolean
}

export default function AdminMessagesPage() {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRead, setFilterRead] = useState<'all' | 'read' | 'unread'>('all')
  const [showReplyModal, setShowReplyModal] = useState(false)
  const [replySubject, setReplySubject] = useState('')
  const [replyMessage, setReplyMessage] = useState('')
  const [sendingMail, setSendingMail] = useState(false)
  const [notification, setNotification] = useState<{
    show: boolean
    type: 'success' | 'error'
    title: string
    message: string
  } | null>(null)

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/admin/login')
    }
  }, [isAuthenticated, loading, router])

  useEffect(() => {
    if (isAuthenticated) {
      fetchMessages()
    }
  }, [isAuthenticated])


  useEffect(() => {
    if (notification?.show) {
      const timer = setTimeout(() => {
        setNotification(null)
      }, 3000) // 3 saniye sonra kapan

      return () => clearTimeout(timer)
    }
  }, [notification])

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/messages')
      const data = await response.json()
      setMessages(data)
    } catch (error) {
      console.error('Error fetching messages:', error)
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

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.subject.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = filterRead === 'all' || 
                         (filterRead === 'read' && message.read) ||
                         (filterRead === 'unread' && !message.read)
    
    return matchesSearch && matchesFilter
  })

  const handleMarkAsRead = async (id: string) => {
    try {
      await fetch('/api/messages', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'mark_read' })
      })
      
      fetchMessages()
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage({ ...selectedMessage, read: true })
      }
    } catch (error) {
      console.error('Error marking message as read:', error)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/messages?id=${id}`, {
        method: 'DELETE'
      })
      
      fetchMessages()
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage(null)
      }
    } catch (error) {
      console.error('Error deleting message:', error)
    }
  }

  const handleReply = () => {
    if (selectedMessage) {
      setReplySubject(`Re: ${selectedMessage.subject}`)
      setReplyMessage(`Merhaba ${selectedMessage.name},\n\n`)
      setShowReplyModal(true)
    }
  }

  const handleSendReply = async () => {
    if (!selectedMessage || !replyMessage.trim()) return

    setSendingMail(true)
    try {
      const response = await fetch('/api/messages/send-mail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: selectedMessage.email,
          subject: replySubject,
          message: replyMessage,
          replyTo: selectedMessage.email
        })
      })

      const data = await response.json()

      if (data.success) {
        setShowReplyModal(false)
        setReplySubject('')
        setReplyMessage('')
        setNotification({
          show: true,
          type: 'success',
          title: 'Mail Başarıyla Gönderildi!',
          message: `${selectedMessage.name} adresine mail başarıyla gönderildi.`
        })
      } else {
        setNotification({
          show: true,
          type: 'error',
          title: 'Mail Gönderilemedi',
          message: data.message || 'Bilinmeyen bir hata oluştu.'
        })
      }
    } catch (error) {
      console.error('Mail gönderme hatası:', error)
      setNotification({
        show: true,
        type: 'error',
        title: 'Bağlantı Hatası',
        message: 'Mail gönderilirken bir bağlantı hatası oluştu.'
      })
    } finally {
      setSendingMail(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-serif font-bold text-text-primary mb-2">
              İletişim Mesajları
            </h1>
            <p className="text-text-secondary">
              {messages.filter(m => !m.read).length} okunmamış mesaj
            </p>
          </div>
        </div>

        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" />
            <input
              type="text"
              placeholder="Mesajlarda ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-primary-card border border-gray-700 rounded-lg text-text-primary focus:border-accent-gold focus:outline-none"
            />
          </div>
          
          <select
            value={filterRead}
            onChange={(e) => setFilterRead(e.target.value as 'all' | 'read' | 'unread')}
            className="px-4 py-2 bg-primary-card border border-gray-700 rounded-lg text-text-primary focus:border-accent-gold focus:outline-none"
          >
            <option value="all">Tüm Mesajlar</option>
            <option value="unread">Okunmamış</option>
            <option value="read">Okunmuş</option>
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-1 space-y-4">
            {filteredMessages.length === 0 ? (
              <div className="card text-center py-8">
                <Mail size={48} className="mx-auto text-text-secondary mb-4" />
                <p className="text-text-secondary">Mesaj bulunamadı</p>
              </div>
            ) : (
              filteredMessages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  onClick={() => setSelectedMessage(message)}
                  className={`card cursor-pointer transition-all duration-300 hover:scale-105 ${
                    selectedMessage?.id === message.id ? 'border-accent-gold' : ''
                  } ${!message.read ? 'bg-primary-card border-l-4 border-l-accent-gold' : ''}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      {message.read ? (
                        <MailOpen size={16} className="text-text-secondary" />
                      ) : (
                        <Mail size={16} className="text-accent-gold" />
                      )}
                      <span className={`font-semibold ${!message.read ? 'text-text-primary' : 'text-text-secondary'}`}>
                        {message.name}
                      </span>
                    </div>
                    <span className="text-xs text-text-secondary">
                      {formatDate(message.createdAt).split(' ')[0]}
                    </span>
                  </div>
                  
                  <h3 className={`font-medium mb-2 ${!message.read ? 'text-text-primary' : 'text-text-secondary'}`}>
                    {message.subject}
                  </h3>
                  
                  <p className="text-text-secondary text-sm line-clamp-2">
                    {message.message}
                  </p>
                  
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-700">
                    <span className="text-xs text-text-secondary">
                      {message.email}
                    </span>
                    {!message.read && (
                      <span className="w-2 h-2 bg-accent-gold rounded-full"></span>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </div>

          
          <div className="lg:col-span-2">
            {selectedMessage ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="card h-fit"
              >
                
                <div className="flex items-start justify-between mb-6 pb-4 border-b border-gray-700">
                  <div>
                    <h2 className="text-xl font-serif font-bold text-text-primary mb-2">
                      {selectedMessage.subject}
                    </h2>
                    <div className="space-y-1 text-sm text-text-secondary">
                      <div className="flex items-center space-x-2">
                        <Mail size={14} />
                        <span>{selectedMessage.email}</span>
                      </div>
                      {selectedMessage.phone && (
                        <div className="flex items-center space-x-2">
                          <Phone size={14} />
                          <span>{selectedMessage.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-2">
                        <Calendar size={14} />
                        <span>{formatDate(selectedMessage.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    {!selectedMessage.read && (
                      <button
                        onClick={() => handleMarkAsRead(selectedMessage.id)}
                        className="p-2 text-text-secondary hover:text-accent-gold transition-colors duration-300"
                        title="Okundu olarak işaretle"
                      >
                        <Eye size={18} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(selectedMessage.id)}
                      className="p-2 text-text-secondary hover:text-red-500 transition-colors duration-300"
                      title="Sil"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                
                <div className="prose prose-invert max-w-none">
                  <p className="text-text-primary leading-relaxed whitespace-pre-wrap">
                    {selectedMessage.message}
                  </p>
                </div>

                
                <div className="mt-6 pt-4 border-t border-gray-700 flex space-x-4">
                  <button
                    onClick={handleReply}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <Mail size={16} />
                    <span>Yanıtla</span>
                  </button>
                  {selectedMessage.phone && (
                    <a
                      href={`tel:${selectedMessage.phone}`}
                      className="btn-secondary flex items-center space-x-2"
                    >
                      <Phone size={16} />
                      <span>Ara</span>
                    </a>
                  )}
                </div>
              </motion.div>
            ) : (
              <div className="card h-64 flex items-center justify-center">
                <div className="text-center">
                  <Mail size={48} className="mx-auto text-text-secondary mb-4" />
                  <p className="text-text-secondary">Görüntülemek için bir mesaj seçin</p>
                </div>
              </div>
            )}
          </div>
        </div>

        
        <AnimatePresence>
          {showReplyModal && selectedMessage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50"
              onClick={() => setShowReplyModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative bg-primary-card rounded-xl shadow-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-serif font-bold text-text-primary">
                      Mail Yanıtı Gönder
                    </h3>
                    <p className="text-text-secondary text-sm mt-1">
                      {selectedMessage.name} ({selectedMessage.email})
                    </p>
                  </div>
                  <button
                    onClick={() => setShowReplyModal(false)}
                    className="p-2 text-text-secondary hover:text-accent-gold transition-colors duration-300"
                  >
                    <X size={24} />
                  </button>
                </div>

                
                <div className="space-y-4">
                  
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Konu
                    </label>
                    <input
                      type="text"
                      value={replySubject}
                      onChange={(e) => setReplySubject(e.target.value)}
                      className="w-full bg-primary-bg border border-gray-600 rounded-lg px-4 py-2 text-text-primary focus:border-accent-gold focus:outline-none"
                      placeholder="Konu başlığı..."
                    />
                  </div>

                  
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Mesaj
                    </label>
                    <textarea
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      rows={8}
                      className="w-full bg-primary-bg border border-gray-600 rounded-lg px-4 py-2 text-text-primary focus:border-accent-gold focus:outline-none resize-none"
                      placeholder="Yanıt mesajınızı yazın..."
                    />
                  </div>

                  
                  <div className="bg-primary-secondary rounded-lg p-4 border border-gray-600">
                    <h4 className="text-sm font-medium text-text-primary mb-2">
                      Orijinal Mesaj:
                    </h4>
                    <div className="text-xs text-text-secondary bg-primary-bg p-3 rounded border-l-4 border-l-accent-gold">
                      <div className="font-medium mb-1">{selectedMessage.subject}</div>
                      <div className="whitespace-pre-wrap">{selectedMessage.message}</div>
                    </div>
                  </div>
                </div>

                
                <div className="flex justify-end space-x-4 mt-6 pt-4 border-t border-gray-700">
                  <button
                    onClick={() => setShowReplyModal(false)}
                    className="px-6 py-2 text-text-secondary hover:text-accent-gold transition-colors duration-300"
                  >
                    İptal
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSendReply}
                    disabled={sendingMail || !replyMessage.trim()}
                    className="bg-accent-gold hover:bg-yellow-500 text-primary-bg px-6 py-2 rounded-lg font-semibold transition-colors duration-300 disabled:opacity-50 flex items-center space-x-2"
                  >
                    {sendingMail ? (
                      <>
                        <RefreshCw size={16} className="animate-spin" />
                        <span>Gönderiliyor...</span>
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        <span>Gönder</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      
      <AnimatePresence>
        {notification?.show && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed top-4 right-4 z-[10000] max-w-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2, delay: 0.1 }}
              className={`p-4 rounded-lg shadow-lg border backdrop-blur-sm ${
                notification.type === 'success'
                  ? 'bg-green-500/90 border-green-400 text-white'
                  : 'bg-red-500/90 border-red-400 text-white'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  {notification.type === 'success' ? (
                    <CheckCircle size={24} className="text-white" />
                  ) : (
                    <XCircle size={24} className="text-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-white">
                    {notification.title}
                  </h4>
                  <p className="text-sm text-white/90 mt-1">
                    {notification.message}
                  </p>
                </div>
                <button
                  onClick={() => setNotification(null)}
                  className="flex-shrink-0 text-white/70 hover:text-white transition-colors duration-200"
                >
                  <X size={16} />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  )
}



'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  MessageSquare, 
  Calendar, 
  Users, 
  CheckCircle, 
  Clock, 
  Mail,
  BarChart3,
  TrendingUp,
  Activity,
  AlertCircle,
  XCircle,
  Eye,
  Zap,
  Image,
  ShoppingBag,
  Utensils,
  Info
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import AdminLayout from '@/components/AdminLayout'

interface Stats {
  totalMessages: number
  unreadMessages: number
  totalReservations: number
  pendingReservations: number
  confirmedReservations: number
  cancelledReservations: number
  recentMessages: number
  recentReservations: number
  monthlyMessages: number
  monthlyReservations: number
  totalPendingActions: number
}

interface CapacityStats {
  todayTotalGuests: number
  todayOccupancyRate: number
  todayReservationCount: number
  busiestHour: string
  busiestHourGuests: number
  busiestHourOccupancy: number
  weeklyTotalGuests: number
  weeklyReservationCount: number
  monthlyTotalGuests: number
  monthlyReservationCount: number
  maxGuestsPerSlot: number
  maxTablesPerSlot: number
  averageGuestsPerTable: number
  availableSlots: number
  isCapacityEnabled: boolean
  lastUpdated: string
}

export default function AdminDashboard() {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<Stats | null>(null)
  const [capacityStats, setCapacityStats] = useState<CapacityStats | null>(null)
  const [recentActivity, setRecentActivity] = useState<any[]>([])
  const [loadingStats, setLoadingStats] = useState(true)

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/admin/login')
    }
  }, [isAuthenticated, loading, router])

  useEffect(() => {
    if (isAuthenticated) {
      fetchStats()
      fetchCapacityStats()
      fetchRecentActivity()
    }
  }, [isAuthenticated])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats')
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoadingStats(false)
    }
  }

  const fetchCapacityStats = async () => {
    try {
      const response = await fetch('/api/capacity/stats')
      const data = await response.json()
      if (data.success) {
        setCapacityStats(data.capacityStats)
      }
    } catch (error) {
      console.error('Kapasite istatistikleri alınamadı:', error)
    }
  }

  const fetchRecentActivity = async () => {
    try {
      const [messagesRes, reservationsRes] = await Promise.all([
        fetch('/api/messages'),
        fetch('/api/reservations')
      ])

      const messages = await messagesRes.json()
      const reservations = await reservationsRes.json()


      const activity = [
        ...messages.slice(0, 3).map((m: any) => ({
          type: 'message',
          id: m.id,
          title: `Yeni mesaj: ${m.subject}`,
          subtitle: m.name,
          time: m.createdAt,
          read: m.read
        })),
        ...reservations.slice(0, 3).map((r: any) => ({
          type: 'reservation',
          id: r.id,
          title: `Rezervasyon: ${r.guests} kişi`,
          subtitle: r.name,
          time: r.createdAt,
          status: r.status
        }))
      ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 5)

      setRecentActivity(activity)
    } catch (error) {
      console.error('Error fetching recent activity:', error)
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

  if (loadingStats || !stats) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-accent-gold">Veriler yükleniyor...</div>
        </div>
      </AdminLayout>
    )
  }

  const dashboardCards = [
    {
      title: 'Toplam Mesaj',
      value: stats.totalMessages,
      icon: MessageSquare,
      color: 'from-blue-500 to-blue-600',
      description: `${stats.unreadMessages} okunmamış`,
      change: `+${stats.recentMessages} (7 gün)`,
      trend: 'up'
    },
    {
      title: 'Toplam Rezervasyon',
      value: stats.totalReservations,
      icon: Calendar,
      color: 'from-green-500 to-green-600',
      description: `${stats.pendingReservations} beklemede`,
      change: `+${stats.recentReservations} (7 gün)`,
      trend: 'up'
    },
    {
      title: 'Günlük Doluluk',
      value: capacityStats ? `${capacityStats.todayOccupancyRate}%` : '0%',
      icon: Users,
      color: 'from-accent-gold to-yellow-500',
      description: `${capacityStats?.todayTotalGuests || 0}/${capacityStats?.maxGuestsPerSlot || 50} kişi`,
      change: `En yoğun: ${capacityStats?.busiestHour || '00:00'}`,
      trend: capacityStats && capacityStats.todayOccupancyRate > 70 ? 'up' : 'stable'
    },
    {
      title: 'Bekleyen İşlem',
      value: stats.totalPendingActions,
      icon: AlertCircle,
      color: 'from-red-500 to-red-600',
      description: 'Acil dikkat',
      change: stats.totalPendingActions > 5 ? 'Yoğun' : 'Normal',
      trend: stats.totalPendingActions > 5 ? 'up' : 'down'
    }
  ]

  const additionalStats = [
    {
      title: 'Bu Ay Mesaj',
      value: stats.monthlyMessages,
      icon: Mail,
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Haftalık Konuk',
      value: capacityStats ? capacityStats.weeklyTotalGuests : 0,
      icon: Users,
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Son 7 Gün',
      value: stats.recentMessages + stats.recentReservations,
      icon: Activity,
      color: 'from-indigo-500 to-indigo-600'
    },
    {
      title: 'Aktif İşlem',
      value: stats.pendingReservations,
      icon: Zap,
      color: 'from-orange-500 to-orange-600'
    }
  ]

  const quickActions = [
    {
      title: 'Mesajları Görüntüle',
      description: 'İletişim formundan gelen mesajları incele',
      icon: Mail,
      href: '/admin/messages',
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Rezervasyonları Yönet',
      description: 'Masa rezervasyonlarını onayla veya iptal et',
      icon: Users,
      href: '/admin/reservations',
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Galeri Yönetimi',
      description: 'Restoran galerisini ve resimlerini yönet',
      icon: Image,
      href: '/admin/gallery',
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Menü Yönetimi',
      description: 'Restoran menüsünü ve ürünleri yönet',
      icon: Utensils,
      href: '/admin/menu',
      color: 'from-orange-500 to-orange-600'
    },
    {
      title: 'Hakkımızda Ayarları',
      description: 'Hakkımızda sayfasını düzenleyin',
      icon: Info,
      href: '/admin/hakkimizda',
      color: 'from-purple-500 to-purple-600'
    },
  ]

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-primary-card to-primary-secondary p-6 rounded-xl border border-gray-700 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-serif font-bold text-text-primary mb-1">
                Dashboard
              </h1>
              <p className="text-text-secondary text-sm">
                Restly Admin Paneli - Genel Bakış
              </p>
            </div>
            <div className="flex items-center space-x-2 text-xs text-text-secondary bg-primary-bg px-3 py-2 rounded-lg border border-gray-700">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="hidden sm:inline">Canlı Veriler</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {dashboardCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-gradient-to-br from-primary-card to-primary-secondary rounded-xl p-5 shadow-lg border border-gray-700 transition-all duration-300 hover:shadow-xl hover:shadow-accent-gold/20 hover:scale-105 group backdrop-blur-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 bg-gradient-to-r ${card.color} rounded-lg flex items-center justify-center`}>
                  <card.icon size={20} className="text-white" />
                </div>
                <div className={`flex items-center space-x-1 ${
                  card.trend === 'up' ? 'text-green-500' : 
                  card.trend === 'down' ? 'text-red-500' : 'text-yellow-500'
                }`}>
                  {card.trend === 'up' ? <TrendingUp size={14} /> : 
                   card.trend === 'down' ? <TrendingUp size={14} className="rotate-180" /> : 
                   <BarChart3 size={14} />}
                </div>
              </div>
              
              <div className="space-y-1">
                <h3 className="text-text-secondary text-xs font-medium uppercase tracking-wide">
                  {card.title}
                </h3>
                <div className="text-xl font-bold text-text-primary">
                  {card.value}
                </div>
                <p className="text-text-secondary text-xs">
                  {card.description}
                </p>
                <p className="text-accent-gold text-xs font-medium">
                  {card.change}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
          {additionalStats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              className="bg-gradient-to-br from-primary-card to-primary-secondary rounded-lg p-4 shadow border border-gray-700 transition-all duration-300 hover:shadow-lg hover:scale-105 group"
            >
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                  <stat.icon size={16} className="text-white" />
                </div>
                <div>
                  <h3 className="text-text-secondary text-xs font-medium">
                    {stat.title}
                  </h3>
                  <div className="text-lg font-bold text-text-primary">
                    {stat.value}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-1">
            <h2 className="text-lg font-serif font-semibold text-text-primary mb-4">
              Hızlı İşlemler
            </h2>
            
            <div className="space-y-3">
              {quickActions.map((action, index) => (
                <motion.a
                  key={action.title}
                  href={action.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  className="bg-gradient-to-br from-primary-card to-primary-secondary rounded-lg p-4 shadow border border-gray-700 transition-all duration-300 hover:shadow-lg hover:scale-105 group block"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 bg-gradient-to-r ${action.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <action.icon size={20} className="text-white" />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-text-primary group-hover:text-accent-gold transition-colors duration-300">
                        {action.title}
                      </h3>
                      <p className="text-text-secondary text-xs">
                        {action.description}
                      </p>
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>

          <div className="xl:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-serif font-semibold text-text-primary">
                Son Aktiviteler
              </h2>
              <button
                onClick={() => {
                  fetchStats()
                  fetchCapacityStats()
                  fetchRecentActivity()
                }}
                className="text-accent-gold hover:text-yellow-500 transition-colors duration-300"
              >
                <Activity size={18} />
              </button>
            </div>
          
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="bg-gradient-to-br from-primary-card to-primary-secondary rounded-lg p-4 shadow border border-gray-700 h-fit"
            >
              {recentActivity.length === 0 ? (
                <div className="text-center py-6">
                  <Activity size={32} className="mx-auto text-text-secondary mb-2" />
                  <p className="text-text-secondary text-sm">Henüz aktivite yok</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentActivity.slice(0, 5).map((activity, index) => (
                    <motion.div
                      key={`${activity.type}-${activity.id}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-center space-x-3 p-2 bg-primary-secondary rounded-lg hover:bg-primary-bg transition-colors duration-300"
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        activity.type === 'message' 
                          ? activity.read 
                            ? 'bg-blue-500' 
                            : 'bg-accent-gold'
                          : activity.status === 'pending'
                            ? 'bg-yellow-500'
                            : activity.status === 'confirmed'
                              ? 'bg-green-500'
                              : 'bg-red-500'
                      }`}>
                        {activity.type === 'message' ? (
                          activity.read ? <Eye size={12} className="text-white" /> : <MessageSquare size={12} className="text-white" />
                        ) : (
                          activity.status === 'pending' ? <Clock size={12} className="text-white" /> :
                          activity.status === 'confirmed' ? <CheckCircle size={12} className="text-white" /> :
                          <XCircle size={12} className="text-white" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-text-primary text-xs font-medium truncate">{activity.title}</p>
                        <p className="text-text-secondary text-xs truncate">{activity.subtitle}</p>
                      </div>
                      <div className="text-text-secondary text-xs">
                        {new Intl.RelativeTimeFormat('tr', { numeric: 'auto' }).format(
                          Math.floor((new Date(activity.time).getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
                          'day'
                        )}
                      </div>
                    </motion.div>
                  ))}
                  
                  <div className="pt-3 border-t border-gray-700 flex justify-center">
                    <div className="flex space-x-4">
                      <a
                        href="/admin/messages"
                        className="text-blue-500 hover:text-blue-400 text-xs font-medium transition-colors duration-300"
                      >
                        Tüm Mesajlar
                      </a>
                      <a
                        href="/admin/gallery"
                        className="text-purple-500 hover:text-purple-400 text-xs font-medium transition-colors duration-300"
                      >
                        Galeri Yönetimi
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}


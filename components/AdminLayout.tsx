'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  MessageSquare,
  Calendar,
  LogOut,
  Menu,
  X,
  Home,
  Settings,
  Users,
  Image,
  ShoppingBag,
  Utensils,
  Bell,
  Settings2,
  Shield,
  FileText,
  Cookie,
  ChevronDown,
  Info
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface NavigationItem {
  name: string
  icon: any
  href?: string
  dropdown?: boolean
  items?: Array<{
    name: string
    href: string
    icon: any
  }>
}

const navigation: NavigationItem[] = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Mesajlar', href: '/admin/messages', icon: MessageSquare },
  { name: 'Rezervasyonlar', href: '/admin/reservations', icon: Calendar },
  { name: 'Galeri', href: '/admin/gallery', icon: Image },
  { name: 'Kapasite', href: '/admin/capacity', icon: Users },
  { name: 'Menü', href: '/admin/menu', icon: Utensils },
  { name: 'Online Sipariş', href: '/admin/online-siparis', icon: ShoppingBag },
  { name: 'Popup İşlemleri', href: '/admin/popup', icon: Bell },
  {
    name: 'Bilgi Sayfaları',
    icon: Info,
    dropdown: true,
    items: [
      { name: 'Hakkımızda', href: '/admin/hakkimizda', icon: Settings2 },
      { name: 'KVKK Politikası', href: '/admin/kvkk', icon: FileText },
      { name: 'Elektronik İletişim', href: '/admin/elektronik-iletisim', icon: MessageSquare },
      { name: 'Çerez Politikası', href: '/admin/cerez-politikasi', icon: Cookie }
    ]
  },
  { name: 'Yedekleme', href: '/admin/backup', icon: Shield },
  { name: 'Ayarlar', href: '/admin/settings', icon: Settings },
]

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null)
  const { logout } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    // Eğer bilgi sayfalarından biri aktifse dropdown'u otomatik aç
    const bilgiSayfalari = navigation.find(item => item.dropdown)?.items || []
    const isBilgiSayfasiActive = bilgiSayfalari.some(item => pathname === item.href)
    
    if (isBilgiSayfasiActive) {
      setDropdownOpen('Bilgi Sayfaları')
    } else {
      // Eğer bilgi sayfası değilse dropdown'u kapat
      setDropdownOpen(null)
    }
  }, [pathname])

  const handleLogout = () => {
    logout()
    router.push('/admin/login')
  }

  return (
    <div className="min-h-screen bg-primary-bg flex">
      
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      
      <div
        className={`fixed inset-y-0 left-0 z-50 bg-primary-secondary border-r border-gray-800 lg:static lg:inset-0 transition-all duration-300 ${
          sidebarCollapsed ? 'lg:w-16' : 'lg:w-80'
        } ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        style={{
          width: sidebarCollapsed ? '4rem' : '20rem'
        }}
      >
        <div className="flex flex-col h-full">
          
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-800">
            <Link href="/admin/dashboard" className={`font-serif font-bold text-gradient ${
              sidebarCollapsed ? 'text-lg' : 'text-xl'
            }`}>
              {sidebarCollapsed ? '' : 'Admin'}
            </Link>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="hidden lg:block text-text-secondary hover:text-accent-gold transition-colors duration-300"
                title={sidebarCollapsed ? 'Genişlet' : 'Daralt'}
              >
                <Menu size={20} />
              </button>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden text-text-secondary hover:text-accent-gold"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item, index) => {
              if (item.dropdown) {
                const isDropdownOpen = dropdownOpen === item.name
                const isAnyItemActive = item.items?.some(subItem => pathname === subItem.href)

                return (
                  <div key={item.name}>
                    <button
                      onClick={() => setDropdownOpen(isDropdownOpen ? null : item.name)}
                      className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center px-2' : 'space-x-3 px-4'} py-3 rounded-lg transition-colors duration-300 ${
                        isAnyItemActive
                          ? 'bg-accent-gold text-primary-bg'
                          : 'text-text-secondary hover:text-accent-gold hover:bg-primary-card'
                      }`}
                      title={sidebarCollapsed ? item.name : ''}
                    >
                      <item.icon size={20} />
                      {!sidebarCollapsed && (
                        <>
                          <span className="font-medium flex-1 text-left">{item.name}</span>
                          <ChevronDown 
                            size={16} 
                            className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                          />
                        </>
                      )}
                    </button>

                    {!sidebarCollapsed && isDropdownOpen && (
                      <div className="ml-4 mt-1 space-y-1">
                        {item.items?.map((subItem) => {
                          const isSubItemActive = pathname === subItem.href
                          return (
                            <Link
                              key={subItem.name}
                              href={subItem.href}
                              className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors duration-300 ${
                                isSubItemActive
                                  ? 'bg-accent-gold text-primary-bg'
                                  : 'text-text-secondary hover:text-accent-gold hover:bg-primary-card'
                              }`}
                              title={subItem.name}
                            >
                              <subItem.icon size={16} />
                              <span className="font-medium text-sm">{subItem.name}</span>
                            </Link>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              } else {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href!}
                    className={`flex items-center ${sidebarCollapsed ? 'justify-center px-2' : 'space-x-3 px-4'} py-3 rounded-lg transition-colors duration-300 ${isActive
                        ? 'bg-accent-gold text-primary-bg'
                        : 'text-text-secondary hover:text-accent-gold hover:bg-primary-card'
                      }`}
                    title={sidebarCollapsed ? item.name : ''}
                  >
                    <item.icon size={20} />
                    {!sidebarCollapsed && <span className="font-medium">{item.name}</span>}
                  </Link>
                )
              }
            })}
          </nav>

          
          <div className="p-4 border-t border-gray-800 space-y-2">
            <Link
              href="/"
              className={`flex items-center ${sidebarCollapsed ? 'justify-center px-2' : 'space-x-3 px-4'} py-3 rounded-lg text-text-secondary hover:text-accent-gold hover:bg-primary-card transition-colors duration-300`}
              title={sidebarCollapsed ? 'Ana Siteye Dön' : ''}
            >
              <Home size={20} />
              {!sidebarCollapsed && <span className="font-medium">Ana Siteye Dön</span>}
            </Link>

            <button
              onClick={handleLogout}
              className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center px-2' : 'space-x-3 px-4'} py-3 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors duration-300`}
              title={sidebarCollapsed ? 'Çıkış Yap' : ''}
            >
              <LogOut size={20} />
              {!sidebarCollapsed && <span className="font-medium">Çıkış Yap</span>}
            </button>
          </div>
        </div>
      </div>

      
      <div className="flex-1 flex flex-col">
        
        <div className="lg:hidden sticky top-0 z-30 bg-primary-secondary border-b border-gray-800 p-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex items-center space-x-2 text-text-secondary hover:text-accent-gold transition-colors duration-300"
          >
            <Menu size={20} />
            <span className="font-medium">Menü</span>
          </button>
        </div>

        
        <main className="flex-1 bg-primary-bg p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}


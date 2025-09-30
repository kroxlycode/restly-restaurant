'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { Lock, User, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

type LoginData = {
  username: string
  password: string
}

export default function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [loginError, setLoginError] = useState('')
  const { login, isAuthenticated } = useAuth()
  const router = useRouter()
  const { register, handleSubmit, formState: { errors } } = useForm<LoginData>()

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/admin/dashboard')
    }
  }, [isAuthenticated, router])

  const onSubmit = (data: LoginData) => {
    const success = login(data.username, data.password)
    if (success) {
      router.push('/admin/dashboard')
    } else {
      setLoginError('Kullanıcı adı veya şifre hatalı!')
    }
  }

  return (
    <div className="min-h-screen bg-primary-bg flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="card">
          
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-accent-gold to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock size={32} className="text-primary-bg" />
            </div>
            <h1 className="text-2xl font-serif font-bold text-text-primary mb-2">
              Admin Girişi
            </h1>
            <p className="text-text-secondary">
              Restly Admin Paneli
            </p>
          </div>

          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {loginError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/20 border border-red-500 rounded-lg p-3 flex items-center space-x-2"
              >
                <AlertCircle size={18} className="text-red-500" />
                <span className="text-red-500 text-sm">{loginError}</span>
              </motion.div>
            )}

            
            <div>
              <label className="block text-text-primary font-medium mb-2">
                Kullanıcı Adı
              </label>
              <div className="relative">
                <input
                  type="text"
                  {...register('username', { required: 'Kullanıcı adı gereklidir' })}
                  className="w-full pl-10 pr-4 py-3 bg-primary-card border border-gray-700 rounded-lg text-text-primary focus:border-accent-gold focus:outline-none transition-colors duration-300"
                  placeholder="Kullanıcı adınızı girin"
                />
                <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" />
              </div>
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
              )}
            </div>

            
            <div>
              <label className="block text-text-primary font-medium mb-2">
                Şifre
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', { required: 'Şifre gereklidir' })}
                  className="w-full pl-10 pr-12 py-3 bg-primary-card border border-gray-700 rounded-lg text-text-primary focus:border-accent-gold focus:outline-none transition-colors duration-300"
                  placeholder="Şifrenizi girin"
                />
                <Lock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-accent-gold transition-colors duration-300"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            
            <button
              type="submit"
              className="w-full btn-primary py-3 text-lg"
            >
              Giriş Yap
            </button>
          </form>

          
          <div className="mt-6 p-4 bg-primary-secondary rounded-lg border border-gray-700">
            <h3 className="text-accent-gold font-semibold mb-2">Demo Bilgileri:</h3>
            <div className="text-text-secondary text-sm space-y-1">
              <p>Kullanıcı Adı: <span className="text-text-primary font-mono">admin</span></p>
              <p>Şifre: <span className="text-text-primary font-mono">admin123</span></p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}


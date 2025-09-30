'use client'

import { useState, useEffect } from 'react'

interface NotificationState {
  isSupported: boolean
  permission: NotificationPermission | null
  isSubscribed: boolean
  isLoading: boolean
}

export function usePushNotifications() {
  const [state, setState] = useState<NotificationState>({
    isSupported: false,
    permission: null,
    isSubscribed: false,
    isLoading: true
  })

  useEffect(() => {

    const isSupported = 'Notification' in window && 'serviceWorker' in navigator


    const isSecure = location.protocol === 'https:' || location.hostname === 'localhost'

    if (isSupported && isSecure) {
      setState(prev => ({
        ...prev,
        isSupported: true,
        permission: Notification.permission,
        isLoading: false
      }))


      checkSubscription()
    } else {
      console.warn('Push notifications not supported or not running on HTTPS/localhost')
      setState(prev => ({
        ...prev,
        isSupported: false,
        isLoading: false
      }))
    }
  }, [])

  const checkSubscription = async () => {
    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()
      
      setState(prev => ({
        ...prev,
        isSubscribed: !!subscription
      }))
    } catch (error) {
      console.error('Abonelik kontrolü hatası:', error)
    }
  }

  const requestPermission = async (): Promise<boolean> => {
    if (!state.isSupported) {
      console.warn('Push notifications are not supported')
      return false
    }

    try {
      const permission = await Notification.requestPermission()
      
      setState(prev => ({
        ...prev,
        permission
      }))

      return permission === 'granted'
    } catch (error) {
      console.error('İzin isteme hatası:', error)
      return false
    }
  }

  const subscribe = async (): Promise<boolean> => {
    if (!state.isSupported || state.permission !== 'granted') {
      console.error('Push notifications not supported or permission not granted')
      return false
    }

    try {
      setState(prev => ({ ...prev, isLoading: true }))

      console.log('Registering service worker...')


      let registration = await navigator.serviceWorker.getRegistration('/sw.js')

      if (!registration) {
        console.log('Service worker not found, registering...')
        registration = await navigator.serviceWorker.register('/sw.js')
        console.log('Service worker registered:', registration)
      } else {
        console.log('Service worker already registered:', registration)
      }

      await navigator.serviceWorker.ready
      console.log('Service worker ready')


      const existingSubscription = await registration.pushManager.getSubscription()
      if (existingSubscription) {
        console.log('Already subscribed, unsubscribing first...')
        await existingSubscription.unsubscribe()
      }

      console.log('Subscribing to push notifications...')
      console.log('VAPID Key:', process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY)


      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '')
      })

      console.log('Subscription successful:', subscription)


      console.log('Sending subscription to server...')
      const response = await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscription)
      })

      if (!response.ok) {
        throw new Error(`Server response: ${response.status}`)
      }

      const result = await response.json()
      console.log('Server response:', result)

      setState(prev => ({
        ...prev,
        isSubscribed: true,
        isLoading: false
      }))

      return true
    } catch (error) {
      console.error('Abonelik hatası:', error)
      setState(prev => ({ ...prev, isLoading: false }))
      return false
    }
  }

  const unsubscribe = async (): Promise<boolean> => {
    try {
      setState(prev => ({ ...prev, isLoading: true }))

      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()

      if (subscription) {
        await subscription.unsubscribe()
        

        await fetch('/api/notifications/unsubscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(subscription)
        })
      }

      setState(prev => ({
        ...prev,
        isSubscribed: false,
        isLoading: false
      }))

      return true
    } catch (error) {
      console.error('Abonelik iptal hatası:', error)
      setState(prev => ({ ...prev, isLoading: false }))
      return false
    }
  }

  const sendTestNotification = async () => {
    try {
      await fetch('/api/notifications/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'Test Bildirimi',
          body: 'Bu bir test bildirimidir!',
          url: '/'
        })
      })
    } catch (error) {
      console.error('Test bildirimi hatası:', error)
    }
  }

  return {
    ...state,
    requestPermission,
    subscribe,
    unsubscribe,
    sendTestNotification
  }
}


function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
  const padding = '='.repeat((4 - base64String.length % 4) % 4)
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}


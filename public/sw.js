
const CACHE_NAME = 'restly-v1'
const urlsToCache = [
  '/',
  '/menu',
  '/rezervasyon',
  '/iletisim',
  '/hakkimizda'
]


self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  )
})


self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {

        return response || fetch(event.request)
      })
  )
})


self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Restly\'den yeni bir bildirim!',
    icon: '/favicon.svg',
    badge: '/favicon.svg',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Detayları Gör',
        icon: '/favicon.svg'
      },
      {
        action: 'close',
        title: 'Kapat',
        icon: '/favicon.svg'
      }
    ]
  }

  event.waitUntil(
    self.registration.showNotification('Restly Restaurant', options)
  )
})


self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  if (event.action === 'explore') {

    event.waitUntil(
      clients.openWindow('/')
    )
  } else if (event.action === 'close') {

    event.notification.close()
  } else {

    event.waitUntil(
      clients.openWindow('/')
    )
  }
})


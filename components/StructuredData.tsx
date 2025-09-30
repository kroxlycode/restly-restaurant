export default function StructuredData() {
  const restaurantData = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "name": "Restly Restaurant",
    "description": "Modern gastronomi ile geleneksel lezzetleri buluşturan eşsiz restoran deneyimi",
    "url": "https://restly.com",
    "telephone": "+902121234567",
    "email": "info@restly.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Nişantaşı Mah. Teşvikiye Cad. No:123",
      "addressLocality": "Şişli",
      "addressRegion": "İstanbul",
      "addressCountry": "TR"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "41.0082",
      "longitude": "28.9784"
    },
    "openingHours": [
      "Mo-Su 11:00-23:00"
    ],
    "servesCuisine": [
      "Turkish",
      "Mediterranean",
      "International"
    ],
    "priceRange": "₺₺₺",
    "acceptsReservations": true,
    "hasMenu": "https://restly.com/menu",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "150",
      "bestRating": "5",
      "worstRating": "1"
    },
    "image": [
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    "sameAs": [
      "https://www.facebook.com/restly",
      "https://www.instagram.com/restly",
      "https://www.twitter.com/restly"
    ]
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantData) }}
    />
  )
}

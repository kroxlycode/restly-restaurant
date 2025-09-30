# Restly - Modern Restaurant Website

[![Next.js](https://img.shields.io/badge/Next.js-14.0+-000000?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-007ACC?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0+-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-10.0+-0055FF?style=for-the-badge&logo=framer)](https://www.framer.com/motion/)

Restly, modern gastronomi ile geleneksel lezzetleri buluşturan restoran için tasarlanmış Next.js 14 tabanlı kapsamlı web sitesidir. Tam fonksiyonel admin paneli, otomatik yedekleme sistemi ve profesyonel özelliklerle donatılmıştır.

## 🚀 Özellikler

### 🌐 Genel Özellikler
- **Modern Tasarım**: Dark theme ile şık ve profesyonel arayüz
- **Responsive**: Mobile-first yaklaşımla tüm cihazlarda mükemmel görünüm
- **Animasyonlar**: Framer Motion ile akıcı ve etkileyici animasyonlar
- **SEO Optimized**: Arama motorları için kapsamlı optimizasyon
- **Hızlı**: Next.js 14 App Router ile yüksek performans
- **Türkçe**: Tamamen Türkçe içerik ve arayüz
- **TypeScript**: Tip güvenliği ile geliştirme

### 📱 Kullanıcı Sayfaları
- **Ana Sayfa**: Hero section, özellikler, popüler yemekler, hakkımızda, müşteri yorumları
- **Hakkımızda**: Restoran hikayesi, misyon, vizyon, ekip, istatistikler
- **Menü**: Kategoriler halinde yemek listesi, filtreleme, arama, detaylı ürün sayfaları
- **Galeri**: Restoran ve yemek fotoğrafları, lightbox görüntüleyici
- **İletişim**: İletişim formu, Google Maps entegrasyonu, çalışma saatleri
- **Rezervasyon**: Detaylı rezervasyon formu, tarih seçimi, kişi sayısı
- **Online Sipariş**: Yemeksepeti, Getir, Trendyol Go Yemek gibi platformlar
- **Yasal Sayfalar**: KVKK, Çerez Politikası, Elektronik İletişim

### 🛠️ Admin Paneli
- **Dashboard**: Gerçek zamanlı istatistikler, grafik raporlar, son aktiviteler
- **Mesaj Yönetimi**: İletişim formu mesajları, e-posta bildirimleri
- **Rezervasyon Yönetimi**: Rezervasyon onay/red, e-posta sistemleri
- **Galeri Yönetimi**: Sürükle-bırak resim yükleme, düzenleme, silme
- **Menü Yönetimi**: Ürün CRUD, kategori yönetimi, Cloudinary entegrasyonu
- **Kapasite Yönetimi**: Restoran kapasitesi ve çalışma saatleri ayarları
- **Online Sipariş Ayarları**: Teslimat platformu yönetimi
- **SMTP Ayarları**: E-posta sistemi konfigürasyonu
- **Yedekleme Sistemi**: Otomatik ve manuel yedekleme, log sistemi, email bildirimi

### 🔧 Teknik Özellikler
- **Otomatik Yedekleme**: Zamanlanmış yedekleme, email bildirimi, log sistemi
- **Email Sistemi**: Nodemailer ile profesyonel email gönderme
- **Görüntü Yönetimi**: Cloudinary entegrasyonu, otomatik optimizasyon
- **SEO**: Meta tags, Open Graph, structured data (Restaurant schema)
- **Güvenlik**: Güvenlik soruları ile kritik işlemler, input validasyon
- **Veri Yönetimi**: JSON tabanlı dosya sistemi, gerçek zamanlı güncellemeler
- **Push Bildirimleri**: VAPID keys ile web push notifications

## 🛠️ Kullanılan Teknolojiler

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animation library
- **React Hook Form**: Form management
- **Lucide React**: Icon library
- **React Hot Toast**: Notification system

### Backend & API
- **Next.js API Routes**: Serverless API endpoints
- **Nodemailer**: Email functionality
- **NodeMailer**: Email sending
- **Cloudinary SDK**: Image management

### Development Tools
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Husky**: Git hooks
- **Lint-staged**: Pre-commit hooks

## 🎨 Tasarım Sistemi

### Renk Paleti
- **Ana Arka Plan**: `#0F0F0F` (Siyaha yakın koyu)
- **İkincil Arka Plan**: `#1A1A1A` (Koyu gri)
- **Kart Arka Planı**: `#2A2A2A` (Orta gri)
- **Vurgu Rengi**: `#D4AF37` (Altın)
- **İkincil Vurgu**: `#8B0000` (Koyu kırmızı)
- **Metin Rengi**: `#F5F5DC` (Krem)
- **İkincil Metin**: `#A0A0A0` (Gri)

### Tipografi
- **Ana Font**: Inter (Sans-serif)
- **Başlık Font**: Playfair Display (Serif)
- **Font Boyutları**: Responsive ölçeklendirme
- **Line Height**: Okunabilirlik için optimize edilmiş

## 🚀 Kurulum ve Çalıştırma

### Gereksinimler
- **Node.js**: 18.0 veya üzeri
- **npm**: 8.0 veya üzeri
- **Git**: 2.0 veya üzeri

### Adımlar

1. **Projeyi klonlayın:**
```bash
git clone https://github.com/kroxlycode/restly-restaurant.git
cd restly-restaurant
```

2. **Bağımlılıkları yükleyin:**
```bash
npm install
```

3. **Environment değişkenlerini ayarlayın:**
```bash
cp .env.example .env.local
```

`.env.local` dosyasını düzenleyin ve gerekli API anahtarlarını ekleyin.

4. **Geliştirme sunucusunu başlatın:**
```bash
npm run dev
```

5. **Tarayıcınızda açın:**
[http://localhost:3000](http://localhost:3000)

### Build için:
```bash
npm run build
npm start
```

## ⚙️ Yapılandırma

### Environment Variables (.env.local)

Proje çalışması için gerekli environment değişkenlerini `.env.local` dosyasına ekleyin:

```env
# Push Notification VAPID Keys (Web Push Bildirimleri için)
# Bu anahtarları oluşturmak için: npx web-push generate-vapid-keys
NEXT_PUBLIC_VAPID_PUBLIC_KEY=BDx97DWN3mXiEFE8F49tMrH3DF5Xrw99Qng33isQVXu-SC75Z4jY2gwV6enas2eGNNdrUWiv-mlEBIq4gz-dkjo
VAPID_PRIVATE_KEY=lsrZ2wAwHqdcSHDKFAnrl8cveiGKz1eWa5k_rH64BM8

# FCM Server Key (Firebase Cloud Messaging - Opsiyonel)
# Firebase Console > Project Settings > Cloud Messaging'ten alın
FCM_SERVER_KEY=AAAA123456:APA91bF...your-fcm-server-key-here

# Cloudinary Configuration (Görsel Yönetimi için)
# Cloudinary dashboard'ınızdan bu bilgileri alın
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dfjiurtgd
NEXT_PUBLIC_CLOUDINARY_API_KEY=594455381716229
CLOUDINARY_API_KEY=594455381716229
CLOUDINARY_API_SECRET=9by8cQrc3-o3nv0umqf02rZ1MlA
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=restly-general

# Admin Panel Configuration (Yönetim Paneli için)
NEXT_PUBLIC_ADMIN_USERNAME=admin
NEXT_PUBLIC_ADMIN_PASSWORD=admin123
```

### 🔧 Detaylı Kurulum Adımları

#### 1. **Environment Dosyası Oluşturma**
```bash
cp .env.example .env.local
```

#### 2. **Cloudinary Kurulumu** (Görsel Yönetimi)
1. [Cloudinary](https://cloudinary.com)'ya üye olun
2. Dashboard'dan **Cloud Name**, **API Key**, **API Secret** bilgilerini alın
3. Upload preset oluşturun (Settings > Upload)
4. `.env.local` dosyasına bu bilgileri ekleyin

#### 3. **Push Notification Kurulumu** (Opsiyonel)
```bash
# VAPID anahtarlarını oluşturmak için:
npx web-push generate-vapid-keys

# Çıktıyı .env.local dosyasına ekleyin
```

#### 4. **SMTP Kurulumu** (E-posta Gönderimi için)
E-posta gönderme özelliği için admin panelinde ayarlar sayfasında smtp ayarlarında mevcut

**Gmail için App Password oluşturma:**
1. Google Account > Security > 2-Step Verification
2. App passwords oluşturun
3. Oluşturulan şifreyi `SMTP_PASS` olarak kullanın

### Admin Panel Erişimi
- **URL**: `/admin/login`
- **Kullanıcı Adı**: `admin` (`.env.local`'da değiştirilebilir)
- **Şifre**: `admin123` (`.env.local`'da değiştirilebilir)
│   ├── (auth)/                   # Authentication routes
│   ├── admin/                    # Admin panel pages
│   │   ├── backup/              # Backup management
│   │   ├── dashboard/           # Admin dashboard
│   │   ├── gallery/             # Gallery management
│   │   ├── menu/                # Menu management
│   │   ├── messages/            # Message management
│   │   ├── reservations/        # Reservation management
│   │   └── settings/            # System settings
│   ├── api/                     # API routes
│   │   ├── backup/              # Backup API
│   │   ├── contact/             # Contact form API
│   │   ├── gallery/             # Gallery API
│   │   ├── menu/                # Menu API
│   │   ├── reservations/        # Reservation API
│   │   └── smtp/                # SMTP configuration API
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Homepage
├── components/                   # Reusable components
│   ├── admin/                   # Admin components
│   ├── ui/                      # UI components
│   └── ...                      # Other components
├── data/                        # JSON data files
│   ├── backupsettings.json      # Backup configuration
│   ├── contact.json             # Contact information
│   ├── gallery.json             # Gallery data
│   ├── menu.json               # Menu data
│   ├── messages.json            # Contact messages
│   ├── online-siparis-ayarlar.json # Online order settings
│   ├── reservations.json        # Reservation data
│   └── smtp.json               # SMTP settings
├── lib/                         # Utility libraries
├── public/                      # Static assets
│   ├── images/                  # Image assets
│   └── ...                      # Other static files
├── styles/                      # Additional styles
├── tailwind.config.js          # Tailwind configuration
├── next.config.js              # Next.js configuration
├── package.json                # Dependencies and scripts
├── .env.example               # Environment variables template
└── README.md                   # Project documentation
```

## 📊 Özellik Detayları

### Admin Dashboard
- Gerçek zamanlı istatistikler
- Son aktiviteler feed'i
- Grafik raporlar
- Sistem durumu göstergeleri

### Backup Sistemi
- Otomatik zamanlanmış yedekleme
- Manuel yedekleme
- E-posta bildirimi
- Detaylı log sistemi
- Yedekleme geçmişi

### Email Sistemi
- SMTP konfigürasyonu
- HTML email templates
- Rezervasyon onayları
- İletişim formu yanıtları
- Yedekleme bildirimleri

### Güvenlik Özellikleri
- Güvenlik soruları ile kritik işlemler
- Input validasyon
- XSS koruması
- SQL injection koruması
- Rate limiting

## 📱 Responsive Tasarım

### Breakpoints
- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px - 1440px
- **Large Desktop**: 1440px+

### Mobile-First Approach
- Touch-friendly interface
- Optimized images
- Fast loading
- Native app-like experience

## 🔧 Gelişmiş Özellikler

### SEO Optimization
- Meta tags ve Open Graph
- Structured data (Restaurant schema)
- Sitemap.xml *(public/sitemap.xml dosyasındaki URL'leri kendi site URL'iniz ile değiştirin)*
- Robots.txt *(public/robots.txt dosyasındaki sitemap URL'ini kendi site URL'iniz ile değiştirin)*
- Image optimization
- Core Web Vitals optimizasyonu

### Performance
- Next.js Image optimization
- Code splitting
- Lazy loading
- Caching strategies
- Bundle analysis

### Accessibility
- Semantic HTML
- ARIA labels
- Keyboard navigation
- Screen reader support
- Color contrast optimization

## 📞 İletişim ve Destek

### Geliştirici
- **E-posta**: kroxlycode@gmail.com
- **Github**: https://github.com/kroxlycode
- **Website**: https://kroxly.dev

### Teknik Destek
- **GitHub Issues**: Hata raporları ve özellik istekleri
- **Dokümantasyon**: Detaylı kullanım kılavuzu
- **Video Tutorials**: Kurulum ve kullanım videoları

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için `LICENSE` dosyasına bakın.

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 🔄 Güncellemeler

### v2.0.0 (Current)
- ✅ Admin paneli tamamen yeniden tasarlandı
- ✅ Otomatik yedekleme sistemi eklendi
- ✅ Cloudinary entegrasyonu
- ✅ Push notification desteği
- ✅ Güvenlik iyileştirmeleri
- ✅ Performance optimizasyonları

### Yakında Gelecek
- 🔄 Kullanıcı hesap sistemi
- 🔄 E-commerce özelliği
- 🔄 Çoklu dil desteği
- 🔄 Mobile app
- 🔄 AI destekli özellikler

---
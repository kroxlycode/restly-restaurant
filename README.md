# Restly - Modern Restaurant Website

[![Next.js](https://img.shields.io/badge/Next.js-14.0+-000000?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-007ACC?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0+-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-10.0+-0055FF?style=for-the-badge&logo=framer)](https://www.framer.com/motion/)

> Modern gastronomi ile geleneksel lezzetleri buluşturan, Next.js 14 tabanlı kapsamlı restoran web sitesi. Tam fonksiyonel admin paneli, otomatik yedekleme sistemi ve profesyonel özelliklerle donatılmıştır.

![Restly Preview](https://restly.kroxly.dev/placeholder.jpg)

## 📋 İçindekiler

- [Özellikler](#-özellikler)
- [Kullanılan Teknolojiler](#️-kullanılan-teknolojiler)
- [Kurulum](#-kurulum-ve-çalıştırma)
- [Yapılandırma](#️-yapılandırma)
- [Proje Yapısı](#-proje-yapısı)
- [Ekran Görüntüleri](#-ekran-görüntüleri)
- [Katkıda Bulunma](#-katkıda-bulunma)
- [Lisans](#-lisans)
- [İletişim](#-iletişim)

---

## 🚀 Özellikler

### 🌐 Genel Özellikler

- ✨ **Modern Dark Theme** - Şık ve profesyonel arayüz tasarımı
- 📱 **Tam Responsive** - Tüm cihazlarda mükemmel görünüm
- 🎭 **Framer Motion Animasyonlar** - Akıcı ve etkileyici geçişler
- 🔍 **SEO Optimize** - Arama motorları için kapsamlı optimizasyon
- ⚡ **Yüksek Performans** - Next.js 14 App Router ile hızlı yükleme
- 🇹🇷 **Türkçe Dil Desteği** - Tam Türkçe içerik ve arayüz
- 🛡️ **TypeScript** - Tip güvenliği ile hatasız geliştirme

### 📱 Kullanıcı Arayüzü

- **Ana Sayfa** - Hero section, özellikler, popüler yemekler, testimonials
- **Hakkımızda** - Restoran hikayesi, misyon/vizyon, ekip, istatistikler
- **Menü** - Kategorize yemek listesi, filtreleme, arama, detaylı sayfalar
- **Galeri** - Lightbox görüntüleyici ile fotoğraf galerisi
- **İletişim** - Form, Google Maps entegrasyonu, çalışma saatleri
- **Rezervasyon** - Detaylı rezervasyon formu, tarih/saat seçimi
- **Online Sipariş** - Yemeksepeti, Getir, Trendyol entegrasyonları
- **Yasal Sayfalar** - KVKK, Çerez Politikası, Elektronik İletişim

### 🛠️ Admin Paneli

- 📊 **Dashboard** - Gerçek zamanlı istatistikler ve grafik raporlar
- 💬 **Mesaj Yönetimi** - İletişim formu mesajları, e-posta bildirimleri
- 📅 **Rezervasyon Yönetimi** - Onay/red işlemleri, otomatik e-posta
- 🖼️ **Galeri Yönetimi** - Sürükle-bırak yükleme, düzenleme, silme
- 🍽️ **Menü Yönetimi** - Ürün CRUD, kategori yönetimi, Cloudinary
- ⚙️ **Sistem Ayarları** - Kapasite, çalışma saatleri, SMTP, yedekleme
- 💾 **Yedekleme Sistemi** - Otomatik/manuel yedekleme, log, bildirim

### 🔧 Teknik Özellikler

- 🔄 **Otomatik Yedekleme** - Zamanlanmış yedekleme, e-posta bildirimi
- 📧 **E-posta Sistemi** - Nodemailer ile profesyonel e-posta gönderimi
- 🖼️ **Cloudinary Entegrasyonu** - Gelişmiş görsel yönetimi
- 🔐 **Güvenlik** - Input validasyon, XSS koruması, güvenlik soruları
- 📱 **Push Bildirimleri** - VAPID keys ile web push notifications
- 📄 **JSON Veri Yönetimi** - Hızlı ve esnek veri saklama

---

## 🛠️ Kullanılan Teknolojiler

### Frontend
- [Next.js 14](https://nextjs.org/) - React framework with App Router
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [React Hook Form](https://react-hook-form.com/) - Form management
- [Lucide React](https://lucide.dev/) - Beautiful icons
- [React Hot Toast](https://react-hot-toast.com/) - Toast notifications

### Backend & API
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction) - Serverless functions
- [Nodemailer](https://nodemailer.com/) - Email functionality
- [Cloudinary](https://cloudinary.com/) - Image management

### Development Tools
- [ESLint](https://eslint.org/) - Code linting
- [Prettier](https://prettier.io/) - Code formatting
- [Husky](https://typicode.github.io/husky/) - Git hooks
- [Lint-staged](https://github.com/okonet/lint-staged) - Pre-commit checks

---

## 🚀 Kurulum ve Çalıştırma

### Gereksinimler

- Node.js 18.0 veya üzeri
- npm 8.0 veya üzeri
- Git 2.0 veya üzeri

### Hızlı Başlangıç

1. **Projeyi klonlayın**
   ```bash
   git clone https://github.com/kroxlycode/restly-restaurant.git
   cd restly-restaurant
   ```

2. **Bağımlılıkları yükleyin**
   ```bash
   npm install
   ```

3. **Environment dosyasını oluşturun**
   ```bash
   cp .env.example .env.local
   ```

4. **Environment değişkenlerini düzenleyin**
   
   `.env.local` dosyasını açın ve gerekli API anahtarlarını ekleyin. Detaylı bilgi için [Yapılandırma](#️-yapılandırma) bölümüne bakın.

5. **Geliştirme sunucusunu başlatın**
   ```bash
   npm run dev
   ```

6. **Tarayıcınızda görüntüleyin**
   
   [http://localhost:3000](http://localhost:3000) adresini ziyaret edin.

### Production Build

```bash
npm run build
npm start
```

---

## ⚙️ Yapılandırma

### Environment Variables

`.env.local` dosyasına aşağıdaki değişkenleri ekleyin:

```env
# Push Notification (Web Push Bildirimleri)
# Oluşturmak için: npx web-push generate-vapid-keys
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your_public_key
VAPID_PRIVATE_KEY=your_private_key

# Firebase Cloud Messaging (Opsiyonel)
FCM_SERVER_KEY=your_fcm_key

# Cloudinary (Görsel Yönetimi)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_preset

# Admin Panel
NEXT_PUBLIC_ADMIN_USERNAME=admin
NEXT_PUBLIC_ADMIN_PASSWORD=admin123
```

### Cloudinary Kurulumu

1. [Cloudinary](https://cloudinary.com) hesabı oluşturun
2. Dashboard'dan **Cloud Name**, **API Key**, **API Secret** bilgilerini alın
3. Settings > Upload bölümünden **Upload Preset** oluşturun
4. Bilgileri `.env.local` dosyasına ekleyin

### Push Notification Kurulumu

```bash
npx web-push generate-vapid-keys
```

Çıktıdaki public ve private key'leri `.env.local` dosyasına ekleyin.

### SMTP Kurulumu (Gmail örneği)

1. Google Account > Security > 2-Step Verification
2. "App passwords" bölümünden yeni şifre oluşturun
3. Admin paneli > Ayarlar > SMTP Ayarları'ndan yapılandırın

### Admin Panel Erişimi

- **URL:** `/admin/login`
- **Kullanıcı Adı:** `admin` (değiştirilebilir)
- **Şifre:** `admin123` (değiştirilebilir)

---

## 📁 Proje Yapısı

```
restly-restaurant/
│
├── app/                          # Next.js App Directory
│   ├── (auth)/                   # Authentication routes
│   ├── admin/                    # Admin panel pages
│   │   ├── backup/              # Yedekleme yönetimi
│   │   ├── dashboard/           # Ana dashboard
│   │   ├── gallery/             # Galeri yönetimi
│   │   ├── menu/                # Menü yönetimi
│   │   ├── messages/            # Mesaj yönetimi
│   │   ├── reservations/        # Rezervasyon yönetimi
│   │   └── settings/            # Sistem ayarları
│   ├── api/                     # API Routes
│   │   ├── backup/              # Yedekleme API
│   │   ├── contact/             # İletişim API
│   │   ├── gallery/             # Galeri API
│   │   ├── menu/                # Menü API
│   │   ├── reservations/        # Rezervasyon API
│   │   └── smtp/                # SMTP API
│   ├── globals.css              # Global stiller
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Ana sayfa
│
├── components/                   # React bileşenleri
│   ├── admin/                   # Admin bileşenleri
│   ├── ui/                      # UI bileşenleri
│   └── ...                      # Diğer bileşenler
│
├── data/                        # JSON veri dosyaları
│   ├── backupsettings.json      # Yedekleme ayarları
│   ├── contact.json             # İletişim bilgileri
│   ├── gallery.json             # Galeri verileri
│   ├── menu.json                # Menü verileri
│   ├── messages.json            # Mesajlar
│   ├── online-siparis-ayarlar.json # Online sipariş
│   ├── reservations.json        # Rezervasyonlar
│   └── smtp.json                # SMTP ayarları
│
├── lib/                         # Yardımcı kütüphaneler
├── public/                      # Statik dosyalar
│   ├── images/                  # Görseller
│   ├── sitemap.xml             # Site haritası
│   └── robots.txt              # Robots dosyası
│
├── styles/                      # Ek stiller
├── .env.example                # Environment örneği
├── .env.local                  # Environment değişkenleri (git'e eklenmez)
├── next.config.js              # Next.js yapılandırması
├── tailwind.config.js          # Tailwind yapılandırması
├── package.json                # Bağımlılıklar
└── README.md                   # Dokümantasyon
```

---

## 🎨 Tasarım Sistemi

### Renk Paleti

| Renk | Hex Code | Kullanım |
|------|----------|----------|
| Ana Arka Plan | `#0F0F0F` | Sayfa arka planı |
| İkincil Arka Plan | `#1A1A1A` | Section arka planı |
| Kart Arka Planı | `#2A2A2A` | Card componentler |
| Vurgu Rengi | `#D4AF37` | Butonlar, linkler (Altın) |
| İkincil Vurgu | `#8B0000` | Hover efektleri (Koyu kırmızı) |
| Metin Rengi | `#F5F5DC` | Ana metin (Krem) |
| İkincil Metin | `#A0A0A0` | Yardımcı metin (Gri) |

### Tipografi

- **Ana Font:** Inter (Sans-serif)
- **Başlık Font:** Playfair Display (Serif)
- **Responsive Ölçekleme:** Mobile-first yaklaşım

### Responsive Breakpoints

| Cihaz | Genişlik |
|-------|----------|
| Mobile | 320px - 768px |
| Tablet | 768px - 1024px |
| Desktop | 1024px - 1440px |
| Large Desktop | 1440px+ |

---

## 📸 Ekran Görüntüleri

### Ana Sayfa
![Ana Sayfa](https://via.placeholder.com/800x400?text=Homepage)

### Admin Dashboard
![Admin Dashboard](https://via.placeholder.com/800x400?text=Admin+Dashboard)

### Menü Sayfası
![Menü](https://via.placeholder.com/800x400?text=Menu+Page)

---

## 📊 Performans ve SEO

### SEO Özellikleri
- ✅ Meta tags ve Open Graph desteği
- ✅ Structured data (Restaurant schema)
- ✅ Sitemap.xml *(URL'leri güncelleyin)*
- ✅ Robots.txt *(Sitemap URL'ini güncelleyin)*
- ✅ Image optimization
- ✅ Core Web Vitals optimizasyonu

### Performance
- ⚡ Next.js Image optimization
- ⚡ Code splitting
- ⚡ Lazy loading
- ⚡ Caching strategies

### Accessibility
- ♿ Semantic HTML
- ♿ ARIA labels
- ♿ Keyboard navigation
- ♿ Screen reader support

---

## 🤝 Katkıda Bulunma

Katkılarınızı bekliyoruz! Aşağıdaki adımları izleyerek projeye katkıda bulunabilirsiniz:

1. Projeyi fork edin
2. Feature branch oluşturun
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. Değişikliklerinizi commit edin
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. Branch'inizi push edin
   ```bash
   git push origin feature/amazing-feature
   ```
5. Pull Request oluşturun

### Katkı Kuralları

- Kod standartlarına uyun (ESLint + Prettier)
- Anlaşılır commit mesajları yazın
- Değişikliklerinizi test edin
- Dokümantasyonu güncelleyin

---

## 🔄 Güncellemeler

### v2.0.0 (Güncel)
- ✅ Admin paneli tamamen yeniden tasarlandı
- ✅ Otomatik yedekleme sistemi eklendi
- ✅ Cloudinary entegrasyonu
- ✅ Push notification desteği
- ✅ Güvenlik iyileştirmeleri
- ✅ Performance optimizasyonları

### Yakında Gelecek
- 🔄 Kullanıcı hesap sistemi
- 🔄 E-commerce entegrasyonu
- 🔄 Çoklu dil desteği (TR/EN)
- 🔄 Mobile uygulama
- 🔄 AI destekli öneriler

---

## 📄 Lisans

Bu proje [MIT Lisansı](LICENSE) altında lisanslanmıştır.

---

## 📞 İletişim

### Geliştirici

**Kroxly Code**
- 📧 E-posta: [kroxlycode@gmail.com](mailto:kroxlycode@gmail.com)
- 🐙 GitHub: [@kroxlycode](https://github.com/kroxlycode)
- 🌐 Website: [kroxly.dev](https://kroxly.dev)

### Destek

- 🐛 **Bug Reports:** [GitHub Issues](https://github.com/kroxlycode/restly-restaurant/issues)
- 📖 **Dokümantasyon:** [Wiki](https://github.com/kroxlycode/restly-restaurant/wiki)
- 💬 **Sorularınız:** [Discussions](https://github.com/kroxlycode/restly-restaurant/discussions)

---

## ⭐ Teşekkürler

Projeyi beğendiyseniz yıldız vermeyi unutmayın! ⭐

---

<div align="center">

**[⬆ Başa Dön](#restly---modern-restaurant-website)**

Made with ❤️ by [Kroxly Code](https://kroxly.dev)

</div>
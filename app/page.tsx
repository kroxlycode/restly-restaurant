import HeroSection from '@/components/HeroSection'
import FeaturesSection from '@/components/FeaturesSection'
import PopularDishes from '@/components/PopularDishes'
import AboutPreview from '@/components/AboutPreview'
import Testimonials from '@/components/Testimonials'
import LocationContact from '@/components/LocationContact'

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <PopularDishes />
      <AboutPreview />
      <Testimonials />
      <LocationContact />
    </div>
  )
}

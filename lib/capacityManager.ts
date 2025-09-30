import fs from 'fs'
import path from 'path'

interface ReservationData {
  id: string
  name: string
  email: string
  phone: string
  date: string
  time: string
  guests: number
  specialRequests: string
  status: 'pending' | 'confirmed' | 'cancelled'
  createdAt: string
  kvkkConsent: boolean
  marketingConsent: boolean
}

const RESERVATIONS_FILE = path.join(process.cwd(), 'data', 'reservations.json')


const RESTAURANT_CAPACITY = {
  maxGuestsPerSlot: 50,
  maxTablesPerSlot: 15, 
  averageGuestsPerTable: 3.5 
}

export async function checkCapacity(date: string, time: string, requestedGuests: number) {
  try {

    const reservations = await getReservations()
    

    const existingReservations = reservations.filter(
      (reservation: ReservationData) => 
        reservation.date === date && 
        reservation.time === time && 
        (reservation.status === 'confirmed' || reservation.status === 'pending')
    )
    

    const currentGuests = existingReservations.reduce(
      (total: number, reservation: ReservationData) => total + reservation.guests, 
      0
    )
    

    const totalGuestsAfterReservation = currentGuests + requestedGuests
    

    const isAvailable = totalGuestsAfterReservation <= RESTAURANT_CAPACITY.maxGuestsPerSlot
    
    if (isAvailable) {
      const remainingCapacity = RESTAURANT_CAPACITY.maxGuestsPerSlot - totalGuestsAfterReservation
      return {
        available: true,
        message: `✅ Rezervasyon yapılabilir! Kalan kapasite: ${remainingCapacity} kişi`,
        currentGuests,
        remainingCapacity,
        requestedGuests
      }
    } else {
      const availableCapacity = RESTAURANT_CAPACITY.maxGuestsPerSlot - currentGuests
      return {
        available: false,
        message: `❌ Bu tarih ve saatte kapasite dolu! Maksimum ${availableCapacity > 0 ? availableCapacity : 0} kişi alınabilir.`,
        currentGuests,
        remainingCapacity: Math.max(0, RESTAURANT_CAPACITY.maxGuestsPerSlot - currentGuests),
        requestedGuests
      }
    }
  } catch (error) {
    console.error('Kapasite kontrol hatası:', error)
    return {
      available: false,
      message: '⚠️ Kapasite kontrolü yapılamadı. Lütfen tekrar deneyin.',
      currentGuests: 0,
      remainingCapacity: 0,
      requestedGuests
    }
  }
}

async function getReservations(): Promise<ReservationData[]> {
  try {
    if (!fs.existsSync(RESERVATIONS_FILE)) {
      return []
    }
    
    const data = fs.readFileSync(RESERVATIONS_FILE, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Rezervasyon verileri okunamadı:', error)
    return []
  }
}

export async function getCapacityStats(date?: string) {
  try {
    const reservations = await getReservations()
    

    if (date) {
      const dateReservations = reservations.filter(
        (reservation: ReservationData) => 
          reservation.date === date && 
          (reservation.status === 'confirmed' || reservation.status === 'pending')
      )
      
      const timeSlots = [
        '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
        '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
        '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30'
      ]
      
      const capacityByTime = timeSlots.map(time => {
        const timeReservations = dateReservations.filter(
          (reservation: ReservationData) => reservation.time === time
        )
        
        const totalGuests = timeReservations.reduce(
          (total: number, reservation: ReservationData) => total + reservation.guests,
          0
        )
        
        return {
          time,
          currentGuests: totalGuests,
          remainingCapacity: RESTAURANT_CAPACITY.maxGuestsPerSlot - totalGuests,
          utilizationRate: (totalGuests / RESTAURANT_CAPACITY.maxGuestsPerSlot) * 100,
          reservationCount: timeReservations.length,
          isFull: totalGuests >= RESTAURANT_CAPACITY.maxGuestsPerSlot
        }
      })
      
      return {
        date,
        capacityByTime,
        totalCapacity: RESTAURANT_CAPACITY.maxGuestsPerSlot,
        totalReservations: dateReservations.length,
        totalGuests: dateReservations.reduce(
          (total: number, reservation: ReservationData) => total + reservation.guests,
          0
        )
      }
    }
    

    const confirmedReservations = reservations.filter(
      (reservation: ReservationData) => (reservation.status === 'confirmed' || reservation.status === 'pending')
    )
    
    return {
      totalCapacity: RESTAURANT_CAPACITY.maxGuestsPerSlot,
      settings: RESTAURANT_CAPACITY,
      totalReservations: confirmedReservations.length,
      totalGuests: confirmedReservations.reduce(
        (total: number, reservation: ReservationData) => total + reservation.guests,
        0
      )
    }
  } catch (error) {
    console.error('Kapasite istatistikleri alınamadı:', error)
    return {
      totalCapacity: RESTAURANT_CAPACITY.maxGuestsPerSlot,
      settings: RESTAURANT_CAPACITY,
      totalReservations: 0,
      totalGuests: 0
    }
  }
}


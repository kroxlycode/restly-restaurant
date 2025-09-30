import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const RESERVATIONS_FILE = path.join(process.cwd(), 'data', 'reservations.json')

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

function getReservations(): ReservationData[] {
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

function getTodayStats(reservations: ReservationData[]) {
  const today = new Date().toISOString().split('T')[0]

  const todayReservations = reservations.filter(
    (r: ReservationData) =>
      r.date === today &&
      (r.status === 'confirmed' || r.status === 'pending')
  )

  const totalGuests = todayReservations.reduce(
    (sum: number, r: ReservationData) => sum + r.guests,
    0
  )


  const CAPACITY_SETTINGS_FILE = path.join(process.cwd(), 'data', 'capacity-settings.json')
  let maxCapacity = 50

  try {
    if (fs.existsSync(CAPACITY_SETTINGS_FILE)) {
      const settingsData = fs.readFileSync(CAPACITY_SETTINGS_FILE, 'utf8')
      const settings = JSON.parse(settingsData)
      maxCapacity = settings.maxGuestsPerSlot || 50
    }
  } catch (error) {
    console.error('Kapasite ayarları okunamadı:', error)
  }

  return {
    reservations: todayReservations.length,
    guests: totalGuests,
    capacity: maxCapacity,
    utilization: maxCapacity > 0 ? (totalGuests / maxCapacity) * 100 : 0
  }
}

function getWeeklyStats(reservations: ReservationData[]) {
  const today = new Date()
  const weekStart = new Date(today)
  weekStart.setDate(today.getDate() - today.getDay())

  const weekReservations = reservations.filter(
    (r: ReservationData) => {
      const reservationDate = new Date(r.date)
      return reservationDate >= weekStart &&
             reservationDate <= today &&
             (r.status === 'confirmed' || r.status === 'pending')
    }
  )

  const totalGuests = weekReservations.reduce(
    (sum: number, r: ReservationData) => sum + r.guests,
    0
  )


  const CAPACITY_SETTINGS_FILE = path.join(process.cwd(), 'data', 'capacity-settings.json')
  let maxCapacity = 50

  try {
    if (fs.existsSync(CAPACITY_SETTINGS_FILE)) {
      const settingsData = fs.readFileSync(CAPACITY_SETTINGS_FILE, 'utf8')
      const settings = JSON.parse(settingsData)
      maxCapacity = settings.maxGuestsPerSlot || 50
    }
  } catch (error) {
    console.error('Kapasite ayarları okunamadı:', error)
  }

  const daysInWeek = 7
  const weeklyCapacity = maxCapacity * daysInWeek

  return {
    reservations: weekReservations.length,
    guests: totalGuests,
    capacity: weeklyCapacity,
    utilization: weeklyCapacity > 0 ? (totalGuests / weeklyCapacity) * 100 : 0
  }
}

function getPopularSlots(reservations: ReservationData[]) {
  const timeSlots = [
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
    '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30'
  ]


  const CAPACITY_SETTINGS_FILE = path.join(process.cwd(), 'data', 'capacity-settings.json')
  let maxCapacity = 50

  try {
    if (fs.existsSync(CAPACITY_SETTINGS_FILE)) {
      const settingsData = fs.readFileSync(CAPACITY_SETTINGS_FILE, 'utf8')
      const settings = JSON.parse(settingsData)
      maxCapacity = settings.maxGuestsPerSlot || 50
    }
  } catch (error) {
    console.error('Kapasite ayarları okunamadı:', error)
  }

  const slotStats = timeSlots.map(time => {
    const slotReservations = reservations.filter(
      (r: ReservationData) =>
        r.time === time &&
        (r.status === 'confirmed' || r.status === 'pending')
    )

    const totalGuests = slotReservations.reduce(
      (sum: number, r: ReservationData) => sum + r.guests,
      0
    )

    const utilization = maxCapacity > 0 ? (totalGuests / maxCapacity) * 100 : 0

    return {
      time,
      reservations: slotReservations.length,
      guests: totalGuests,
      utilization
    }
  })


  return slotStats
    .sort((a, b) => b.utilization - a.utilization)
    .slice(0, 5)
}


export async function GET() {
  try {
    const reservations = getReservations()

    const todayStats = getTodayStats(reservations)
    const weeklyStats = getWeeklyStats(reservations)
    const popularSlots = getPopularSlots(reservations)

    const stats = {
      todayReservations: todayStats.reservations,
      todayCapacity: todayStats.capacity,
      todayUtilization: todayStats.utilization,
      weeklyReservations: weeklyStats.reservations,
      weeklyCapacity: weeklyStats.capacity,
      weeklyUtilization: weeklyStats.utilization,
      popularSlots: popularSlots.map(slot => ({
        time: slot.time,
        reservations: slot.reservations,
        utilization: slot.utilization
      }))
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Kapasite istatistikleri alınamadı:', error)
    return NextResponse.json(
      { error: 'İstatistikler alınamadı' },
      { status: 500 }
    )
  }
}


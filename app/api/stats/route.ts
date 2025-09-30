import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const messagesFilePath = path.join(process.cwd(), 'data', 'messages.json')
const reservationsFilePath = path.join(process.cwd(), 'data', 'reservations.json')

export async function GET() {
  try {

    const messagesContents = fs.readFileSync(messagesFilePath, 'utf8')
    const messages = JSON.parse(messagesContents)
    

    const reservationsContents = fs.readFileSync(reservationsFilePath, 'utf8')
    const reservations = JSON.parse(reservationsContents)
    

    const totalMessages = messages.length
    const unreadMessages = messages.filter((m: any) => !m.read).length
    const totalReservations = reservations.length
    const pendingReservations = reservations.filter((r: any) => r.status === 'pending').length
    const confirmedReservations = reservations.filter((r: any) => r.status === 'confirmed').length
    const cancelledReservations = reservations.filter((r: any) => r.status === 'cancelled').length
    

    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    
    const recentMessages = messages.filter((m: any) => 
      new Date(m.createdAt) > sevenDaysAgo
    ).length
    
    const recentReservations = reservations.filter((r: any) => 
      new Date(r.createdAt) > sevenDaysAgo
    ).length
    

    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()
    
    const monthlyMessages = messages.filter((m: any) => {
      const date = new Date(m.createdAt)
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear
    }).length
    
    const monthlyReservations = reservations.filter((r: any) => {
      const date = new Date(r.createdAt)
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear
    }).length
    
    const stats = {
      totalMessages,
      unreadMessages,
      totalReservations,
      pendingReservations,
      confirmedReservations,
      cancelledReservations,
      recentMessages,
      recentReservations,
      monthlyMessages,
      monthlyReservations,
      totalPendingActions: unreadMessages + pendingReservations
    }
    
    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error calculating stats:', error)
    return NextResponse.json({ error: 'Failed to calculate stats' }, { status: 500 })
  }
}


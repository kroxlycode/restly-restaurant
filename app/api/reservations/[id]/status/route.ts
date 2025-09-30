import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const reservationsFilePath = path.join(process.cwd(), 'data', 'reservations.json')

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const { status } = await request.json()

    const fileContents = fs.readFileSync(reservationsFilePath, 'utf8')
    const reservations = JSON.parse(fileContents)

    const reservationIndex = reservations.findIndex((r: any) => r.id === id)
    if (reservationIndex === -1) {
      return NextResponse.json({ error: 'Reservation not found' }, { status: 404 })
    }

    reservations[reservationIndex].status = status
    fs.writeFileSync(reservationsFilePath, JSON.stringify(reservations, null, 2))

    return NextResponse.json(reservations[reservationIndex])
  } catch (error) {
    console.error('Error updating reservation status:', error)
    return NextResponse.json({ error: 'Failed to update reservation status' }, { status: 500 })
  }
}

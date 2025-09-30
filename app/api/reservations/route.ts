import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const reservationsFilePath = path.join(process.cwd(), 'data', 'reservations.json')

export async function GET() {
  try {
    const fileContents = fs.readFileSync(reservationsFilePath, 'utf8')
    const reservations = JSON.parse(fileContents)


    reservations.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    const response = NextResponse.json(reservations)
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    return response
  } catch (error) {
    console.error('Error reading reservations:', error)
    const response = NextResponse.json({ error: 'Failed to read reservations' }, { status: 500 })
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    return response
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const fileContents = fs.readFileSync(reservationsFilePath, 'utf8')
    const reservations = JSON.parse(fileContents)

    const newReservation = {
      id: Date.now().toString(),
      ...body,
      createdAt: new Date().toISOString(),
      status: 'pending'
    }

    reservations.push(newReservation)
    fs.writeFileSync(reservationsFilePath, JSON.stringify(reservations, null, 2))

    const response = NextResponse.json(newReservation, { status: 201 })
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    return response
  } catch (error) {
    console.error('Error creating reservation:', error)
    const response = NextResponse.json({ error: 'Failed to create reservation' }, { status: 500 })
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    return response
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { id, status } = await request.json()
    const fileContents = fs.readFileSync(reservationsFilePath, 'utf8')
    const reservations = JSON.parse(fileContents)

    const reservationIndex = reservations.findIndex((r: any) => r.id === id)
    if (reservationIndex === -1) {
      const response = NextResponse.json({ error: 'Reservation not found' }, { status: 404 })
      response.headers.set('Access-Control-Allow-Origin', '*')
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
      return response
    }

    reservations[reservationIndex].status = status
    fs.writeFileSync(reservationsFilePath, JSON.stringify(reservations, null, 2))

    const response = NextResponse.json(reservations[reservationIndex])
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    return response
  } catch (error) {
    console.error('Error updating reservation:', error)
    const response = NextResponse.json({ error: 'Failed to update reservation' }, { status: 500 })
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    return response
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      const response = NextResponse.json({ error: 'Reservation ID required' }, { status: 400 })
      response.headers.set('Access-Control-Allow-Origin', '*')
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
      return response
    }

    const fileContents = fs.readFileSync(reservationsFilePath, 'utf8')
    const reservations = JSON.parse(fileContents)

    const filteredReservations = reservations.filter((r: any) => r.id !== id)
    fs.writeFileSync(reservationsFilePath, JSON.stringify(filteredReservations, null, 2))

    const response = NextResponse.json({ success: true })
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    return response
  } catch (error) {
    console.error('Error deleting reservation:', error)
    const response = NextResponse.json({ error: 'Failed to delete reservation' }, { status: 500 })
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    return response
  }
}

export async function OPTIONS() {
  const response = new NextResponse(null, { status: 200 })
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  return response
}

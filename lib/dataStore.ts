


export interface ContactMessage {
  id: string
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  createdAt: Date
  read: boolean
}

export interface Reservation {
  id: string
  name: string
  email: string
  phone: string
  date: string
  time: string
  guests: number
  specialRequests?: string
  kvkkConsent: boolean
  marketingConsent: boolean
  createdAt: Date
  status: 'pending' | 'confirmed' | 'cancelled'
}





export const getContactMessages = async (): Promise<ContactMessage[]> => {
  try {
    const response = await fetch('/api/messages')
    if (response.ok) {
      const messages = await response.json()
      return messages
        .map((msg: any) => ({ ...msg, createdAt: new Date(msg.createdAt) }))
        .sort((a: ContactMessage, b: ContactMessage) => b.createdAt.getTime() - a.createdAt.getTime())
    }
  } catch (error) {
    console.error('Error fetching messages:', error)
  }
  return []
}

export const addContactMessage = async (message: Omit<ContactMessage, 'id' | 'createdAt' | 'read'>): Promise<ContactMessage | null> => {
  try {
    const response = await fetch('/api/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    })

    if (response.ok) {
      const newMessage = await response.json()
      return newMessage
    }
  } catch (error) {
    console.error('Error adding message:', error)
  }
  return null
}

export const markMessageAsRead = async (id: string): Promise<void> => {
  try {
    await fetch(`/api/messages/${id}/read`, {
      method: 'PATCH',
    })
  } catch (error) {
    console.error('Error marking message as read:', error)
  }
}

export const deleteContactMessage = async (id: string): Promise<void> => {
  try {
    await fetch(`/api/messages/${id}`, {
      method: 'DELETE',
    })
  } catch (error) {
    console.error('Error deleting message:', error)
  }
}


export const getReservations = async (): Promise<Reservation[]> => {
  try {
    const response = await fetch('/api/reservations')
    if (response.ok) {
      const reservations = await response.json()
      return reservations
        .map((res: any) => ({ ...res, createdAt: new Date(res.createdAt) }))
        .sort((a: Reservation, b: Reservation) => b.createdAt.getTime() - a.createdAt.getTime())
    }
  } catch (error) {
    console.error('Error fetching reservations:', error)
  }
  return []
}

export const addReservation = async (reservation: Omit<Reservation, 'id' | 'createdAt' | 'status'>): Promise<Reservation | null> => {
  try {
    const response = await fetch('/api/reservations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reservation),
    })

    if (response.ok) {
      const newReservation = await response.json()
      return newReservation
    }
  } catch (error) {
    console.error('Error adding reservation:', error)
  }
  return null
}

export const updateReservationStatus = async (id: string, status: Reservation['status']): Promise<void> => {
  try {
    await fetch(`/api/reservations/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    })
  } catch (error) {
    console.error('Error updating reservation status:', error)
  }
}

export const deleteReservation = async (id: string): Promise<void> => {
  try {
    await fetch(`/api/reservations/${id}`, {
      method: 'DELETE',
    })
  } catch (error) {
    console.error('Error deleting reservation:', error)
  }
}


export const getStats = async () => {
  try {
    const response = await fetch('/api/stats')
    if (response.ok) {
      return await response.json()
    }
  } catch (error) {
    console.error('Error fetching stats:', error)
  }

  return {
    totalMessages: 0,
    unreadMessages: 0,
    totalReservations: 0,
    pendingReservations: 0,
    confirmedReservations: 0
  }
}

import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const messagesFilePath = path.join(process.cwd(), 'data', 'messages.json')

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string, action: string } }
) {
  try {
    const { id, action } = params

    const fileContents = fs.readFileSync(messagesFilePath, 'utf8')
    const messages = JSON.parse(fileContents)

    const messageIndex = messages.findIndex((m: any) => m.id === id)
    if (messageIndex === -1) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 })
    }

    if (action === 'read') {
      messages[messageIndex].read = true
    }

    fs.writeFileSync(messagesFilePath, JSON.stringify(messages, null, 2))

    return NextResponse.json(messages[messageIndex])
  } catch (error) {
    console.error('Error updating message:', error)
    return NextResponse.json({ error: 'Failed to update message' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const fileContents = fs.readFileSync(messagesFilePath, 'utf8')
    const messages = JSON.parse(fileContents)

    const filteredMessages = messages.filter((m: any) => m.id !== id)
    fs.writeFileSync(messagesFilePath, JSON.stringify(filteredMessages, null, 2))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting message:', error)
    return NextResponse.json({ error: 'Failed to delete message' }, { status: 500 })
  }
}

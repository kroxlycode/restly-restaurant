import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const messagesFilePath = path.join(process.cwd(), 'data', 'messages.json')

export async function GET() {
  try {
    const fileContents = fs.readFileSync(messagesFilePath, 'utf8')
    const messages = JSON.parse(fileContents)
    

    messages.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    
    return NextResponse.json(messages)
  } catch (error) {
    console.error('Error reading messages:', error)
    return NextResponse.json({ error: 'Failed to read messages' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const fileContents = fs.readFileSync(messagesFilePath, 'utf8')
    const messages = JSON.parse(fileContents)
    
    const newMessage = {
      id: Date.now().toString(),
      ...body,
      createdAt: new Date().toISOString(),
      read: false
    }
    
    messages.push(newMessage)
    fs.writeFileSync(messagesFilePath, JSON.stringify(messages, null, 2))
    
    return NextResponse.json(newMessage, { status: 201 })
  } catch (error) {
    console.error('Error creating message:', error)
    return NextResponse.json({ error: 'Failed to create message' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { id, action } = await request.json()
    const fileContents = fs.readFileSync(messagesFilePath, 'utf8')
    const messages = JSON.parse(fileContents)
    
    const messageIndex = messages.findIndex((m: any) => m.id === id)
    if (messageIndex === -1) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 })
    }
    
    if (action === 'mark_read') {
      messages[messageIndex].read = true
    }
    
    fs.writeFileSync(messagesFilePath, JSON.stringify(messages, null, 2))
    
    return NextResponse.json(messages[messageIndex])
  } catch (error) {
    console.error('Error updating message:', error)
    return NextResponse.json({ error: 'Failed to update message' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'Message ID required' }, { status: 400 })
    }
    
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


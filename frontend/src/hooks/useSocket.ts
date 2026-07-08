'use client'

import { useEffect, useRef } from 'react'
import { io, Socket } from 'socket.io-client'
import { useAuthStore } from '@/store/auth.store'
import toast from 'react-hot-toast'

export function useSocket() {
  const socketRef = useRef<Socket | null>(null)
  const { isAuthenticated } = useAuthStore()

  useEffect(() => {
    if (!isAuthenticated) return

    const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001'

    socketRef.current = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
    })

    const socket = socketRef.current

    socket.on('connect', () => {
      console.log('Socket connected:', socket.id)
    })

    socket.on('notification', (data: { title: string; body: string; type: string }) => {
      toast(data.body, {
        icon: data.type === 'quote' ? '📋' : data.type === 'message' ? '💬' : '🔔',
        duration: 5000,
      })
    })

    socket.on('new_quote', (data: { title: string }) => {
      toast.success(`Nouveau devis reçu : ${data.title}`)
    })

    socket.on('new_message', (data: { name: string }) => {
      toast(`Nouveau message de ${data.name}`, { icon: '💬' })
    })

    socket.on('disconnect', () => {
      console.log('Socket disconnected')
    })

    return () => {
      socket.disconnect()
    }
  }, [isAuthenticated])

  return socketRef.current
}

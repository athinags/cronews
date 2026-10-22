'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Event } from '@/types/database'
import { useAuth } from '@/contexts/AuthContext'

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const { user, canManageEvents } = useAuth()

  const fetchEvents = async (ano?: number) => {
    try {
      let query = supabase.from('events').select('*')
      
      if (ano) {
        query = query.eq('ano', ano)
      }

      const { data, error } = await query.order('ano', { ascending: false })

      if (error) {
        throw new Error(error.message)
      }

      setEvents(data || [])
      return data || []
    } catch (error) {
      console.error('Erro ao buscar eventos:', error)
      return []
    } finally {
      setLoading(false)
    }
  }

  const createEvent = async (titulo: string, ano: string, ocorrido: string, imagem: string, eventData: Omit<Event, 'id' | 'autor'>) => {
    //ver se tem permicao para editar eventos
    if (!canManageEvents()) {
      return { 
        success: false, 
        error: 'Apenas Cronautas podem criar eventos' 
      }
    }

    if (!user) {
      return { 
        success: false, 
        error: 'Usuário não autenticado' 
      }
    }

    try {
      const { data, error } = await supabase
        .from('events')
        .insert([{
          ...eventData,
          autor: user.login
        }])
        .select()
        .single()

      if (error) {
        throw new Error(error.message)
      }

      setEvents(prev => [data, ...prev])
      return { success: true, data }
    } catch (error) {
      return { success: false, error: (error as Error).message }
    }
  }

  const updateEvent = async (id: string, eventData: Partial<Omit<Event, 'id' | 'autor'>>) => {
    //ver se tem permicao para editar eventos
    if (!canManageEvents()) {
      return { 
        success: false, 
        error: 'Apenas Cronautas podem editar eventos' 
      }
    }

    try {
      const { data, error } = await supabase
        .from('events')
        .update(eventData)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        throw new Error(error.message)
      }

      setEvents(prev => prev.map(event => 
        event.id === id ? data : event
      ))
      return { success: true, data }
    } catch (error) {
      return { success: false, error: (error as Error).message }
    }
  }

  const deleteEvent = async (id: string) => {
    if (!canManageEvents()) {
      return { 
        success: false, 
        error: 'Apenas Cronautas podem deletar eventos' 
      }
    }

    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id)

      if (error) {
        throw new Error(error.message)
      }

      setEvents(prev => prev.filter(event => event.id !== id))
      return { success: true }
    } catch (error) {
      return { success: false, error: (error as Error).message }
    }
  }

  const getEventsByYear = async (ano: number) => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('ano', ano)

      if (error) {
        throw new Error(error.message)
      }

      return data || []
    } catch (error) {
      console.error('Erro ao buscar eventos por ano:', error)
      return []
    }
  }

  const getEventsByAuthor = async (autor: string) => {
       if (!canManageEvents()) {
      return []
    }

    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('autor', autor)

      if (error) {
        throw new Error(error.message)
      }

      return data || []
    } catch (error) {
      console.error('Erro ao buscar eventos por autor:', error)
      return []
    }
  }

  const searchEvents = async (searchTerm: string) => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .or(`titulo.ilike.%${searchTerm}%,ocorrido.ilike.%${searchTerm}%`)
        .order('ano', { ascending: false })
        .limit(50)

      if (error) {
        throw new Error(error.message)
      }

      return data || []
    } catch (error) {
      console.error('Erro ao buscar eventos:', error)
      return []
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  return { 
    events, 
    loading, 
    fetchEvents, 
    createEvent, 
    updateEvent,
    deleteEvent,
    getEventsByYear,
    getEventsByAuthor,
    searchEvents
  }
}
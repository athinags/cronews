'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { supabase } from '@/lib/supabase'
import { User } from '@/types/database'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (login: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (email: string, login: string, password: string, role?: 'viajante' | 'cronauta') => Promise<{ success: boolean; error?: string }>
  logout: () => void
  isCronauta: () => boolean
  canManageEvents: () => boolean
  canViewEvents: () => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const storedUser = localStorage.getItem('cronews-user')
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser)
        setUser(userData)
      } catch (error) {
        localStorage.removeItem('cronews-user')
      }
    }
    setLoading(false)
  }

  const login = async (login: string, password: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('login', login)
        .eq('password', password)
        .single()

      if (error || !data) {
        throw new Error('Usuário ou senha incorretos')
      }

      localStorage.setItem('cronews-user', JSON.stringify(data))
      setUser(data) // Isso vai atualizar imediatamente todos os componentes
      return { success: true }
    } catch (error) {
      return { success: false, error: (error as Error).message }
    }
  }

  const register = async (
    email: string, 
    login: string, 
    password: string, 
    role: 'viajante' | 'cronauta' = 'viajante'
  ) => {
    try {
      // Verificar se já existe usuário com este login ou email
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .or(`login.eq.${login},email.eq.${email}`)
        .single()

      if (existingUser) {
        throw new Error('Login ou email já existe')
      }

      const { data, error } = await supabase
        .from('users')
        .insert([{ email, login, password, role }])
        .select()
        .single()

      if (error) {
        throw new Error(error.message)
      }

      localStorage.setItem('cronews-user', JSON.stringify(data))
      setUser(data) // Isso vai atualizar imediatamente todos os componentes
      return { success: true }
    } catch (error) {
      return { success: false, error: (error as Error).message }
    }
  }

  const logout = () => {
    localStorage.removeItem('cronews-user')
    setUser(null) // Isso vai atualizar imediatamente todos os componentes
  }

  const isCronauta = () => {
    return user?.role === 'cronauta'
  }

  const canManageEvents = () => {
    return isCronauta()
  }

  const canViewEvents = () => {
    return !!user
  }

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
      isCronauta,
      canManageEvents,
      canViewEvents
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}
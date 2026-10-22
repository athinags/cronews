export interface User {
  id: string
  email: string
  login: string
  password: string
  role: 'cronauta' | 'viajante'
  created_at: string
}

export interface Event {
  id: string
  titulo: string
  ano: number
  ocorrido: string
  imagem?: string
  autor: string
}

export interface Database {
  public: {
    Tables: {
      users: {
        Row: User
        Insert: Omit<User, 'id' | 'created_at'>
        Update: Partial<Omit<User, 'id' | 'created_at'>>
      }
      events: {
        Row: Event
        Insert: Omit<Event, 'id'>
        Update: Partial<Omit<Event, 'id'>>
      }
    }
  }
}
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useEvents } from '@/hooks/useEvents'
import Link from 'next/link'

export default function CadastrarEvento() {
  const [titulo, setTitulo] = useState('')
  const [ano, setAno] = useState('')
  const [ocorrido, setOcorrido] = useState('')
  const [imagem, setImagem] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const router = useRouter()
  const { user, canManageEvents, loading: authLoading } = useAuth()
  const { createEvent } = useEvents()

  if (!authLoading && (!user || !canManageEvents())) {
    router.push('/')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      if (!titulo.trim()) {
        throw new Error('Título é obrigatório')
      }

      if (!ano.trim()) {
        throw new Error('Ano é obrigatório')
      }

      const anoNumber = parseInt(ano)
      if (anoNumber>2025 || anoNumber < -18000000000) {
        throw new Error('Digite um ano válido')
      }

      if (!ocorrido.trim()) {
        throw new Error('Conte o que aconteceu')
      }

      //Cria evento
      const result = await createEvent(titulo, ano, ocorrido, imagem, {
        titulo: titulo.trim(),
        ano: anoNumber,
        ocorrido: ocorrido.trim(),
        imagem: imagem.trim()
      })

      if (result.success) {
        setSuccess(' Evento cadastrado com sucesso! ')
        // Limpa formulário
        setTitulo('')
        setAno('')
        setOcorrido('')
        setImagem('')
        
        setTimeout(() => {
          router.push('/viajar')
        }, 1000)
      } else {
        throw new Error(result.error || 'Erro ao cadastrar evento')
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="login-section">
      <div className="login-container">
        <div className="login-header">
          <h1 className="login-title">
            Cadastrar Novo Evento
          </h1>
          <p className="login-subtitle">
            Preencha os dados do evento histórico
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md">
              {success}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="titulo" className="form-label">
              Título do Evento *
            </label>
            <input
              type="text"
              id="titulo"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="form-input"
              placeholder="Ex: Independência do Brasil"
              required
              maxLength={200}
            />
            <div className="input-glow"></div>
          </div>

          <div className="form-group">
            <label htmlFor="ano" className="form-label">
              Ano do Evento *
            </label>
            <input
              type="number"
              id="ano"
              value={ano}
              onChange={(e) => setAno(e.target.value)}
              className="form-input"
              placeholder="Ex: 1822"
              required
              min="-18000000000"
              max="2025"
            />
            <div className="input-glow"></div>
          </div>

          <div className="form-group">
            <label htmlFor="ocorrido" className="form-label">
              Descrição do Ocorrido *
            </label>
            <textarea
              id="ocorrido"
              value={ocorrido}
              onChange={(e) => setOcorrido(e.target.value)}
              rows={6}
              className="form-input resize-vertical"
              placeholder="Descreva detalhadamente o que aconteceu neste evento histórico..."
              required
            />
            <div className="input-glow"></div>
          </div>

          <div className="form-group">
  <label htmlFor="imagem" className="form-label">
    URL da Imagem (Opcional)
  </label>
  <input
    type="url"
    id="imagem"
    value={imagem}
    onChange={(e) => setImagem(e.target.value)}
    className="form-input"
    placeholder="https://exemplo.com/imagem.jpg"
  />
  <div className="input-glow"></div>
  
  {imagem && (
    <div className="mt-3">
      <p className="text-sm text-gray-300 mb-2">Preview da imagem:</p>
      <div className="border border-gray-600 rounded-md p-2 bg-gray-800/50">
        <img 
          src={imagem} 
          alt="Preview" 
          className="max-w-full h-auto max-h-48 mx-auto rounded-md"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
        <p className="text-xs text-red-400 text-center mt-2 hidden" id="image-error">
          Não foi possível carregar a imagem
        </p>
      </div>
    </div>
  )}
  
  <p className="text-sm text-gray-400 mt-3">
    Cole a URL de uma imagem relacionada ao evento
  </p>
</div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="auth-button flex-1"
            >
              {loading ? 'Cadastrando...' : 'Cadastrar Evento'}
              <div className="button-particles"></div>
            </button>

            <Link
              href="/"
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 text-center"
            >
              Cancelar
            </Link>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            * Campos obrigatórios
          </p>
        </div>
      </div>
    </div>
  )
}
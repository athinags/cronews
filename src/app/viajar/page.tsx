'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useEvents } from '@/hooks/useEvents'
import { useRouter } from 'next/navigation'
import './styles.css' 
import { spec } from 'node:test/reporters'

export default function ViajarPage() {
  const { user, loading: authLoading } = useAuth()
  const { getEventsByYear } = useEvents()

  const [selectedTheme, setSelectedTheme] = useState<string | null>(null)
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null)
  const [specificYear, setSpecificYear] = useState<string>('')
  const [isTimeTravel, setIsTimeTravel] = useState(false)
  const [yearEvents, setYearEvents] = useState<any[]>([])
  const [showResults, setShowResults] = useState(false)
  const [showCronautaPanel, setShowCronautaPanel] = useState(false)
  const [editingEvent, setEditingEvent] = useState<any>(null)
  const [editFormData, setEditFormData] = useState({
    id: '',
    titulo: '',
    ocorrido: '',
    ano: '',
    imagem: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'warning', message: string } | null>(null)
  const { canManageEvents } = useAuth()
  const { deleteEvent, updateEvent } = useEvents()

  const startEditEvent = (event: any) => {
    setEditingEvent(event)
    setEditFormData({
      id: event.id,
      titulo:event.titulo,
      ocorrido: event.ocorrido,
      ano: event.ano.toString(),
      imagem: event.imagem || ''
    })
    setShowCronautaPanel(true)
  }

  const handleEditSubmit = async(e: React.FormEvent) => {
  e.preventDefault()
  setIsSubmitting(true)
  setStatusMessage(null)

  try {
    // Validações básicas
    if (!editFormData.titulo.trim() || !editFormData.ocorrido.trim() || !editFormData.ano) {
      throw new Error('Preencha todos os campos obrigatórios')
    }

    const anoNumber = parseInt(editFormData.ano)
    if (isNaN(anoNumber)) {
      throw new Error('Ano deve ser um número válido')
    }

    // Usando a função updateEvent do hook useEvents!!!!!!
    const result = await updateEvent(editFormData.id, {
      titulo: editFormData.titulo.trim(),
      ocorrido: editFormData.ocorrido.trim(),
      ano: anoNumber,
      imagem: editFormData.imagem.trim()
    })

    if (result.success) {
      setStatusMessage({ 
        type: 'success', 
        message: 'Evento atualizado com sucesso!' 
      })
      
      // Atualiza lista de eventos localmente
      setYearEvents(prev => prev.map(event => 
        event.id === editFormData.id ? result.data : event
      ))
      
      //Fechar painel
      setTimeout(() => {
        setShowCronautaPanel(false)
        setEditingEvent(null)
      }, 1000)
    } else {
      throw new Error(result.error || 'Erro ao atualizar evento')
    }
  } catch (error: any) {
    setStatusMessage({ 
      type: 'error', 
      message: error.message 
    })
  } finally {
    setIsSubmitting(false)
  }
}

  const router = useRouter()

  // Temas principais em json mesmo 👍
  const THEMES = [
    {
      id: 'galaxy',
      title: 'Galáxia',
      subtitle: 'Surgimento do Universo',
      icon: '🌌',
      color: '#8B5CF6',
      periods: [
        { id: 'bigbang', name: 'Big Bang', year: -13800000000, description: 'Origem do universo' },
        { id: 'first-stars', name: 'Primeiras Estrelas', year: -13200000000, description: 'Nascimento das primeiras estrelas' },
        { id: 'galaxies', name: 'Formação de Galáxias', year: -12000000000, description: 'Estruturas cósmicas se organizam' },
        { id: 'heavy-elements', name: 'Elementos Pesados', year: -10000000000, description: 'Criação de elementos complexos' }
      ]
    },
    {
      id: 'milky-way',
      title: 'Via Láctea',
      subtitle: 'Galáxia e Planetas',
      icon: '🌠',
      color: '#06B6D4',
      periods: [
        { id: 'milky-formation', name: 'Formação da Via Láctea', year: -10000000000, description: 'Nossa galáxia toma forma' },
        { id: 'solar-system', name: 'Sistema Solar', year: -4600000000, description: 'Nascimento do nosso sistema' },
        { id: 'planets', name: 'Formação dos Planetas', year: -4500000000, description: 'Planetas se consolidam' },
        { id: 'moon-formation', name: 'Formação da Lua', year: -4500000000, description: 'A Lua surge de uma colisão' }
      ]
    },
    {
      id: 'earth',
      title: 'Formação da Terra',
      subtitle: 'Vida e Evolução',
      icon: '🌍',
      color: '#10B981',
      periods: [
        { id: 'earth-cooling', name: 'Resfriamento da Terra', year: -4000000000, description: 'Planeta se torna habitável' },
        { id: 'first-life', name: 'Primeiras Formas de Vida', year: -3800000000, description: 'Vida microscópica surge' },
        { id: 'oxygen', name: 'Grande Oxigenação', year: -2400000000, description: 'Atmosfera muda drasticamente' },
        { id: 'complex-life', name: 'Vida Complexa', year: -1000000000, description: 'Células mais sofisticadas' },
        { id: 'cambrian', name: 'Explosão Cambriana', year: -540000000, description: 'Diversidade de vida explode' },
        { id: 'dinosaurs', name: 'Era dos Dinossauros', year: -230000000, description: 'Dinossauros dominam' },
        { id: 'extinction', name: 'Extinção dos Dinossauros', year: -65000000, description: 'Meteoro muda tudo' },
        { id: 'mammals', name: 'Era dos Mamíferos', year: -65000000, description: 'Mamíferos se diversificam' }
      ]
    },
    {
      id: 'human',
      title: 'Anos Humanos',
      subtitle: 'História da Humanidade',
      icon: '👤',
      color: '#F59E0B',
      periods: [
        { id: 'homo-sapiens', name: 'Homo Sapiens', year: -200000, description: 'Surge sua espécie' },
        { id: 'agriculture', name: 'Revolução Agrícola', year: -10000, description: 'Agricultura transforma sociedade' },
        { id: 'civilizations', name: 'Primeiras Civilizações', year: -3500, description: 'Cidades e escrita surgem' },
        { id: 'antiquity', name: 'Antiguidade Clássica', year: -800, description: 'Grécia e Roma florescem' },
        { id: 'middle-ages', name: 'Idade Média', year: 500, description: 'Período medieval' },
        { id: 'renaissance', name: 'Renascimento', year: 1400, description: 'Renascimento cultural' },
        { id: 'industrial', name: 'Revolução Industrial', year: 1800, description: 'Máquinas transformam o mundo' },
        { id: 'modern', name: 'Era Moderna', year: 1900, description: 'Século XX e suas mudanças' },
        { id: 'digital', name: 'Era Digital', year: 2000, description: 'Internet e tecnologia' }
      ]
    }
  ]

  const HUMAN_CENTURIES = [
    { id: 'ancient', name: 'Antiguidade', range: '3000 a.C. - 500 d.C.', years: [-3000, -2000, -1000, 0, 500] },
    { id: 'medieval', name: 'Idade Média', range: '500 - 1500 d.C.', years: [500, 800, 1000, 1200, 1400] },
    { id: 'modern', name: 'Era Moderna', range: '1500 - 1800 d.C.', years: [1500, 1600, 1700, 1800] },
    { id: 'industrial', name: 'Era Industrial', range: '1800 - 1950 d.C.', years: [1810, 1850, 1900, 1920, 1945] },
    { id: 'contemporary', name: 'Era Contemporânea', range: '1950 - Hoje', years: [1950, 1970, 1990, 2000, 2010, 2020] }
  ]

  // Redirecionar se não estiver logado
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  const handleThemeSelect = (themeId: string) => {
    setSelectedTheme(themeId)
    setSelectedPeriod(null)
    setSpecificYear('')
    setShowResults(false)
  }

  const handlePeriodSelect = async (periodId: string, year?: number) => {
    setSelectedPeriod(periodId)

    if (year) {
      await performTimeTravel(year)
    }
  }

  const handleYearSelect = async (year: number) => {
    await performTimeTravel(year)
  }

  const handleCustomYear = async () => {
    const year = parseInt(specificYear)
    if (isNaN(year)) {
      alert('Digite um ano válido!')
      return
    }

    if (year < -18300000000 || year > 2025) {
      alert('Digite um ano válido!')
      return
    }

    await performTimeTravel(year)
  }

  const performTimeTravel = async (year: number) => {
    setIsTimeTravel(true)
    setShowResults(false)

    setTimeout(async () => {
      try {
        const events = await getEventsByYear(year)
        setYearEvents(events)
        setShowResults(true)
      } catch (error) {
        console.error('Erro ao buscar eventos:', error)
        setYearEvents([])
        setShowResults(true)
      }

      setTimeout(() => {
        setIsTimeTravel(false)
      }, 500)
    }, 2000)
  }

  const formatYear = (year: number) => {
    if (year < -1000000000) {
      return `${Math.abs(year / 1000000000).toFixed(1)} bilhões de anos atrás`
    } else if (year < -1000000) {
      return `${Math.abs(year / 1000000).toFixed(1)} milhões de anos atrás`
    } else if (year < -1000) {
      return `${Math.abs(year / 1000).toFixed(0)} mil anos atrás`
    } else if (year < 0) {
      return `${Math.abs(year)} a.C.`
    } else {
      return `${year} d.C.`
    }
  }

  const getCurrentTheme = () => {
    return THEMES.find(t => t.id === selectedTheme)
  }

  const resetSelection = () => {
    setSelectedTheme(null)
    setSelectedPeriod(null)
    setSpecificYear('')
    setShowResults(false)
  }

  if (authLoading) {
    return (
      <div className="loading-screen">
        <div className="cosmic-loader"></div>
        <p>Inicializando Portal Temporal...</p>
      </div>
    )
  }


  if (!user) return null

  return (
    <div className="cosmic-container">


      {/* Overlay de viagem no tempo */}
      {isTimeTravel && (
        <div className="time-travel-overlay">
          <div className="wormhole">
            <div className="wormhole-ring ring-1"></div>
            <div className="wormhole-ring ring-2"></div>
            <div className="wormhole-ring ring-3"></div>
            <div className="wormhole-ring ring-4"></div>
          </div>
          <div className="travel-status">
            <h2>Atravessando o Espaço-Tempo...</h2>
            <div className="status-dots">
              <span></span><span></span><span></span>
            </div>
          </div>
        </div>
      )}




      {/* Interface principal */}
      <div className={`main-content ${isTimeTravel ? 'traveling' : ''}`}>
        {/* Header */}
        <header className="cosmic-header">
          <h1 className="main-title">Máquina do Tempo</h1>

          {!selectedTheme && (
            <p className="user-welcome">
              Olá, <span className="username">{user.login}</span>, para quando quer ir hoje?
              <br></br>
            </p>
          )}
          <p className='user-welcome'>
            Ocupação: {user.role === 'cronauta' ? '👁‍🗨 Cronauta ' : '💫 Viajante '}</p>
          {selectedTheme && (
            <button onClick={resetSelection} className="back-btn">
              ← Voltar à Seleção Principal
            </button>
          )}
        </header>

        {/* Seleção de tema principal */}
        {!selectedTheme && !showResults && (
          <div className="theme-selection">
            <h2 className="section-title">Escolha sua Jornada Temporal</h2>
            <div className="themes-grid">
              {THEMES.map((theme) => (
                <div
                  key={theme.id}
                  className="theme-card"
                  onClick={() => handleThemeSelect(theme.id)}
                  style={{ '--theme-color': theme.color } as React.CSSProperties}
                >
                  <div className="theme-icon">{theme.icon}</div>
                  <h3 className="theme-title">{theme.title}</h3>
                  <p className="theme-subtitle">{theme.subtitle}</p>
                  <div className="theme-glow"></div>
                </div>
              ))}
            </div>
              </div>
        )}
            {/* Seleção de ANO específico */}
              {!showResults && (
                <div className="custom-year-section">
                  <h4>Ou digite um ano específico:</h4>
                  <div className="custom-year-input">
                    <input
                      type="number"
                      value={specificYear}
                      onChange={(e) => setSpecificYear(e.target.value)}
                      placeholder="Ex: -18232999"
                      className="year-input"
                      min="-18300000000"
                      max="2025"
                    />
                    <button onClick={handleCustomYear} className="travel-btn">
                      Viajar
                    </button>
                  </div>
                </div>)}
          


        {/* Seleção de período específico */}
        {selectedTheme && !showResults && (
          <div className="period-selection">
            <div className="theme-header">
              <div className="current-theme-icon">
                {getCurrentTheme()?.icon}
              </div>
              <div>
                <h2 className="current-theme-title">{getCurrentTheme()?.title}</h2>
                <p className="current-theme-subtitle">{getCurrentTheme()?.subtitle}</p>
              </div>
            </div>

            
            {selectedTheme === 'human' ? (
              <div className="human-periods">
                <h3>Selecione um Período ou Ano Específico</h3>

                {/* Séculos/Períodos */}
                <div className="centuries-grid">
                  {HUMAN_CENTURIES.map((century) => (
                    <div key={century.id} className="century-card">
                      <h4>{century.name}</h4>
                      <p className="century-range">{century.range}</p>
                      <div className="year-buttons">
                        {century.years.map((year) => (
                          <button
                            key={year}
                            onClick={() => handleYearSelect(year)}
                            className="year-btn"
                          >
                            {year < 0 ? `${Math.abs(year)} a.C.` : `${year}`}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Outros temas */
              <div className="periods-grid">
                {getCurrentTheme()?.periods.map((period) => (
                  <div
                    key={period.id}
                    className="period-card"
                    onClick={() => handlePeriodSelect(period.id, period.year)}
                  >
                    <h3 className="period-name">{period.name}</h3>
                    <p className="period-time">{formatYear(period.year)}</p>
                    <p className="period-description">{period.description}</p>
                    <div className="period-arrow">→</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Resultados */}
        {showResults && (
          <div className="results-section">
            <div className="results-header">
              <h2>Eventos Encontrados</h2>
              <button onClick={resetSelection} className="new-search-btn">
                Nova Busca
              </button>
            </div>

            {yearEvents.length > 0 ? (
              <div className="events-grid">
                {yearEvents.map((event, index) => (
                  <div
                    key={event.id}
                    className="event-card"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="event-content">
                      <h3 className="event-title">{event.titulo}</h3>
                      <p className="event-year">📅 {formatYear(event.ano)}</p>
                      <p className="event-description">{event.ocorrido}</p>

                      {event.imagem && (
                        <div className="event-image">
                          <img
                            src={event.imagem}
                            alt={event.titulo}
                          />
                        </div>
                      )}

                      <div className="event-meta">
                        <span>👤 {event.autor}</span>
                      </div>

                      {canManageEvents() && (
                        <div className="event-cronauta-actions">
                          <button
                            onClick={() => {
                              startEditEvent(event)
                              setShowCronautaPanel(true)
                            }}
                            className="mini-action-btn edit"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => deleteEvent(event.id)}
                            className="mini-action-btn delete"
                          >
                            🗑️
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-events">
                <div className="empty-icon">🔍</div>
                <h3>Nenhum evento registrado</h3>
                <p>Não há registros neste período temporal.</p>
              </div>
            )}
          </div>
        )}

      </div>
      {showCronautaPanel && (
        <div className="cronauta-panel-overlay">
          <div className="cronauta-panel">
            <div className="panel-header">
              <h2>{editingEvent ? 'Editar Evento' : 'Criar Novo Evento'}</h2>
              <button
                onClick={() => setShowCronautaPanel(false)}
                className="close-panel-btn"
              >
                ✕
              </button>
            </div>

            <div className="panel-content">
              <form onSubmit={handleEditSubmit}>
                <div className="form-group">
                  <label>Título:</label>
                  <input
                    type="text"
                    value={editFormData.titulo}
                    onChange={(e) => setEditFormData({ ...editFormData, titulo: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Ano:</label>
                  <input
                    type="number"
                    value={editFormData.ano}
                    onChange={(e) => setEditFormData({ ...editFormData, ano: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Descrição:</label>
                  <textarea
                    value={editFormData.ocorrido}
                    onChange={(e) => setEditFormData({ ...editFormData, ocorrido: e.target.value })}
                    required
                    rows={4}
                  />
                </div>

                <div className="form-group">
                  <label>URL da Imagem (opcional):</label>
                  <input
                    type="url"
                    value={editFormData.imagem}
                    onChange={(e) => setEditFormData({ ...editFormData, imagem: e.target.value })}
                  />
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    onClick={() => setShowCronautaPanel(false)}
                    className="cancel-btn"
                  >
                    Cancelar
                  </button>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="submit-btn"
                  >
                    {isSubmitting ? 'Salvando...' : 'Salvar'}
                  </button>
                </div>
              </form>

              {statusMessage && (
                <div className={`status-message ${statusMessage.type}`}>
                  {statusMessage.message}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


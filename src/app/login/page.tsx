'use client'

import './styles.css'
import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

export default function Login() {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login')
  const [loginData, setLoginData] = useState({ login: '', password: '' })
  const [registerData, setRegisterData] = useState({ 
    login: '', 
    email: '', 
    password: '', 
    role: 'viajante' as 'viajante' | 'cronauta'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { login, register, user } = useAuth()
  const router = useRouter()

  //Redireciona se já estiver logado
  useEffect(() => {
    if (user) {
      router.push('/')
    }
  }, [user, router])
//ABAS LOGIN
  const handleTabChange = (tab: 'login' | 'register') => {
    setActiveTab(tab)
    setError('')
  }

  //fazer login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result = await login(loginData.login, loginData.password)
    
    if (result.success) {
      router.push('/')
    } else {
      setError(result.error || 'Erro ao fazer login')
    }
    
    setLoading(false)
  }

  // Função para registrar
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result = await register(
      registerData.email, 
      registerData.login, 
      registerData.password,
      registerData.role
    )
    
    if (result.success) {
      router.push('/')
    } else {
      setError(result.error || 'Erro ao criar conta')
    }
    
    setLoading(false)
  }

  return (
    <section id="login" className="login-section">
      <div className="login-container">
        <div className="login-header">
          <h2 className="login-title">Portal Temporal</h2>
          <p className="login-subtitle">Acesse sua conta de Cronauta ou registre-se para começar</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="auth-tabs">
          <button 
            id="login-tab" 
            className={`tab-button ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => handleTabChange('login')}
          >
            Entrar
          </button>
          <button 
            id="cadastro-tab" 
            className={`tab-button ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => handleTabChange('register')}
          >
            Cadastrar
          </button>
          <div className="tab-indicator" style={{ 
            transform: activeTab === 'login' ? 'translateX(0)' : 'translateX(100%)' 
          }}></div>
        </div>

        <div className="auth-forms">
          {/* Formulário de Login */}
          <form 
            onSubmit={handleLogin}
            className={`auth-form ${activeTab === 'login' ? 'active' : ''}`} 
            id="login-form"
          >
            <div className="form-group">
              <label className="form-label">Nome Cósmico</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Insira seu nome cósmico"
                value={loginData.login}
                onChange={(e) => setLoginData(prev => ({
                  ...prev,
                  login: e.target.value
                }))}
                required
              />
              <div className="input-glow"></div>
            </div>

            <div className="form-group">
              <label className="form-label">Senha</label>
              <input 
                type="password" 
                className="form-input" 
                placeholder="••••••••"
                value={loginData.password}
                onChange={(e) => setLoginData(prev => ({
                  ...prev,
                  password: e.target.value
                }))}
                required
              />
              <div className="input-glow"></div>
            </div>

            <button type="submit" className="auth-button" disabled={loading}>
              <span>{loading ? 'Acessando...' : 'Acessar Portal'}</span>
              <div className="button-particles"></div>
            </button>
          </form>

          {/* Formulário de Cadastro */}
          <form 
            onSubmit={handleRegister}
            className={`auth-form ${activeTab === 'register' ? 'active' : ''}`} 
            id="register-form"
          >
            <div className="form-group">
              <label className="form-label">Nome Cósmico</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Seu nome no espaço-tempo"
                value={registerData.login}
                onChange={(e) => setRegisterData(prev => ({
                  ...prev,
                  login: e.target.value
                }))}
                required
              />
              <div className="input-glow"></div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Quântico</label>
              <input 
                type="email" 
                className="form-input" 
                placeholder="seu.email@cosmos.net"
                value={registerData.email}
                onChange={(e) => setRegisterData(prev => ({
                  ...prev,
                  email: e.target.value
                }))}
                required
              />
              <div className="input-glow"></div>
            </div>

            <div className="form-group">
              <label className="form-label">Senha</label>
              <input 
                type="password" 
                className="form-input" 
                placeholder="••••••••"
                value={registerData.password}
                onChange={(e) => setRegisterData(prev => ({
                  ...prev,
                  password: e.target.value
                }))}
                required
              />
              <div className="input-glow"></div>
            </div>

            <button type="submit" className="auth-button" disabled={loading}>
              <span>{loading ? 'Registrando...' : 'Registrar'}</span>
              <div className="button-particles"></div>
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
'use client'

import Link from "next/link";
import './styles.css'
import Image from 'next/image'
import { useAuth } from '@/contexts/AuthContext'
import { useState, useRef, useEffect } from 'react'

export function Header(){
  const { user, logout, isCronauta } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header>
      <nav className="floatingNav">
        <div className="navLogo">
          <Image src='/universe.png' className="logoIcon" width={30} height={30} alt='universo'/>
          <span className="logoText">CroNews</span>
        </div>
        
        <div className="navLinks">
          <Link href='/' className="navLink">
            Home
          </Link>
          <Link href='/viajar' className="navLink">
            Viajar
          </Link>
          <Link href='/sobre' className="navLink">
            Sobre
          </Link>
          
          {user ? (
            <div className="userContainer" ref={menuRef}>
              <button 
                className="userButton"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Menu do usuário"
              >
                <div className="userAvatar">
                  {user.login.charAt(0).toUpperCase()}
                </div>
                <span className="userName">{user.login}</span>
                {isCronauta() && <span className="cronautaBadge">Cronauta</span>}
                <svg 
                  className={`dropdownArrow ${isMenuOpen ? 'open' : ''}`} 
                  width="12" 
                  height="8" 
                  viewBox="0 0 12 8" 
                  fill="none"
                >
                  <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
              
              {isMenuOpen && (
                <div className="dropdownMenu">
                  <div className="userInfo">
                    <div className="userDetails">
                      <span className="userGreeting">Olá, {user.login}!</span>
                      <span className="userRole">
                        {isCronauta() ? '👁‍🗨 Cronauta' : '💫 Viajante'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="dropdownDivider"></div>
                  
                  <Link href="/viajar" className="dropdownItem" onClick={() => setIsMenuOpen(false)}>
                    <span>⏰</span>Viajar no Tempo
                  </Link>
                  
                  {isCronauta() && (
                    <Link href="/cadastrarEvento" className="dropdownItem" onClick={() => setIsMenuOpen(false)}>
                      <span>🎇</span>Noticiar um Evento
                    </Link>
                  )}
                  
                  <div className="dropdownDivider"></div>
                  
                  <button 
                    onClick={() => {
                      logout()
                      setIsMenuOpen(false)
                    }} 
                    className="dropdownItem logoutButton"
                  >
                    <span>🚪</span>
                    Sair
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href='/login' className="navLink loginLink">
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  )
}
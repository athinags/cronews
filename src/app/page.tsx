import { Metadata } from "next"
import Link from "next/link";
import './styles.css'
import Image from 'next/image'

export const metadata: Metadata= {
  title: 'Cronews - Viaje pelo tempo!',
  description: 'Descubra notícias de diversas épocas da história do universo',
  openGraph:{
    title: 'Viagem no tempo!',
    description: 'Descubra notícias de diversas épocas da história do universo',
    images: ['https://www2.ifsc.usp.br/portal-ifsc/site-antigo/images/stories/image3.jpg']
  },
  robots:{
    index:true,
    follow: true,
    nocache: true
  }
}

export default function Home(){
  return(
    <section className="hero-section">
      <div className="cosmic-background"></div>
        <div className="hero-content">
            <div className="hero-text">
                <h1 className="hero-title">
                    <span className="title-main" id="welcome">Bem-vindo,</span>
                    <span className="title-sub" id="timeexplorer">Explorador do Tempo</span>
                </h1>
                <p className="hero-subtitle">
                    Navegue através das eras do universo e descubra os eventos que moldaram a história cósmica
                </p>
                <Link href='/viajar' className="cta-button">
                    <span>Iniciar Jornada</span>
                </Link>
            </div>
            <div className="hero-image">
                <div className="image-container">
                    <Image src='/cronautaRecap.png' className="cronauta-main" width={300} height={300} alt=''/>
                    <div className="cosmic-ring"></div>
                    <div className="particle particle-1"></div>
                    <div className="particle particle-2"></div>
                    <div className="particle particle-3"></div>
                </div>
            </div>
        </div>
    </section>
  )
}
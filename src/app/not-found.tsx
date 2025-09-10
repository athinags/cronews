import Link from "next/link";
import './styles.css'
import Image from 'next/image'

export default function NotFound(){
    return(
        <section className="hero-section">
      <div className="cosmic-background"></div>
        <div className="hero-content">
            <div className="hero-text">
                <h1 className="hero-title">
                    <span className="title-main">Página não encontrada...</span>
                </h1>
                <Link href='/' className="cta-button">
                    <span>Voltar ao Home</span>
                </Link>
            </div>
            <div className="hero-image">
                <div className="image-container">
                    <Image src='/ficcao-cientifica.png' width={400} height={400} alt='voce esta perdido'/>
                </div>
            </div>
        </div>
    </section>
    )
}
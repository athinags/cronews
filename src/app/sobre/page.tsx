import "./styles.css";
import Image from 'next/image'

export default function Sobre(){
    return(
        <section id="about" className="about-section">
        <div className="cosmic-grid"></div>
        <div className="about-content">
            <div className="about-text">
                <h2 className="about-title">Cronautas</h2>
                <div className="about-description">
                    <p>Somos uma civilização avançada de fotógrafos cósmicos, exploradores do espaço-tempo que documentam os eventos mais significativos do universo através das eras.</p>
                    
                    <p>Utilizando nossa tecnologia de viagem temporal, capturamos momentos históricos únicos - desde a formação das primeiras estrelas até civilizações perdidas em galáxias distantes.</p>
                    
                    <p>O CroNews é nossa plataforma de compartilhamento de acontecimentos extraordinários, permitindo que outras espécies conscientes explorem a rica tapeçaria da história universal.</p>
                </div>
                <div className="stats-grid">
                    <div className="stat-item">
                        <span className="stat-number">∞</span>
                        <span className="stat-label">Eras Exploradas</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">10K+</span>
                        <span className="stat-label">Eventos Documentados</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">42</span>
                        <span className="stat-label">Galáxias Visitadas</span>
                    </div>
                </div>
            </div>
            <div className="about-visual">
                <div className="image-container">
                    
                    <div className="cosmic-camera"></div>
                    <div className="camera-lens"></div>
                    <Image src="/cronautaRecap.png" alt="Cronauta" className="cronauta-main" width={400} height={400}/>
                    <div className="lens-reflection"></div>
                    
                    <div className="time-waves"></div>
                </div>
            </div>
        </div>
    </section>
    )
}
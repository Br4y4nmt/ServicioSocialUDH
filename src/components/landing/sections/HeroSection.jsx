import React from 'react';
import { Link } from 'react-router-dom';
import ArrowRightIcon from '../../../hooks/componentes/Icons/ArrowRightIcon';
import CheckCircleIcon from '../../../hooks/componentes/Icons/CheckCircleIcon';
import AnimatedSection from '../AnimatedSection';

function HeroSection() {
  return (
    <AnimatedSection>
      <section
        className="landing-hero"
        id="inicio-principal"
        style={{
          position: 'relative',
          width: '100vw',
          marginLeft: 'calc(50% - 50vw)',
          minHeight: '100vh',
          marginTop: '0px',
          overflow: 'hidden',
        }}
      >
        {/* ✅ Imagen como <img> real — así se escala igual que en el ejemplo */}
        <img
          src="/images/23.png"
          alt=""
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',       /* igual que background-size: cover */
            objectPosition: 'center', /* puedes cambiar a 'right center' si la acción está a la derecha */
            zIndex: 0,
          }}
        />

        {/* ✅ Overlay degradado: oscuro a la izquierda (texto), transparente a la derecha (imagen) */}
		<div
		style={{
			position: 'absolute',
			inset: 0,
			background: 'linear-gradient(to top, rgba(46, 85, 75, 0.75) 0%, rgba(56, 178, 157, 0.10) 70%)',
			zIndex: 1,
		}}
		/>

        {/* ✅ Contenido encima del overlay */}
        <div className="landing-hero-grid" style={{ position: 'relative', zIndex: 2, paddingLeft: '6rem' }}>
          <div className="landing-hero-copy">
            <div className="landing-hero-badge">Universidad de Huanuco</div>

            <h1
              className="landing-hero-title"
              style={{
                color: '#ffffff',
                fontSize: '65px',
                textShadow: 'rgba(0, 0, 0, 0.45) 0px 2px 8px',
              }}
            >
              Servicio Social
              <br />
              Universitario
            </h1>

            <p className="landing-hero-description" style={{ color: '#fff', textShadow: 'rgba(0, 0, 0, 0.45) 0px 2px 8px' }}>
              Infórmate, participa y accede al Servicio Social Universitario de la
              Universidad de Huánuco desde un espacio claro y orientado a estudiantes,
              supervisores y comunidad universitaria
            </p>

            <div className="landing-hero-actions">
              <Link
                to="/login"
                className="landing-login-button"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>Ingresar a la plataforma</span>
                <ArrowRightIcon />
              </Link>

              <a href="#programa" className="landing-hero-secondary-btn">
                Conocer el programa
              </a>
            </div>

            <div className="landing-hero-stats">
              <div>
                <div className="landing-hero-stat-number">500+</div>
                <div className="landing-hero-stat-label">Estudiantes participantes</div>
              </div>
              <div>
                <div className="landing-hero-stat-number">150+</div>
                <div className="landing-hero-stat-label">Proyectos activos</div>
              </div>
              <div>
                <div className="landing-hero-stat-number">100%</div>
                <div className="landing-hero-stat-label">Certificación digital</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </AnimatedSection>
  );
}

export default HeroSection;
import React from 'react';
import { Link } from 'react-router-dom';
import ArrowRightIcon from '../../../hooks/componentes/Icons/ArrowRightIcon';
import ArrowLeftIcon from '../../../hooks/componentes/Icons/ArrowLeftIcon';
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
        <img
          src="/images/61.png"
          alt=""
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',       
            objectPosition: 'center',
            zIndex: 0,
          }}
        />

        <div
            style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(15, 47, 84, 0.30)',
                zIndex: 1,
            }}
        />

        <div className="landing-hero-grid" style={{ position: 'relative', zIndex: 2, paddingLeft: '6rem' }}>
          <div className="landing-hero-copy">
            <div className="landing-hero-badge">Universidad de Huánuco</div>

            <h1
              className="landing-hero-title"
              style={{
                color: '#ffffff',
                fontSize: '75px',
                textShadow: '0 1px 8px rgba(0, 0, 0, 0.7), 0 2px 16px rgba(0, 0, 0, 0.4)',
              }}
            >
              Servicio Social
              <br />
              Universitario
            </h1>

            <p className="landing-hero-description" style={{ color: 'rgba(255, 255, 255, 0.78)', textShadow: '0 1px 8px rgba(0, 0, 0, 0.7), 0 2px 16px rgba(0, 0, 0, 0.4)' }}>
              Infórmate, participa y accede al Servicio Social Universitario de la
              Universidad de Huánuco desde un espacio claro y orientado a estudiantes,
              supervisores y comunidad universitaria
            </p>

            <div className="landing-hero-actions">
              <a href="#programa" className="landing-button">
                Conocer el programa
                <span style={{ marginLeft: '0rem', display: 'inline-flex', alignItems: 'center' }}>
                  <ArrowLeftIcon size={18} color="#ffffff" strokeWidth={2.6} style={{ transform: 'rotate(-90deg)' }} aria-hidden="true" />
                </span>
              </a>
            </div>

          </div>
        </div>
        
      </section>
    </AnimatedSection>
  );
}

export default HeroSection;
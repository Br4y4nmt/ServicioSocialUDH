import React from 'react';
import { Link } from 'react-router-dom';
import ArrowRightIcon from '../../../hooks/componentes/Icons/ArrowRightIcon';
import CheckCircleIcon from '../../../hooks/componentes/Icons/CheckCircleIcon';
import AnimatedSection from '../AnimatedSection';

function HeroSection() {
	return (
		<AnimatedSection>
			<section className="landing-hero" id="inicio-principal">
			<div className="landing-hero-grid">
				<div className="landing-hero-copy">
					<div className="landing-hero-badge">Universidad de Huanuco</div>

					<h1 className="landing-hero-title">
						Servicio Social
						<br />
						Universitario
					</h1>

					<p className="landing-hero-description">
Infórmate, participa y accede al Servicio Social Universitario de la Universidad de Huánuco desde un espacio claro y orientado a estudiantes, supervisores y comunidad universitaria</p>

					<div className="landing-hero-actions">
						<Link to="/login" className="landing-login-button" target="_blank" rel="noopener noreferrer">
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

				<div className="landing-hero-visual">
					<div className="landing-hero-image-shell">
						<img
							src="/images/landin.webp"
							alt="Estudiantes realizando servicio social"
							className="landing-hero-image"
						/>
						<div className="landing-hero-image-overlay" />
						<div className="landing-hero-image-copy" />
					</div>

					<div className="landing-hero-floating-card">
						<div className="landing-hero-floating-icon" aria-hidden="true">
							<CheckCircleIcon />
						</div>
						<div>
							<div className="landing-hero-floating-title">Experiencia Real</div>
							<div className="landing-hero-floating-subtitle">Aprendizaje aplicado fuera del aula</div>
						</div>
					</div>
				</div>
			</div>
			</section>
		</AnimatedSection>
	);
}

export default HeroSection;

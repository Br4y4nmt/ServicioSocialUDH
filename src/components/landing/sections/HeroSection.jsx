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
						Plataforma digital para gestionar, supervisar y validar el servicio social en la
						Universidad de Huanuco.
					</p>

					<div className="landing-hero-actions">
						<Link to="/login" className="landing-login-button" target="_blank" rel="noopener noreferrer">
							<span>Acceder al sistema</span>
							<ArrowRightIcon />
						</Link>

						<a href="#programa" className="landing-hero-secondary-btn">
							Conocer mas
						</a>
					</div>

					<div className="landing-hero-stats">
						<div>
							<div className="landing-hero-stat-number">500+</div>
							<div className="landing-hero-stat-label">Estudiantes activos</div>
						</div>
						<div>
							<div className="landing-hero-stat-number">150+</div>
							<div className="landing-hero-stat-label">Proyectos</div>
						</div>
						<div>
							<div className="landing-hero-stat-number">100%</div>
							<div className="landing-hero-stat-label">Digital</div>
						</div>
					</div>
				</div>

				<div className="landing-hero-visual">
					<div className="landing-hero-image-shell">
						<img
							src="/images/landin.png"
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
							<div className="landing-hero-floating-title">Validacion Digital</div>
							<div className="landing-hero-floating-subtitle">Certificados con QR verificable</div>
						</div>
					</div>
				</div>
			</div>
			</section>
		</AnimatedSection>
	);
}

export default HeroSection;

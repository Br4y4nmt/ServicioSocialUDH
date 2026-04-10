import React from 'react';
import CheckCircleIcon from '../../../hooks/componentes/Icons/CheckCircleIcon';
import AnimatedSection from '../AnimatedSection';

function ProgramSection({ benefitsItems }) {
	return (
		<AnimatedSection>
			<section className="landing-benefits" id="programa">
			<div className="landing-benefits-grid">
				<div className="landing-benefits-visual-wrap">
					<div className="landing-benefits-visual">
						<img
							src="/images/landin1.png"
							alt="Servicio Social UDH"
							className="landing-benefits-image"
						/>
						<div className="landing-benefits-image-overlay" />
					</div>

					<div className="landing-hero-floating-card" style={{ left: 'auto', right: '-1.5rem', bottom: '-1.0rem' }}>
						<div className="landing-hero-floating-icon" aria-hidden="true">
							<CheckCircleIcon />
						</div>
						<div>
							<div className="landing-hero-floating-title">100%</div>
							<div className="landing-hero-floating-subtitle">Digital</div>
						</div>
					</div>
				</div>

				<div className="landing-benefits-copy">
					<div>
						<div className="landing-hero-badge">
							<span>Sobre el Programa</span>
						</div>
						<h2 className="landing-hero-title landing-benefits-title-two-lines" style={{ marginTop: '10px' }}>
							<span className="landing-title-line" style={{ fontSize: '37px' }}>¿Qué es el Servicio Social</span>
							<br />
							<span className="landing-title-line" style={{ fontSize: '37px' }}>Universitario?</span>
						</h2>
						<p className="landing-hero-description" style={{ marginTop: '10px', fontSize: '16px' }}>
							El Servicio Social Universitario es un programa obligatorio que permite a los estudiantes aplicar sus conocimientos académicos en beneficio de la comunidad, fortaleciendo su formación profesional y compromiso social.
						</p>
					</div>

					<div className="landing-benefits-list" style={{ marginTop: ' -15px' }}>
						{benefitsItems.map((item) => (
							<div className="landing-benefit-item" key={item.title}>
								<div className="landing-benefit-icon" aria-hidden="true">
									<CheckCircleIcon />
								</div>
								<div>
									<h3 className=" landing-service-benefit-title" style={{ fontSize: '16px' }}>{item.title}</h3>
									<p className="landing-benefit-description">{item.description}</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
			</section>
		</AnimatedSection>
	);
}

export default ProgramSection;

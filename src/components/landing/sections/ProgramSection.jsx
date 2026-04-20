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
							src="/images/landin1.webp"
							alt="Servicio Social UDH"
							className="landing-benefits-image"
						/>
						<div className="landing-benefits-image-overlay" />
					</div>

					<div className="landing-hero-floating-card" style={{ left: 'auto', right: '-1.5rem', bottom: '-1.0rem' }}>
						<div className="landing-hero-floating-icon" aria-hidden="true">
							<CheckCircleIcon />
						</div>
						<div>Programa Oficial</div>
					</div>
				</div>

				<div className="landing-benefits-copy">
					<div>
						<div className="landing-hero-badge">
							<span>Sobre el programa</span>
						</div>
						<h2 className="landing-hero-title landing-benefits-title-two-lines" style={{ marginTop: '10px' }}>
							<span className="landing-hero-title" style={{ fontSize: '37px' }}>¿Qué es el servicio social</span>
							<br />
							<span className="landing-hero-title" style={{ fontSize: '37px' }}>universitario?</span>
						</h2>
						<p className="landing-hero-description" style={{ marginTop: '10px', fontSize: '16px' }}>
						El Servicio Social Universitario es un programa formativo y obligatorio que permite a los estudiantes aplicar sus conocimientos académicos en beneficio de la comunidad, fortaleciendo valores de responsabilidad social, compromiso ciudadano y experiencia profesional.						</p>
					</div>

					<div className="landing-benefits-list" style={{ marginTop: ' -15px' }}>
						{benefitsItems.map((item) => (
							<div className="landing-benefit-item" key={item.title}>
								<div className="landing-benefit-icon" aria-hidden="true">
									<CheckCircleIcon />
								</div>
								<div>
									<h3 className=" landing-service-benefit-title" style={{ fontSize: '16px' }}>{item.title}</h3>
									{Array.isArray(item.description) ? (
										<ul className="landing-benefit-description-list" style={{ margin: 0, paddingLeft: '1.2em', fontSize: '14px' }}>
											{item.description.map((line, i) => (
												<li key={i}>{line}</li>
											))}
										</ul>
									) : (
										<p className="landing-benefit-description">{item.description}</p>
									)}
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

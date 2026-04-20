import React from 'react';
import AnimatedSection from '../AnimatedSection';

function IndicatorsSection({ indicators }) {
	return (
		<AnimatedSection>
			<section className="landing-indicators" id="indicadores" style={{ backgroundImage: "url('/images/estadistica.webp')" }}>
			<div className="landing-indicators-overlay" aria-hidden="true" />
			<div className="landing-indicators-container">
				<div className="landing-indicators-content">
					<div className="landing-indicators-heading">
						<h2 className="landing-hero-title" style={{ color: '#FFFFFF', fontSize: '45px', textShadow: '0 2px 8px rgba(0, 0, 0, 0.45)' }}>
							Estadisticas
						</h2>
						<p className="landing-hero-description-a" style={{ color: 'rgba(255, 255, 255, 0.85)', marginTop: '12px', textShadow: '0 2px 8px rgba(0, 0, 0, 0.45)', fontSize: '16px' }}>
							Explora las fascinantes estadisticas de nuestra plataforma educativa y descubre como
							estamos transformando el aprendizaje. Aqui te presentamos un panorama completo de
							nuestro impacto.
						</p>
					</div>

					<div className="landing-indicators-grid">
						{indicators.map((item) => (
							<div className="landing-indicator-item" style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.45)' }} key={item.label}>
								<div className="landing-indicator-value" style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.45)' }}>{item.value}</div>
								<div className="landing-indicator-label" style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.45)' }}>{item.label}</div>
							</div>
						))}
					</div>
				</div>
			</div>
			</section>
		</AnimatedSection>
	);
}

export default IndicatorsSection;

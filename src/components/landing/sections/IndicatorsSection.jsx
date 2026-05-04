import React, { useState, useEffect } from 'react';
import AnimatedSection from '../AnimatedSection';

function IndicatorCounter({ value, duration = 1500 }) {
	const [displayValue, setDisplayValue] = useState(0);

	useEffect(() => {
		const numValue = parseInt(value) || 0;
		let startTime;
		let animationFrameId;

		const animate = (currentTime) => {
			if (!startTime) startTime = currentTime;
			const elapsed = currentTime - startTime;
			const progress = Math.min(elapsed / duration, 1);
			
			const currentValue = Math.floor(numValue * progress);
			setDisplayValue(currentValue);

			if (progress < 1) {
				animationFrameId = requestAnimationFrame(animate);
			} else {
				setDisplayValue(numValue);
			}
		};

		animationFrameId = requestAnimationFrame(animate);

		return () => {
			if (animationFrameId) {
				cancelAnimationFrame(animationFrameId);
			}
		};
	}, [value, duration]);

	return displayValue;
}

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
						<p className="landing-hero-description-a" style={{ color: 'rgba(255, 255, 255, 0.85)', marginTop: '12px', textShadow: '0 1px 8px rgba(0, 0, 0, 0.7), 0 2px 16px rgba(0, 0, 0, 0.4)', fontSize: '16px' }}>
							Explora las fascinantes estadisticas de nuestra plataforma educativa y descubre como
							estamos transformando el aprendizaje. Aqui te presentamos un panorama completo de
							nuestro impacto.
						</p>
					</div>

					<div className="landing-indicators-grid">
						{indicators.map((item) => (
							<div className="landing-indicator-item" style={{ textShadow: '0 1px 8px rgba(0, 0, 0, 0.7), 0 2px 16px rgba(0, 0, 0, 0.4)' }} key={item.label}>
								<div className="landing-indicator-value" style={{ textShadow: '0 1px 8px rgba(0, 0, 0, 0.7), 0 2px 16px rgba(0, 0, 0, 0.4)' }}>
									<IndicatorCounter value={item.value} duration={1500} />
								</div>
								<div className="landing-indicator-label" style={{ textShadow: '0 1px 8px rgba(0, 0, 0, 0.7), 0 2px 16px rgba(0, 0, 0, 0.4)' }}>{item.label}</div>
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

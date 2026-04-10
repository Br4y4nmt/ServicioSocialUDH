import React from 'react';
import AnimatedSection from '../AnimatedSection';

function ActionLinesSection({ actionLineItems, renderActionLineIcon }) {
	return (
		<AnimatedSection>
			<section className="landing-benefits " id="lineas-accion">
			<div className="landing-service-benefits-container">
				<div className="landing-service-benefits-heading">
					<h2 className="landing-hero-title" style={{ fontSize: '37px' }}>Lineas de accion</h2>
					<p className="landing-hero-description-a" style={{ marginTop: '12px', fontSize: '16px' }}>
						El Servicio Social Universitario articula sus intervenciones a través de diversas líneas de acción que responden a necesidades formativas, sociales y comunitarias.
					</p>
				</div>

				<div className="landing-service-benefits-grid">
					{actionLineItems.map((item) => (
						<article className="landing-service-benefit-card" key={item.title}>
							<div className="landing-service-benefit-content">
								<div className="landing-service-benefit-icon" aria-hidden="true">
									{renderActionLineIcon(item.icon)}
								</div>
								<div>
									<h3 className="landing-service-benefit-title">{item.title}</h3>
									<p className="landing-hero-description-a" style={{ marginTop: '10px', fontSize: '0.98rem' }}>{item.description}</p>
								</div>
							</div>
						</article>
					))}
				</div>
			</div>
			</section>
		</AnimatedSection>
	);
}

export default ActionLinesSection;

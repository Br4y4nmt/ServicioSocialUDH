import React from 'react';
import AnimatedSection from '../AnimatedSection';

function ServiceBenefitsSection({ serviceBenefitsItems, renderServiceBenefitsIcon }) {
	return (
		<AnimatedSection>
			<section className="landing-benefits" id="beneficios" style={{ padding: '6rem 0 7rem' }}>
			<div className="landing-service-benefits-container">
				<div className="landing-service-benefits-heading">
					<h2 className="landing-hero-title" style={{ fontSize: '37px' }}>Beneficios del Servicio</h2>
					<p className="landing-hero-description-a" style={{ fontSize: '16px' }}>
						El Servicio Social Universitario genera beneficios para distintos actores de la comunidad universitaria y del entorno social, consolidando una experiencia formativa, participativa y de impacto.
					</p>
				</div>

				<div className="landing-service-benefits-grid">
					{serviceBenefitsItems.map((item) => (
						<article className="landing-service-benefit-card" key={item.title}>
							<div className="landing-service-benefit-content">
								<div className="landing-service-benefit-icon" aria-hidden="true">
									{renderServiceBenefitsIcon(item.icon)}
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

export default ServiceBenefitsSection;

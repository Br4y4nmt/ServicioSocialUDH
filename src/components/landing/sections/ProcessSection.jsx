import React from 'react';
import AnimatedSection from '../AnimatedSection';

function ProcessSection({ processSteps }) {
	return (
		<AnimatedSection>
			<section className="landing-importance" id="proceso">
			<div className="landing-process-flow-container">
				<div className="landing-process-flow-heading">
					<h2 className="landing-hero-title" style={{ fontSize: '37px' }}>¿Como funciona?</h2>
					<p className="landing-hero-description-a" style={{ fontSize: '16px', marginTop: '12px' }}>
						Sigue estos pasos para iniciar y completar tu Servicio Social Universitario de manera sencilla.
					</p>
				</div>

				<div className="landing-process-flow-timeline-wrap">
					<div className="landing-process-flow-line" aria-hidden="true" />

					<div className="landing-process-flow-grid">
						{processSteps.map((step) => (
							<article className="landing-process-step" key={step.number}>
								<div className="landing-process-step-inner">
									<div className="landing-process-step-badge">{step.number}</div>
									<h3 className="landing-service-benefit-title" style={{ fontSize: '1rem' }}>{step.title}</h3>
									<p className="landing-hero-description-a" style={{ fontSize: '0.9rem' }}>{step.description}</p>
								</div>
							</article>
						))}
					</div>
				</div>
			</div>
			</section>
		</AnimatedSection>
	);
}

export default ProcessSection;

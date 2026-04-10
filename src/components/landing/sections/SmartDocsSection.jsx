import React from 'react';
import AnimatedSection from '../AnimatedSection';

function SmartDocsSection({ smartDocFeatures, renderSmartDocIcon }) {
	return (
		<AnimatedSection>
			<section className="landing-importance" id="documentos">
			<div className="landing-smart-docs-container">
				<div className="landing-smart-docs-grid ">
					<div className="landing-smart-docs-copy">
						<h2 className="landing-hero-title" style={{ fontSize: '37px', whiteSpace: 'nowrap' }}>Documentos inteligentes</h2>
						<p className="landing-hero-description-a" style={{ marginTop: '14px', fontSize: '16px' }}>
							Genera certificados y documentos oficiales de forma automatica con validacion digital.
						</p>

						<div className="landing-smart-docs-feature-list" style={{ marginTop: '20px' }}>
							{smartDocFeatures.map((feature) => (
								<div className="landing-smart-docs-feature" key={feature.title}>
									<div className="landing-smart-docs-feature-icon" aria-hidden="true">
										{renderSmartDocIcon(feature.icon)}
									</div>
									<div>
										<h4 className="landing-service-benefit-title" style={{ fontSize: '1.1rem' }}>{feature.title}</h4>
										<p className="landing-hero-description-a" style={{ fontSize: '14px' }}>{feature.description}</p>
									</div>
								</div>
							))}
						</div>
					</div>

					<div className="landing-smart-docs-preview-wrap">
						<img
							src="/images/certificado.png"
							alt="Vista previa del certificado de servicio social"
							className="landing-smart-docs-preview-image"
						/>
					</div>
				</div>
			</div>
			</section>
		</AnimatedSection>
	);
}

export default SmartDocsSection;

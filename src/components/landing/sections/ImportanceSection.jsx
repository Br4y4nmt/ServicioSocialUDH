import React from 'react';
import AnimatedSection from '../AnimatedSection';

function ImportanceSection({ importanceItems, renderImportanceIcon }) {
	return (
		<AnimatedSection>
			<section className="landing-importance" id="importancia">
			<div className="landing-importance-container">
				<div className="landing-importance-heading">
					<h2 className="landing-hero-title" style={{ fontSize: '35px' }}>¿Por qué participar en el Servicio Social Universitario?</h2>
					<p className="landing-hero-description-a" style={{ marginTop: '10px', fontSize: '16px' }}>
El Servicio Social Universitario fortalece tu formación académica, genera impacto positivo en la comunidad y promueve una universidad comprometida con la sociedad.					</p>
				</div>

				<div className="landing-importance-grid">
					{importanceItems.map((item) => (
						<article
							className="landing-service-benefit-card"
							key={item.title}
							style={{
							display: 'flex',
							gap: '1.25rem',
							padding: '1.5rem 2rem',
							width: '100%',
							boxSizing: 'border-box',
							
							}}
						>
							<div className="landing-service-benefit-icon" style={{ flexShrink: 0 }}>
								{renderImportanceIcon(item.icon)}
							</div>
							<div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
								<h3 className="landing-service-benefit-title" style={{ margin: 0, fontSize: '1rem' }}>{item.title}</h3>
								<p className="landing-hero-description-a" style={{ marginTop: '6px', fontSize: '14px' }}>{item.description}</p>
							</div>
						</article>
					))}
				</div>

				<div className="landing-importance-cta" style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
					<div style={{ maxWidth: '900px', textAlign: 'center' }}>
						<p style={{ margin: 0,marginTop: '2rem', fontSize: '1.2rem', fontWeight: 700 }}>Sé parte del cambio desde tu formación universitaria</p>
						<p className="landing-hero-description-a" style={{ marginTop: '10px', fontSize: '15px' }}>Únete hoy y comienza a generar impacto con tu trabajo.</p>
					</div>
					<div className="landing-cta-container">
					<a href="/login" className="landing-cta-primary">
						Ingresar a la plataforma
					</a>
					</div>
				</div>
			</div>
			</section>
		</AnimatedSection>
	);
}

export default ImportanceSection;

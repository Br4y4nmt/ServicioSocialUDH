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
						<article className="landing-importance-card" key={item.title}>
							<div className="landing-importance-icon-shell">
								{renderImportanceIcon(item.icon)}
							</div>
							<h3 className="landing-service-benefit-title">{item.title}</h3>
							<p className="landing-hero-description-a" style={{ marginTop: '10px' }}>{item.description}</p>
						</article>
					))}
				</div>

				<div className="landing-importance-cta" style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
					<div style={{ maxWidth: '900px', textAlign: 'center' }}>
						<p style={{ margin: 0,marginTop: '2rem', fontSize: '1.2rem', fontWeight: 700 }}>Sé parte del cambio desde tu formación universitaria</p>
						<p style={{ margin: '0.45rem 0 0', color: '#6b7280' }}>Únete hoy y comienza a generar impacto con tu trabajo.</p>
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

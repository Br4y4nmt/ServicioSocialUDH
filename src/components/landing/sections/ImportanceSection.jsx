import React from 'react';
import AnimatedSection from '../AnimatedSection';

function ImportanceSection({ importanceItems, renderImportanceIcon }) {
	return (
		<AnimatedSection>
			<section className="landing-importance" id="importancia">
			<div className="landing-importance-container">
				<div className="landing-importance-heading">
					<h2 className="landing-hero-title" style={{ fontSize: '37px' }}>¿Por que es importante?</h2>
					<p className="landing-hero-description-a" style={{ marginTop: '10px', fontSize: '16px' }}>
						El Servicio Social Universitario proyecta la formación académica más allá del aula, generando experiencias que aportan valor a la comunidad y fortalecen la responsabilidad social. Además, impulsa una universidad comprometida con su entorno, atendiendo necesidades reales desde diversas áreas del conocimiento.
					</p>
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
			</div>
			</section>
		</AnimatedSection>
	);
}

export default ImportanceSection;

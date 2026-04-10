import React from 'react';
import AnimatedSection from '../AnimatedSection';

function GallerySection({ galleryItems }) {
	return (
		<AnimatedSection>
			<section className="landing-importance" id="galeria">
			<div className="landing-gallery-container">
				<div className="landing-gallery-heading">
					<span className="landing-hero-badge">Galeria</span>

					<h2 className="landing-hero-title" style={{ fontSize: '40px' }}>Estudiantes en accion</h2>
					<p className="landing-hero-description-a" style={{ fontSize: '18px', marginTop: '12px', whiteSpace: 'nowrap' }}>
						Conoce las actividades de servicio social que realizan nuestros estudiantes en la comunidad
					</p>
				</div>

				<div className="landing-gallery-grid">
					{galleryItems.map((item) => (
						<article className="landing-gallery-card" key={`${item.title}-${item.badge}`}>
							<img src={item.image} alt={item.alt} className="landing-gallery-image" />
							<div className="landing-gallery-overlay" />
							<div className="landing-gallery-content">
								<div className="landing-gallery-badge-inline-wrap">
									<span className="landing-gallery-badge-inline">{item.badge}</span>
								</div>
								<h3 className="landing-gallery-card-title">{item.title}</h3>
								<div className="landing-gallery-action-wrap">
									<button type="button" className="landing-gallery-action-btn">
										<span>Ver mas</span>
										<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
											<path d="M9 5l7 7-7 7" />
										</svg>
									</button>
								</div>
							</div>
							<div className="landing-gallery-corner" aria-hidden="true" />
						</article>
					))}
				</div>
			</div>
			</section>
		</AnimatedSection>
	);
}

export default GallerySection;

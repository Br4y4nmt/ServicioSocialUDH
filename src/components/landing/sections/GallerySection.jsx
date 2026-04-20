import React, { useState } from 'react';
import AnimatedSection from '../AnimatedSection';
import GalleryModal from '../../modals/GalleryModal';

function GallerySection({ galleryItems }) {
	const [modalOpen, setModalOpen] = useState(false);
	const [selectedItem, setSelectedItem] = useState(null);

	return (
		<AnimatedSection>
			<section className="landing-importance" id="galeria">
			<div className="landing-gallery-container">
				<div className="landing-gallery-heading">
					<span className="landing-hero-badge">Galeria</span>

					<h2 className="landing-hero-title" style={{ fontSize: '40px' }}>Estudiantes en accion</h2>
					<p className="landing-hero-description-a landing-gallery-description" style={{ fontSize: '16px' }}>
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
									<button
										type="button"
										className="landing-gallery-action-btn"
										onClick={() => {
											setSelectedItem(item);
											setModalOpen(true);
										}}
									>
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

					{/** Modal for viewing gallery item details */}
					<GalleryModal
						open={modalOpen}
						onClose={() => {
							setModalOpen(false);
							setSelectedItem(null);
						}}
						item={selectedItem}
					/>
				</div>
			</div>
			</section>
		</AnimatedSection>
	);
}

export default GallerySection;

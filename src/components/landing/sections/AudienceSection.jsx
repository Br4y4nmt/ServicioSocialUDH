import React from 'react';
import ArrowRightIcon from '../../../hooks/componentes/Icons/ArrowRightIcon';
import AnimatedSection from '../AnimatedSection';

function AudienceSection({ audienceItems, renderAudienceIcon }) {
	return (
		<AnimatedSection>
			<section className="landing-benefits" id="preguntas-frecuentes" style={{ padding: '6rem 0 7rem' }}>
			<div className="landing-audience-bg-shape top" aria-hidden="true" />
			<div className="landing-audience-bg-shape bottom" aria-hidden="true" />

			<div className="landing-audience-container">
				<div className="landing-audience-heading">
					<h2 className="landing-hero-title" style={{ fontSize: '37px' }}>¿Para quien es esta plataforma?</h2>
					<p className="landing-hero-description-a" style={{ marginTop: '16px', fontSize: '16px' }}>
						Disenada para toda la comunidad universitaria
					</p>
				</div>

				<div className="landing-audience-grid">
					{audienceItems.map((item) => (
						<article className={`landing-audience-card landing-audience-card-${item.variant}`} key={item.title}>
							<div className="landing-audience-card-shell">
								<div className="landing-audience-face landing-audience-face-front">
									<img src={item.image} alt={item.title} className="landing-audience-image" />
									<div className="landing-audience-overlay" />
									<div className="landing-audience-front-content">
										<div className="landing-audience-front-header">
											<div className="landing-audience-icon" aria-hidden="true">
												{renderAudienceIcon(item.icon)}
											</div>
											<h3 className="landing-audience-card-title">{item.title}</h3>
										</div>
										<p className="landing-audience-front-description">{item.shortDescription}</p>
									</div>
									<div className="landing-audience-arrow" aria-hidden="true">
										<ArrowRightIcon />
									</div>
								</div>

								<div className="landing-audience-face landing-audience-face-back">
									<h3 className="landing-audience-card-title back">{item.title}</h3>
									<p className="landing-audience-card-description">{item.description}</p>

									<ul className="landing-audience-points">
										{item.points.map((point) => (
											<li key={point}>
												<span className="landing-audience-point-dot" aria-hidden="true" />
												<span>{point}</span>
											</li>
										))}
									</ul>

									<button type="button" className="landing-audience-info-btn">
										Mas informacion
										<ArrowRightIcon />
									</button>
								</div>

								<div className="landing-audience-frame" aria-hidden="true" />
							</div>
						</article>
					))}
				</div>

				<div className="landing-hero-description-a" style={{ marginTop: '45px', fontSize: '16px', textAlign: 'center' }}>
					<p>Unete a cientos de usuarios que ya estan utilizando la plataforma</p>
				</div>
			</div>
			</section>
		</AnimatedSection>
	);
}

export default AudienceSection;

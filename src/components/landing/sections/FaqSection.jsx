import React from 'react';
import AnimatedSection from '../AnimatedSection';

function FaqSection({ faqItems, openFaqIndex, setOpenFaqIndex }) {
	return (
		<AnimatedSection>
			<section className="landing-benefits" style={{ padding: '6rem 0 7rem' }}>
			<div className="landing-faq-container">
				<div className="landing-faq-heading">
					<h2 className="landing-hero-title" style={{ fontSize: '38px' }}>Preguntas Frecuentes</h2>
					<p className="landing-hero-description-a" style={{ fontSize: '16px', marginTop: '10px' }}>
						Resuelve tus dudas sobre el servicio social
					</p>
				</div>

				<div className="landing-faq-list">
					{faqItems.map((item, index) => {
						const isOpen = openFaqIndex === index;
						const answerId = `faq-answer-${index}`;

						return (
							<div className={`landing-faq-item ${isOpen ? 'is-open' : ''}`} key={item.question}>
								<button
									type="button"
									className="landing-faq-question-btn"
									onClick={() => setOpenFaqIndex((current) => (current === index ? -1 : index))}
									aria-expanded={isOpen}
									aria-controls={answerId}
								>
									<span className="landing-faq-question-text">{item.question}</span>
									<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={`landing-faq-chevron ${isOpen ? 'is-open' : ''}`}>
										<path d="m6 9 6 6 6-6" />
									</svg>
								</button>

								<div id={answerId} className={`landing-faq-answer ${isOpen ? 'is-open' : ''}`}>
									<p className="landing-faq-answer-text">{item.answer}</p>
								</div>
							</div>
						);
					})}
				</div>
			</div>
			</section>
		</AnimatedSection>
	);
}

export default FaqSection;

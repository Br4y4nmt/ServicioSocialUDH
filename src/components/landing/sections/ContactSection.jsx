import React from 'react';
import PhoneIcon from '../../../hooks/componentes/Icons/PhoneIcon';
import MapPinIcon from '../../../hooks/componentes/Icons/MapPinIcon';
import MailIcon from '../../../hooks/componentes/Icons/MailIcon';
import AnimatedSection from '../AnimatedSection';

function ContactSection() {
	return (
		<AnimatedSection>
			<section className="landing-importance" id="contacto-info">
			<div className="landing-contact-container">
				<div className="landing-contact-grid">
					<div className="landing-contact-copy">
						<div className="landing-contact-heading">
							<h2 className="landing-hero-title" style={{ fontSize: '35px' }}>Contactanos</h2>
							<p className="landing-hero-description-a" style={{ fontSize: '16px', marginTop: '10px' }}>
								¿Tienes dudas o necesitas asistencia? Estamos aqui para ayudarte
							</p>
						</div>

						<div className="landing-contact-info-list">
							<div className="landing-contact-info-item">
								<div className="landing-smart-docs-feature-icon" aria-hidden="true">
									<MailIcon />
								</div>
								<div>
									<div className="landing-service-benefit-title" style={{ fontSize: '1rem' }}>Correo electronico</div>
									<a href="mailto:serviciosocial@udh.edu.pe" className="landing-contact-info-link">
										servicio.social@udh.edu.pe
									</a>
								</div>
							</div>

							<div className="landing-contact-info-item">
								<div className="landing-smart-docs-feature-icon" aria-hidden="true">
									<PhoneIcon />
								</div>
								<div>
									<div className="landing-service-benefit-title" style={{ fontSize: '1rem' }}>Telefono</div>
									<a href="tel:+51062591060" className="landing-contact-info-link">
										+51 952 072 469
									</a>
								</div>
							</div>

							<div className="landing-contact-info-item">
								<div className="landing-smart-docs-feature-icon" aria-hidden="true">
									<MapPinIcon />
								</div>
								<div>
									<div className="landing-service-benefit-title" style={{ fontSize: '1rem' }}>Ciudad Universitaria</div>
									<p className="landing-hero-description-a">
										Carretera Central km 2.6
										<br />
										Huanuco, Peru
									</p>
								</div>
							</div>
						</div>
					</div>

				<div className="landing-contact-form-wrap">
					<p className="landing-hero-description-a" style={{ fontSize: '16px', color: '#0F2F54', fontWeight: 600 }}>
						Si tienes dudas sobre el SSU o sobre el acceso a la plataforma, escríbenos
					</p>
					<form className="landing-contact-form">
							<div className="landing-contact-field-wrap">
								<label className="landing-service-benefit-title" style={{ fontSize: '15px' }} htmlFor="contact-name">Nombre completo</label>
								<input id="contact-name" type="text" placeholder="Tu nombre" className="landing-contact-input" />
							</div>

							<div className="landing-contact-field-wrap">
								<label className="landing-service-benefit-title" style={{ fontSize: '15px' }} htmlFor="contact-email">Correo electronico</label>
								<input id="contact-email" type="email" placeholder="tu@email.com" className="landing-contact-input" />
							</div>

							<div className="landing-contact-field-wrap">
								<label className="landing-service-benefit-title" style={{ fontSize: '15px' }} htmlFor="contact-type">Tipo de usuario</label>
								<select id="contact-type" name="contact-type" className="landing-contact-select" style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #e5e7eb' }}>
									<option value="">Selecciona...</option>
									<option value="estudiante">Estudiante</option>
									<option value="supervisor">Supervisor</option>
									<option value="administrativo">Administrativo</option>
									<option value="otro">Otro</option>
								</select>
							</div>

							<div className="landing-contact-field-wrap">
								<label className="landing-service-benefit-title" style={{ fontSize: '15px' }} htmlFor="contact-message">Mensaje</label>
								<textarea id="contact-message" rows="5" placeholder="Escribe tu mensaje aqui..." className="landing-contact-textarea" />
							</div>

							<button type="submit" className="landing-contact-submit-btn">Enviar mensaje</button>
						</form>
					</div>
				</div>
			</div>
			</section>
		</AnimatedSection>
	);
}

export default ContactSection;

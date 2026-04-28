import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

import PhoneIcon from '../../../hooks/componentes/Icons/PhoneIcon';
import MapPinIcon from '../../../hooks/componentes/Icons/MapPinIcon';
import MailIcon from '../../../hooks/componentes/Icons/MailIcon';
import AnimatedSection from '../AnimatedSection';



export const alertSuccess = (title, text, opts = {}) => {
	return Swal.fire({
		icon: 'success',
		title,
		text,
		showConfirmButton: false,
		timer: 4000,
		timerProgressBar: true,
		...opts
	});
};

export const alertError = (title, text, opts = {}) => {
	return Swal.fire({
		icon: 'error',
		title,
		text,
		showConfirmButton: false,
		timer: 4000,
		timerProgressBar: true,
		...opts
	});
};

function ContactSection() {
	const [formData, setFormData] = useState({
		nombre_completo: '',
		correo_electronico: '',
		tipo_usuario: '',
		mensaje: ''
	});

	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState('');
	const [error, setError] = useState('');

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			setLoading(true);
			setSuccess('');
			setError('');

			const res = await axios.post(
				'/api/contactos/contacto',
				formData
			);

				setSuccess(res.data.message);
				alertSuccess('Mensaje enviado', res.data.message);

			setFormData({
				nombre_completo: '',
				correo_electronico: '',
				tipo_usuario: '',
				mensaje: ''
			});

			} catch (err) {
				setError('No se pudo enviar el mensaje. Intente nuevamente.');
				alertError('Error', 'No se pudo enviar el mensaje. Intente nuevamente.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<AnimatedSection>
			<section className="landing-importance" id="contacto-info">
				<div className="landing-contact-container">
					<div className="landing-contact-grid">

						{/* INFORMACIÓN */}
						<div className="landing-contact-copy">
							<div className="landing-contact-heading">
								<h2
									className="landing-hero-title"
									style={{ fontSize: '35px' }}
								>
									Contáctanos
								</h2>

								<p
									className="landing-hero-description-a"
									style={{
										fontSize: '16px',
										marginTop: '10px'
									}}
								>
									¿Tienes dudas o necesitas asistencia?
									Estamos aquí para ayudarte.
								</p>
							</div>

							<div className="landing-contact-info-list">

								<div className="landing-contact-info-item">
									<div
										className="landing-smart-docs-feature-icon"
										aria-hidden="true"
									>
										<MailIcon />
									</div>

									<div>
										<div
											className="landing-service-benefit-title"
											style={{ fontSize: '1rem' }}
										>
											Correo electrónico
										</div>

										<a
											href="mailto:servicio.social@udh.edu.pe"
											className="landing-contact-info-link"
										>
											servicio.social@udh.edu.pe
										</a>
									</div>
								</div>

								<div className="landing-contact-info-item">
									<div
										className="landing-smart-docs-feature-icon"
										aria-hidden="true"
									>
										<PhoneIcon />
									</div>

									<div>
										<div
											className="landing-service-benefit-title"
											style={{ fontSize: '1rem' }}
										>
											Teléfono
										</div>

										<a
											href="tel:+51952072469"
											className="landing-contact-info-link"
										>
											+51 952 072 469
										</a>
									</div>
								</div>

								<div className="landing-contact-info-item">
									<div
										className="landing-smart-docs-feature-icon"
										aria-hidden="true"
									>
										<MapPinIcon />
									</div>

									<div>
										<div
											className="landing-service-benefit-title"
											style={{ fontSize: '1rem' }}
										>
											Ciudad Universitaria
										</div>

										<p className="landing-hero-description-a">
											Carretera Central km 2.6
											<br />
											Huánuco, Perú
										</p>
									</div>
								</div>

							</div>
						</div>

						{/* FORMULARIO */}
						<div className="landing-contact-form-wrap">

							<p
								className="landing-hero-description-a"
								style={{
									fontSize: '16px',
									color: '#0F2F54',
									fontWeight: 600
								}}
							>
								Si tienes dudas sobre el SSU o el acceso a la plataforma, escríbenos.
							</p>

							<form
								className="landing-contact-form"
								onSubmit={handleSubmit}
							>

								<div className="landing-contact-field-wrap">
									<label
										className="landing-service-benefit-title"
										style={{ fontSize: '15px' }}
										htmlFor="contact-name"
									>
										Nombre completo
									</label>

									<input
										id="contact-name"
										type="text"
										name="nombre_completo"
										value={formData.nombre_completo}
										onChange={handleChange}
										placeholder="Tu nombre"
										className="landing-contact-input"
										required
									/>
								</div>

								<div className="landing-contact-field-wrap">
									<label
										className="landing-service-benefit-title"
										style={{ fontSize: '15px' }}
										htmlFor="contact-email"
									>
										Correo electrónico
									</label>

									<input
										id="contact-email"
										type="email"
										name="correo_electronico"
										value={formData.correo_electronico}
										onChange={handleChange}
										placeholder="tu@email.com"
										className="landing-contact-input"
										required
									/>
								</div>

								<div className="landing-contact-field-wrap">
									<label
										className="landing-service-benefit-title"
										style={{ fontSize: '15px' }}
										htmlFor="contact-type"
									>
										Tipo de usuario
									</label>

									<select
										id="contact-type"
										name="tipo_usuario"
										value={formData.tipo_usuario}
										onChange={handleChange}
										className="landing-contact-select"
										style={{
											width: '100%',
											padding: '0.6rem',
											borderRadius: '6px',
											border: '1px solid #e5e7eb'
										}}
										required
									>
										<option value="">
											Selecciona...
										</option>
										<option value="ESTUDIANTE">
											Estudiante
										</option>
										<option value="SUPERVISOR">
											Supervisor
										</option>
										<option value="ADMINISTRATIVO">
											Administrativo
										</option>
										<option value="OTRO">
											Otro
										</option>
									</select>
								</div>

								<div className="landing-contact-field-wrap">
									<label
										className="landing-service-benefit-title"
										style={{ fontSize: '15px' }}
										htmlFor="contact-message"
									>
										Mensaje
									</label>

									<textarea
										id="contact-message"
										name="mensaje"
										value={formData.mensaje}
										onChange={handleChange}
										rows="5"
										placeholder="Escribe tu mensaje aquí..."
										className="landing-contact-textarea"
										required
									/>
								</div>

								<button
									type="submit"
									className="landing-contact-submit-btn"
									disabled={loading}
								>
									{loading ? 'Enviando...' : 'Enviar mensaje'}
								</button>



							</form>
						</div>

					</div>
				</div>
			</section>
		</AnimatedSection>
	);
}

export default ContactSection;
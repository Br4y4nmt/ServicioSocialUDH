import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';
import ArrowRightIcon from '../../hooks/componentes/Icons/ArrowRightIcon';
import CheckCircleIcon from '../../hooks/componentes/Icons/CheckCircleIcon';
import LoginIcon from '../../hooks/componentes/Icons/LoginIcon';
import MenuIcon from '../../hooks/componentes/Icons/MenuIcon';
import PhoneIcon from '../../hooks/componentes/Icons/PhoneIcon';
import MapPinIcon from '../../hooks/componentes/Icons/MapPinIcon';
import MailIcon from '../../hooks/componentes/Icons/MailIcon';
import FacebookIcon from '../../hooks/componentes/Icons/FacebookIcon';

const navLinks = [
	{ href: '#inicio-principal', label: 'Inicio' },
	{ href: '#programa', label: 'Sobre Programa' },
	{ href: '#beneficios', label: 'Beneficios' },
	{ href: '#proceso', label: 'Proceso' },
	{ href: '#galeria', label: 'Galeria' },
	{ href: '#contacto-info', label: 'Contacto' }
];

const benefitsItems = [
	{
		title: 'Gestion 100% digital',
		description: 'Todos los procesos se realizan en linea sin necesidad de tramites presenciales'
	},
	{
		title: 'Seguimiento en tiempo real',
		description: 'Monitorea el progreso de tus actividades y recibe retroalimentacion inmediata'
	},
	{
		title: 'Certificacion automatica',
		description: 'Obten tu certificado digital al completar todas las actividades requeridas'
	},
	{
		title: 'Soporte institucional',
		description: 'Respaldado oficialmente por la Universidad de Huanuco'
	}
];

const importanceItems = [
	{
		title: 'Impacto Social',
		description: 'Contribuyes directamente al desarrollo de tu comunidad y generas cambios positivos',
		icon: 'heart'
	},
	{
		title: 'Formacion Profesional',
		description: 'Aplicas conocimientos teoricos en contextos reales fortaleciendo competencias',
		icon: 'book'
	},
	{
		title: 'Responsabilidad Ciudadana',
		description: 'Desarrollas conciencia social y compromiso con el bienestar colectivo',
		icon: 'users'
	}
];

const serviceBenefitsItems = [
	{
		title: 'Desarrollo de habilidades',
		description: 'Liderazgo, trabajo en equipo y comunicacion efectiva'
	},
	{
		title: 'Experiencia real',
		description: 'Proyectos autenticos con impacto medible en comunidades'
	},
	{
		title: 'Vinculacion comunitaria',
		description: 'Redes de contacto y conexiones profesionales duraderas'
	},
	{
		title: 'Perfil profesional',
		description: 'Diferenciador en tu CV y desarrollo de competencias clave'
	}
];

const processSteps = [
	{
		number: '01',
		title: 'Registro del estudiante',
		description: 'Inscribete en la plataforma con tus datos academicos'
	},
	{
		number: '02',
		title: 'Seleccion de programa',
		description: 'Elige el area de servicio acorde a tu carrera'
	},
	{
		number: '03',
		title: 'Ejecucion de actividades',
		description: 'Realiza las horas establecidas en tu programa'
	},
	{
		number: '04',
		title: 'Supervision docente',
		description: 'Seguimiento continuo por parte de tu tutor asignado'
	},
	{
		number: '05',
		title: 'Validacion final',
		description: 'Revision y aprobacion de tu servicio completado'
	},
	{
		number: '06',
		title: 'Generacion de documentos',
		description: 'Certificado digital con codigo QR verificable'
	}
];

const actionLineItems = [
	{
		title: 'Medio ambiente',
		description: 'Proyectos de conservacion y sostenibilidad',
		icon: 'leaf'
	},
	{
		title: 'Educacion',
		description: 'Apoyo escolar y alfabetizacion',
		icon: 'book'
	},
	{
		title: 'Comunidad',
		description: 'Desarrollo comunitario y organizacion',
		icon: 'users'
	},
	{
		title: 'Apoyo social',
		description: 'Atencion a grupos vulnerables',
		icon: 'heart'
	}
];

const galleryItems = [
	{
		image: 'https://images.unsplash.com/photo-1758599668429-121d54188b9c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
		alt: 'Servicio Comunitario',
		badge: 'Ayuda Social',
		title: 'Servicio Comunitario'
	},
	{
		image: 'https://images.unsplash.com/photo-1773227060232-e0951cb1b526?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
		alt: 'Apoyo a Adultos Mayores',
		badge: 'Bienestar Social',
		title: 'Apoyo a Adultos Mayores'
	},
	{
		image: 'https://images.unsplash.com/photo-1632932693914-89b90ae3d16d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
		alt: 'Educacion Infantil',
		badge: 'Ensenanza',
		title: 'Educacion Infantil'
	},
	{
		image: 'https://images.unsplash.com/photo-1758582171503-ce7b5c28bb4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
		alt: 'Trabajo en Equipo',
		badge: 'Colaboracion',
		title: 'Trabajo en Equipo'
	},
	{
		image: 'https://images.unsplash.com/photo-1624971035514-2bbbc81ea9fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
		alt: 'Conservacion Ambiental',
		badge: 'Medio Ambiente',
		title: 'Conservacion Ambiental'
	},
	{
		image: 'https://images.unsplash.com/photo-1758599668429-121d54188b9c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
		alt: 'Actividades Grupales',
		badge: 'Integracion',
		title: 'Actividades Grupales'
	}
];

const indicators = [
	{ value: '500+', label: 'Estudiantes registrados' },
	{ value: '150+', label: 'Proyectos activos' },
	{ value: '300+', label: 'Certificados emitidos' }

];

const audienceItems = [
	{
		title: 'Estudiantes',
		shortDescription: 'Cumple tus requisitos de graduacion',
		description: 'Gestiona tu servicio social de manera facil y cumple con tus requisitos de graduacion',
		icon: 'graduation',
		variant: 'accent',
		image: 'https://images.unsplash.com/photo-1758270705657-f28eec1a5694?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
		points: [
			'Registro rapido y sencillo',
			'Seguimiento de horas en tiempo real',
			'Certificado digital automatico'
		]
	},
	{
		title: 'Supervisores',
		shortDescription: 'Supervisa y valida el trabajo',
		description: 'Supervisa y valida el trabajo de tus estudiantes con herramientas eficientes',
		icon: 'teacher',
		variant: 'primary',
		image: 'https://images.unsplash.com/photo-1758270704925-fa59d93119c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
		points: [
			'Dashboard de supervision',
			'Aprobacion digital de actividades',
			'Reportes automatizados'
		]
	},
	{
		title: 'Personal administrativo',
		shortDescription: 'Control total del programa',
		description: 'Administra todo el programa con visibilidad completa y control total',
		icon: 'building',
		variant: 'mixed',
		image: 'https://images.unsplash.com/photo-1758691737644-ef8be18256c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
		points: [
			'Panel de administracion completo',
			'Estadisticas y metricas en vivo',
			'Gestion de documentos masiva'
		]
	}
];

const smartDocFeatures = [
	{
		title: 'Generacion automatica',
		description: 'Documentos listos al instante',
		icon: 'sparkles'
	},
	{
		title: 'Firmas digitales',
		description: 'Autenticidad garantizada',
		icon: 'file'
	},
	{
		title: 'Codigo QR unico',
		description: 'Verificacion instantanea',
		icon: 'qr'
	}
];

const faqItems = [
	'¿Como me registro en el sistema?',
	'¿Cuantas horas debo completar?',
	'¿Como se valida mi servicio?',
	'¿Quien supervisa mi servicio social?',
	'¿Puedo cambiar de programa una vez iniciado?'
];

function ImportanceIcon({ icon }) {
	if (icon === 'heart') {
		return (
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
				<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
			</svg>
		);
	}

	if (icon === 'book') {
		return (
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
				<path d="M12 7v14" />
				<path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
			</svg>
		);
	}

	return (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
			<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
			<circle cx="9" cy="7" r="4" />
			<path d="M22 21v-2a4 4 0 0 0-3-3.87" />
			<path d="M16 3.13a4 4 0 0 1 0 7.75" />
		</svg>
	);
}

function ActionLineIcon({ icon }) {
	if (icon === 'leaf') {
		return (
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
				<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
				<path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
			</svg>
		);
	}

	if (icon === 'book') {
		return (
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
				<path d="M12 7v14" />
				<path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
			</svg>
		);
	}

	if (icon === 'users') {
		return (
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
				<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
				<circle cx="9" cy="7" r="4" />
				<path d="M22 21v-2a4 4 0 0 0-3-3.87" />
				<path d="M16 3.13a4 4 0 0 1 0 7.75" />
			</svg>
		);
	}

	return (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
			<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
		</svg>
	);
}

function AudienceIcon({ icon }) {
	if (icon === 'graduation') {
		return (
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
				<path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" />
				<path d="M22 10v6" />
				<path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" />
			</svg>
		);
	}

	if (icon === 'teacher') {
		return (
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
				<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
				<circle cx="9" cy="7" r="4" />
				<polyline points="16 11 18 13 22 9" />
			</svg>
		);
	}

	return (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
			<rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
			<path d="M9 22v-4h6v4" />
			<path d="M8 6h.01" />
			<path d="M16 6h.01" />
			<path d="M12 6h.01" />
			<path d="M12 10h.01" />
			<path d="M12 14h.01" />
			<path d="M16 10h.01" />
			<path d="M16 14h.01" />
			<path d="M8 10h.01" />
			<path d="M8 14h.01" />
		</svg>
	);
}

function SmartDocIcon({ icon }) {
	if (icon === 'sparkles') {
		return (
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
				<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
				<path d="M14 2v4a2 2 0 0 0 2 2h4" />
				<path d="m9 15 2 2 4-4" />
			</svg>
		);
	}

	if (icon === 'file') {
		return (
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
				<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
			</svg>
		);
	}

	return (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
			<rect width="5" height="5" x="3" y="3" rx="1" />
			<rect width="5" height="5" x="16" y="3" rx="1" />
			<rect width="5" height="5" x="3" y="16" rx="1" />
			<path d="M21 16h-3a2 2 0 0 0-2 2v3" />
			<path d="M21 21v.01" />
			<path d="M12 7v3a2 2 0 0 1-2 2H7" />
			<path d="M3 12h.01" />
			<path d="M12 3h.01" />
			<path d="M12 16v.01" />
			<path d="M16 12h1" />
			<path d="M21 12v.01" />
			<path d="M12 21v-1" />
		</svg>
	);
}

function LandingPage() {
	const [menuOpen, setMenuOpen] = useState(false);

	return (
		<div className="landing-page">
			<header className="landing-header" id="inicio">
				<nav className="landing-header-nav">
					<div className="landing-header-row">
						<img
							src="/images/logoudh.png"
							alt="Servicio Social UDH"
							className="landing-brand-logo"
						/>

						<div className="landing-links-desktop">
							{navLinks.map((link) => (
								<a key={link.href} href={link.href} className="landing-link">
									{link.label}
									<span className="landing-link-line" />
								</a>
							))}
						</div>

						<div className="landing-actions-desktop">
							<Link to="/login" className="landing-login-button" target="_blank" rel="noopener noreferrer">
								<LoginIcon />
								<span>Iniciar sesion</span>
							</Link>
						</div>

						<button
							type="button"
							className="landing-menu-toggle"
							aria-label="Abrir menu"
							aria-expanded={menuOpen}
							onClick={() => setMenuOpen((current) => !current)}
						>
							<MenuIcon />
						</button>
					</div>

					<div className={`landing-mobile-menu ${menuOpen ? 'is-open' : ''}`}>
						{navLinks.map((link) => (
							<a
								key={link.href}
								href={link.href}
								className="landing-mobile-link"
								onClick={() => setMenuOpen(false)}
							>
								{link.label}
							</a>
						))}
						<Link to="/login" className="landing-login-button mobile" onClick={() => setMenuOpen(false)}>
							<span>Iniciar sesion</span>
						</Link>
					</div>
				</nav>
			</header>

			<main className="landing-main">
				<section className="landing-hero" id="inicio-principal">
					<div className="landing-hero-grid">
						<div className="landing-hero-copy">
							<div className="landing-hero-badge">Universidad de Huanuco</div>

							<h1 className="landing-hero-title">
								Servicio Social
								<br />
								Universitario
							</h1>

							<p className="landing-hero-description">
								Plataforma digital para gestionar, supervisar y validar el servicio social en la
								Universidad de Huanuco.
							</p>

							<div className="landing-hero-actions">
								<Link to="/login" className="landing-login-button" target="_blank" rel="noopener noreferrer">
									<span>Acceder al sistema</span>
									<ArrowRightIcon />
								</Link>

								<a href="#programa" className="landing-hero-secondary-btn">
									Conocer mas
								</a>
							</div>

							<div className="landing-hero-stats">
								<div>
									<div className="landing-hero-stat-number">500+</div>
									<div className="landing-hero-stat-label">Estudiantes activos</div>
								</div>
								<div>
									<div className="landing-hero-stat-number">150+</div>
									<div className="landing-hero-stat-label">Proyectos</div>
								</div>
								<div>
									<div className="landing-hero-stat-number">100%</div>
									<div className="landing-hero-stat-label">Digital</div>
								</div>
							</div>
						</div>

						<div className="landing-hero-visual">
							<div className="landing-hero-image-shell">
								<img
									src="/images/landin.png"
									alt="Estudiantes realizando servicio social"
									className="landing-hero-image"
								/>
								<div className="landing-hero-image-overlay" />
								<div className="landing-hero-image-copy">
								</div>
							</div>

							<div className="landing-hero-floating-card">
								<div className="landing-hero-floating-icon" aria-hidden="true">
									<CheckCircleIcon />
								</div>
								<div>
									<div className="landing-hero-floating-title">Validacion Digital</div>
									<div className="landing-hero-floating-subtitle">Certificados con QR verificable</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				<section className="landing-benefits" id="programa">
					<div className="landing-benefits-grid">
						<div className="landing-benefits-visual-wrap">
							<div className="landing-benefits-visual">
								<img
									src="/images/landin1.png"
									alt="Servicio Social UDH"
									className="landing-benefits-image"
								/>
								<div className="landing-benefits-image-overlay" />
							</div>

							<div className="landing-benefits-floating-card">
								<div className="landing-hero-floating-icon" aria-hidden="true">
									<CheckCircleIcon />
								</div>
								<div>
									<div className="landing-hero-floating-title">100%</div>
									<div className="landing-hero-floating-subtitle">Digital</div>
								</div>
							</div>
						</div>

						<div className="landing-benefits-copy">
							<div>
								<div className="landing-hero-badge">
									<span>Sobre el Programa</span>
								</div>
								<h2 className="landing-hero-title landing-benefits-title-two-lines" style={{ marginTop: '10px' }}>
									<span className="landing-title-line" style={{ fontSize: '40px' }}>¿Qué es el Servicio Social</span>
									<br />
									<span className="landing-title-line"style={{ fontSize: '40px' }}>Universitario?</span>
								</h2>
								<p className="landing-hero-description" style={{ marginTop: '10px', fontSize: '16px'}}>
									El Servicio Social Universitario es un programa obligatorio que permite a los estudiantes aplicar sus conocimientos académicos en beneficio de la comunidad, fortaleciendo su formación profesional y compromiso social.
								</p>
							</div>

							<div className="landing-benefits-list"style={{ marginTop: ' -15px' }}>
								{benefitsItems.map((item) => (
									<div className="landing-benefit-item" key={item.title}>
										<div className="landing-benefit-icon" aria-hidden="true">
											<CheckCircleIcon />
										</div>
										<div>
											<h3 className="landing-benefit-title">{item.title}</h3>
											<p className="landing-benefit-description">{item.description}</p>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				</section>

				<section className="landing-importance" id="importancia">
					<div className="landing-importance-container">
						<div className="landing-importance-heading">
							<h2 className="landing-hero-title" style={{ fontSize: '45px' }}>Por que es importante</h2>
							<p className="landing-hero-description" style={{ marginTop: '10px', fontSize: '18px', marginLeft: '280px'}}>
								El servicio social universitario trasciende lo academico
							</p>
						</div>

						<div className="landing-importance-grid">
							{importanceItems.map((item) => (
								<article className="landing-importance-card" key={item.title}>
									<div className="landing-importance-icon-shell">
										<ImportanceIcon icon={item.icon} />
									</div>
									<h3 className="landing-importance-card-title">{item.title}</h3>
									<p className="landing-importance-card-description">{item.description}</p>
								</article>
							))}
						</div>
					</div>
				</section>

				<section className="landing-service-benefits" id="beneficios">
					<div className="landing-service-benefits-container">
						<div className="landing-service-benefits-heading">
							<h2 className="landing-hero-title" style={{ fontSize: '45px' }}>Beneficios del Servicio</h2>
							<p className="landing-hero-description" style={{ fontSize: '18px' }}>Gana experiencia valiosa mientras sirves</p>
						</div>

						<div className="landing-service-benefits-grid">
							{serviceBenefitsItems.map((item) => (
								<article className="landing-service-benefit-card" key={item.title}>
									<div className="landing-service-benefit-icon" aria-hidden="true">
										<CheckCircleIcon />
									</div>
									<h3 className="landing-service-benefit-title">{item.title}</h3>
									<p className="landing-service-benefit-description">{item.description}</p>
								</article>
							))}
						</div>
					</div>
				</section>

				<section className="landing-process-flow" id="proceso">
					<div className="landing-process-flow-container">
						<div className="landing-process-flow-heading">
							<h2 className="landing-hero-title" style={{ fontSize: '45px' }} >Como funciona</h2>
							<p className="landing-hero-description"style={{ fontSize: '18px' }}>Proceso simple en 6 pasos</p>
						</div>

						<div className="landing-process-flow-timeline-wrap">
							<div className="landing-process-flow-line" aria-hidden="true" />

							<div className="landing-process-flow-grid">
								{processSteps.map((step) => (
									<article className="landing-process-step" key={step.number}>
										<div className="landing-process-step-inner">
											<div className="landing-process-step-badge">{step.number}</div>
											<h3 className="landing-process-step-title">{step.title}</h3>
											<p className="landing-process-step-description">{step.description}</p>
										</div>
									</article>
								))}
							</div>
						</div>
					</div>
				</section>

				<section className="landing-action-lines" id="lineas-accion">
					<div className="landing-action-lines-container">
						<div className="landing-action-lines-heading">
							<h2 className="landing-hero-title" style={{ fontSize: '45px' }}>Lineas de accion</h2>
							<p className="landing-hero-description" style={{ fontSize: '18px' }}>Areas donde puedes hacer la diferencia</p>
						</div>

						<div className="landing-action-lines-grid">
							{actionLineItems.map((item) => (
								<article className="landing-action-line-card" key={item.title}>
									<div className="landing-action-line-icon">
										<ActionLineIcon icon={item.icon} />
									</div>
									<h3 className="landing-action-line-title">{item.title}</h3>
									<p className="landing-action-line-description">{item.description}</p>
								</article>
							))}
						</div>
					</div>
				</section>

				<section className="landing-gallery" id="galeria">
					<div className="landing-gallery-container">
						<div className="landing-gallery-heading">

								<span className="landing-hero-badge">Galeria</span>
							
							<h2 className="landing-hero-title" style={{ fontSize: '45px' }}>Estudiantes en accion</h2>
							<p className="landing-hero-description">
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

				<section className="landing-indicators" id="indicadores">
					<div className="landing-indicators-container">
						<div className="landing-indicators-heading">
							<h2 className="landing-hero-title" style={{ fontSize: '45px', color: '#ffffff' }}>Resultados e indicadores</h2>
							<p className="landing-hero-description" style={{ color: '#ffffff' }}>Impacto medible y verificable</p>
						</div>

						<div className="landing-indicators-grid">
							{indicators.map((item) => (
								<div className="landing-indicator-item" key={item.label}>
									<div className="landing-indicator-value">{item.value}</div>
									<div className="landing-indicator-label">{item.label}</div>
								</div>
							))}
						</div>
					</div>
				</section>

				<section className="landing-audience">
					<div className="landing-audience-bg-shape top" aria-hidden="true" />
					<div className="landing-audience-bg-shape bottom" aria-hidden="true" />

					<div className="landing-audience-container">
						<div className="landing-audience-heading">
							<h2 className="landing-hero-title" style={{ fontSize: '45px' }}>¿Para quien es esta plataforma?</h2>
							<p className="landing-hero-description" style={{ marginTop: '14px' }}>Disenada para toda la comunidad universitaria</p>
						</div>

						<div className="landing-audience-grid">
							{audienceItems.map((item, index) => (
								<article className={`landing-audience-card landing-audience-card-${item.variant}`} key={item.title}>
									<div className="landing-audience-card-shell">
										<div className="landing-audience-face landing-audience-face-front">
											<img src={item.image} alt={item.title} className="landing-audience-image" />
											<div className="landing-audience-overlay" />
											<div className="landing-audience-front-content">
												<div className="landing-audience-front-header">
													<div className="landing-audience-icon" aria-hidden="true">
														<AudienceIcon icon={item.icon} />
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
											<div className="landing-audience-back-icon" aria-hidden="true">
												<AudienceIcon icon={item.icon} />
											</div>
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

									<div className="landing-audience-index" aria-hidden="true">{index + 1}</div>
								</article>
							))}
						</div>

						<div className="landing-audience-footnote">
							<p>Unete a cientos de usuarios que ya estan utilizando la plataforma</p>
						</div>
					</div>
				</section>

				<section className="landing-smart-docs" id="documentos">
					<div className="landing-smart-docs-container">
						<div className="landing-smart-docs-grid">
							<div className="landing-smart-docs-copy">
								<h2 className="landing-hero-title" style={{ fontSize: '40px' }}>Documentos inteligentes</h2>
								<p className="landing-hero-description" style={{ marginTop: '10px' }}>
									Genera certificados y documentos oficiales de forma automatica con validacion digital.
								</p>

								<div className="landing-smart-docs-feature-list" style={{ marginTop: '20px' }}>
									{smartDocFeatures.map((feature) => (
										<div className="landing-smart-docs-feature" key={feature.title}>
											<div className="landing-smart-docs-feature-icon" aria-hidden="true">
												<SmartDocIcon icon={feature.icon} />
											</div>
											<div>
												<h4 className="landing-smart-docs-feature-title">{feature.title}</h4>
												<p className="landing-smart-docs-feature-description">{feature.description}</p>
											</div>
										</div>
									))}
								</div>
							</div>

							<div className="landing-smart-docs-preview-wrap">
								<div className="landing-smart-docs-preview-card">
									<div className="landing-smart-docs-preview-head">CERTIFICADO DE SERVICIO SOCIAL</div>
									<div className="landing-smart-docs-preview-body">
										<div className="landing-smart-docs-preview-muted">Se certifica que</div>
										<div className="landing-smart-docs-preview-name">Juan Perez Lopez</div>
										<div className="landing-smart-docs-preview-muted">ha completado</div>
										<div className="landing-smart-docs-preview-hours">240 horas</div>
										<div className="landing-smart-docs-preview-muted small">de Servicio Social Universitario</div>
									</div>

									<div className="landing-smart-docs-preview-qr-wrap">
										<div className="landing-smart-docs-preview-qr">
											<SmartDocIcon icon="qr" />
										</div>
									</div>

									<div className="landing-smart-docs-preview-code">Codigo: SSU-2026-001247</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				<section className="landing-faq">
					<div className="landing-faq-container">
						<div className="landing-faq-heading">
							<h2 className="landing-hero-title" style={{ fontSize: '45px' }}>Preguntas Frecuentes</h2>
							<p className="landing-hero-description" style={{ fontSize: '18px' }}>Resuelve tus dudas sobre el servicio social</p>
						</div>

						<div className="landing-faq-list">
							{faqItems.map((question) => (
								<div className="landing-faq-item" key={question}>
									<button type="button" className="landing-faq-question-btn">
										<span className="landing-faq-question-text">{question}</span>
										<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="landing-faq-chevron">
											<path d="m6 9 6 6 6-6" />
										</svg>
									</button>
								</div>
							))}
						</div>
					</div>
				</section>

				<section className="landing-contact" id="contacto-info">
					<div className="landing-contact-container">
						<div className="landing-contact-grid">
							<div className="landing-contact-copy">
								<div className="landing-contact-heading">
									<h2 className="landing-hero-title" style={{ fontSize: '40px' }}>Contactanos</h2>
									<p className="landing-hero-description"	style={{ fontSize: '18px', marginTop: '10px' }}>
										¿Tienes dudas o necesitas asistencia? Estamos aqui para ayudarte
									</p>
								</div>

								<div className="landing-contact-info-list">
									<div className="landing-contact-info-item">
										<div className="landing-contact-info-icon" aria-hidden="true">
											<MailIcon />
										</div>
										<div>
											<div className="landing-contact-info-label">Correo electronico</div>
											<a href="mailto:serviciosocial@udh.edu.pe" className="landing-contact-info-link">
												serviciosocial@udh.edu.pe
											</a>
										</div>
									</div>

									<div className="landing-contact-info-item">
										<div className="landing-contact-info-icon" aria-hidden="true">
											<PhoneIcon />
										</div>
										<div>
											<div className="landing-contact-info-label">Telefono</div>
											<a href="tel:+51062591060" className="landing-contact-info-link">
												+51 062 591 060
											</a>
										</div>
									</div>

									<div className="landing-contact-info-item">
										<div className="landing-contact-info-icon" aria-hidden="true">
											<MapPinIcon />
										</div>
										<div>
											<div className="landing-contact-info-label">Direccion</div>
											<p className="landing-contact-info-text">
												Jr. Hermilio Valdizan 871
												<br />
												Huanuco, Peru
											</p>
										</div>
									</div>
								</div>
							</div>

							<div className="landing-contact-form-wrap">
								<form className="landing-contact-form">
									<div className="landing-contact-field-wrap">
										<label className="landing-contact-label" htmlFor="contact-name">Nombre completo</label>
										<input id="contact-name" type="text" placeholder="Tu nombre" className="landing-contact-input" />
									</div>

									<div className="landing-contact-field-wrap">
										<label className="landing-contact-label" htmlFor="contact-email">Correo electronico</label>
										<input id="contact-email" type="email" placeholder="tu@email.com" className="landing-contact-input" />
									</div>

									<div className="landing-contact-field-wrap">
										<label className="landing-contact-label" htmlFor="contact-message">Mensaje</label>
										<textarea id="contact-message" rows="5" placeholder="Escribe tu mensaje aqui..." className="landing-contact-textarea" />
									</div>

									<button type="submit" className="landing-contact-submit-btn">Enviar mensaje</button>
								</form>
							</div>
						</div>
					</div>
				</section>
			</main>

			<footer className="landing-footer" id="contacto">
				<div className="landing-footer-container">
					<div className="landing-footer-grid">
						<div className="landing-footer-brand-col">
							<div className="landing-footer-brand-row">
								<img
									src="/images/blanco.png"
									alt="Universidad de Huanuco"
									className="landing-footer-brand-logo"
								/>
							</div>

							<p className="landing-footer-brand-description">
								Plataforma oficial para la gestion digital del servicio social universitario.
							</p>

							<div className="landing-footer-socials">
								<a href="https://www.facebook.com/udh.universidaddehuanuco" className="landing-footer-social-link" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
									<FacebookIcon />
								</a>
							</div>
						</div>

						<div className="landing-footer-links-col">
							<h3 className="landing-footer-col-title">Enlaces Rapidos</h3>
							<ul className="landing-footer-link-list">
								<li><a href="#inicio">Inicio</a></li>
								<li><a href="#beneficios">Beneficios</a></li>
								<li><a href="#proceso">Proceso</a></li>
								<li><a href="#documentos">Documentos</a></li>
								<li><a href="#galeria">Galeria</a></li>
							</ul>
						</div>

						<div className="landing-footer-links-col">
							<h3 className="landing-footer-col-title">Recursos</h3>
							<ul className="landing-footer-link-list">
								<li><a href="#">Guia de Usuario</a></li>
								<li><a href="#">Preguntas Frecuentes</a></li>
								<li><a href="#">Tutoriales</a></li>
								<li><a href="#">Reglamento</a></li>
								<li><a href="#">Soporte Tecnico</a></li>
							</ul>
						</div>

						<div className="landing-footer-contact-col">
							<h3 className="landing-footer-col-title">Contacto</h3>
							<ul className="landing-footer-contact-list">
								<li>
									<MapPinIcon />
									<span>Av. Universitaria 601-607, Huanuco, Peru</span>
								</li>
								<li>
									<PhoneIcon />
									<a href="tel:+51062591060">+51 062 591 060</a>
								</li>
								<li>
									<MailIcon />
									<a href="mailto:serviciosocial@udh.edu.pe">serviciosocial@udh.edu.pe</a>
								</li>
							</ul>
						</div>
					</div>

					<div className="landing-footer-bottom">
						<p>© 2026 Universidad de Huanuco. Todos los derechos reservados.</p>
						<div className="landing-footer-legal-links">
							<a href="#">Terminos y Condiciones</a>
						</div>
					</div>
				</div>
			</footer>
		</div>
	);
}

export default LandingPage;

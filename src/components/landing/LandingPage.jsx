import React, { Suspense, lazy, useState } from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

import MenuIcon from '../../hooks/componentes/Icons/MenuIcon';
import PhoneIcon from '../../hooks/componentes/Icons/PhoneIcon';
import MapPinIcon from '../../hooks/componentes/Icons/MapPinIcon';
import MailIcon from '../../hooks/componentes/Icons/MailIcon';
import FacebookIcon from '../../hooks/componentes/Icons/FacebookIcon';
import InstagramIcon from '../../hooks/componentes/Icons/InstagramIcon';
import TwitterIcon from '../../hooks/componentes/Icons/TwitterIcon';
import UsersIcon from '../../hooks/componentes/Icons/UsersIcon';
import DashboardIcon from "../../hooks/componentes/Icons/DashboardIcon";
import SocialServiceIcon  from "../../hooks/componentes/Icons/SocialServiceIcon";
import SupervisorCheckIcon from '../../hooks/componentes/Icons/SupervisorCheckIcon';
import AcademicManagementIcon from '../../hooks/componentes/Icons/AcademicManagementIcon';
import FacultyIcon from '../../hooks/componentes/Icons/FacultyIcon';
import FinalReportIcon  from "../../hooks/componentes/Icons/FinalReportIcon";
import TrackingCheckIcon from '../../hooks/componentes/Icons/TrackingCheckIcon';
import JusticeIcon from '../../hooks/componentes/Icons/JusticeIcon';
import useInView from './hooks/useInView';
import PageSkeleton from '../loaders/PageSkeleton';

const HeroSection = lazy(() => import('./sections/HeroSection'));
const ProgramSection = lazy(() => import('./sections/ProgramSection'));
const ImportanceSection = lazy(() => import('./sections/ImportanceSection'));
const ServiceBenefitsSection = lazy(() => import('./sections/ServiceBenefitsSection'));
const ProcessSection = lazy(() => import('./sections/ProcessSection'));
const ActionLinesSection = lazy(() => import('./sections/ActionLinesSection'));
const GallerySection = lazy(() => import('./sections/GallerySection'));
const IndicatorsSection = lazy(() => import('./sections/IndicatorsSection'));
const AudienceSection = lazy(() => import('./sections/AudienceSection'));
const SmartDocsSection = lazy(() => import('./sections/SmartDocsSection'));
const FaqSection = lazy(() => import('./sections/FaqSection'));
const ContactSection = lazy(() => import('./sections/ContactSection'));


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
    title: 'Beneficios del programa',
    description: [
      'Formación integral',
      'Impacto social',
      'Experiencia práctica',
      'Responsabilidad ciudadana'
    ]
  },
	{
		title: 'Ventajas de la plataforma digital',
		description: [
			'Gestión en línea',
			'Seguimiento en tiempo real',
			'Certificados digitales',
			'Soporte institucional'
		]
	}

];

const importanceItems = [
	{
		title: 'Impacto Social',
		description: 'Contribuyes al bienestar de tu comunidad mediante acciones que generan cambios reales y sostenibles',
		icon: 'heart'
	},
	{
		title: 'Formacion Profesional',
		description: 'Aplicas tus conocimientos en escenarios reales y desarrollas habilidades clave para tu futuro laboral',
		icon: 'book'
	},
	{
		title: 'Compromiso ciudadano',
		description: 'Fortaleces valores de responsabilidad, empatía y participación activa con la sociedad',
		icon: 'users'
	}
];

const serviceBenefitsItems = [
	{
		title: 'Para estudiantes',
		description: 'Fortalece la formacion integral, promueve la participacion activa y permite aplicar conocimientos en contextos reales.',
		icon: 'users'
	},
	{
		title: 'Para docentes y supervisores',
		description: 'Favorece el acompanamiento de procesos formativos con impacto social y facilita el seguimiento de actividades desarrolladas.',
		icon: 'book'
	},
	{
		title: 'Para la universidad',
		description: 'Refuerza la proyeccion social institucional y visibiliza el compromiso de la Universidad de Huanuco con su comunidad.',
		icon: 'award'
	},
	{
		title: 'Para la comunidad',
		description: 'Contribuye al desarrollo de acciones concretas en educacion, salud, ambiente, inclusion y otras areas de intervencion.',
		icon: 'heart'
	}
];

const processSteps = [
	{
		number: '01',
		title: 'Conoce el servicio social universitario',
		description: 'Infórmate sobre objetivos, requisitos y beneficios del programa'
	},
	{
		number: '02',
		title: 'Ingresa a la plataforma',
		description: 'Accede al portal oficial con tus datos institucionales y completa tu perfil de usuario'
	},
	{
		number: '03',
		title: 'Registra tu participación',
		description: 'Completa tu solicitud y selecciona el área correspondiente a tu interés y perfil académico'
	},
	{
		number: '04',
		title: 'Desarrolla tus actividades',
		description: 'Realiza tu servicio con seguimiento y acompañamiento institucional '
	},
	{
		number: '05',
		title: 'Presenta tus evidencias',
		description: 'Carga tus documentos e informe final para la validación del proceso'
	},
	{
		number: '06',
		title: 'Obtén tu certificación',
		description: 'Recibe tu certificado digital al culminar satisfactoriamente tu servicio social universitario'
	}
];

const actionLineItems = [
	{
		title: 'Educacion y cultura',
		description: 'Promocion del aprendizaje, arte y desarrollo cultural comunitario',
		icon: 'book'
	},
	{
		title: 'Salud y bienestar',
		description: 'Acciones preventivas y de apoyo para mejorar la calidad de vida',
		icon: 'heart'
	},
	{
		title: 'Desarrollo comunitario',
		description: 'Fortalecimiento de organizaciones y proyectos de impacto local',
		icon: 'users'
	},
	{
		title: 'Derechos humanos y equidad',
		description: 'Iniciativas para la inclusion, igualdad y respeto de derechos',
		icon: 'justice'
	},
	{
		title: 'Innovacion y tecnologia',
		description: 'Soluciones tecnologicas para necesidades sociales y educativas',
		icon: 'computer'
	},
	{
		title: 'Medio ambiente y sustentabilidad',
		description: 'Proyectos de conservacion ambiental y uso responsable de recursos',
		icon: 'leaf'
	}
];

const galleryItems = [
	{
		image: '/images/galeria1.webp',
		alt: 'Servicio Comunitario',
		badge: 'Ayuda Social',
		title: 'Servicio Comunitario',
		description: 'Brindamos atención y apoyo en salud y bienestar a comunidades vulnerables, promoviendo la prevención y el cuidado integral.',
		bullets: [
			'Atención y apoyo en salud y bienestar a comunidades vulnerables',
			'Promoción de la prevención y el cuidado integral',
			'Acompañamiento y fortalecimiento comunitario',
			'Participación activa en jornadas de ayuda social'
		],
		stats: [
			{
				label: 'Trabajos sociales activos',
				value: 100
			}
		]
	},
	{
		image: '/images/galeria3.webp',
		alt: 'Apoyo a Adultos Mayores',
		badge: 'Bienestar Social',
		title: 'Apoyo a Adultos Mayores',
		description: 'Acompañamos a adultos mayores mediante actividades recreativas, asistencia básica y fortalecimiento de su bienestar emocional.',
		bullets: [
			'Acompañamiento en actividades recreativas y sociales',
			'Asistencia básica en necesidades cotidianas',
			'Fomento del bienestar emocional y la compañía',
			'Promoción de la inclusión y el respeto generacional'
		],
		stats: [
			{
				label: 'Trabajos sociales activos',
				value: 100
			}
		]
	},
	{
		image: '/images/galeria2.webp',
		alt: 'Educacion Infantil',
		badge: 'Ensenanza',
		title: 'Educacion Infantil',
		description: 'Desarrollamos actividades educativas para niños, reforzando el aprendizaje y promoviendo valores desde temprana edad.',
		bullets: [
			'Refuerzo del aprendizaje en áreas básicas',
			'Promoción de valores y habilidades sociales',
			'Actividades lúdicas y educativas dinámicas',
			'Estimulación del desarrollo cognitivo y creativo'
		],
		stats: [
			{
				label: 'Trabajos sociales activos',
				value: 100
			}
		]
	},
	{
		image: '/images/galeria5.webp',
		alt: 'Trabajo en Equipo',
		badge: 'Colaboracion',
		title: 'Trabajo en Equipo',
		description: 'Fomentamos el trabajo colaborativo entre estudiantes, fortaleciendo habilidades de liderazgo y comunicación.',
		bullets: [
			'Desarrollo de habilidades de liderazgo',
			'Fortalecimiento de la comunicación efectiva',
			'Fomento de la cooperación y el respeto mutuo',
			'Resolución conjunta de problemas y retos'
		],
		stats: [
			{
				label: 'Trabajos sociales activos',
				value: 100
			}
		]
	},
	{
		image: '/images/galeria4.webp',
		alt: 'Conservacion Ambiental',
		badge: 'Medio Ambiente',
		title: 'Conservacion Ambiental',
		description: 'Realizamos campañas de limpieza y concientización ambiental para proteger nuestros recursos naturales.',
		bullets: [
			'Organización de campañas de limpieza comunitaria',
			'Promoción de la conciencia ambiental',
			'Protección de recursos naturales locales',
			'Fomento de prácticas sostenibles y ecológicas'
		],
		stats: [
			{
				label: 'Trabajos sociales activos',
				value: 100
			}
		]
	},
	{
		image: '/images/galeria6.webp',
		alt: 'Actividades Grupales',
		badge: 'Integracion',
		title: 'Actividades Grupales',
		description: 'Organizamos actividades comunitarias que fortalecen la integración social y el sentido de pertenencia.',
		bullets: [
			'Organización de eventos comunitarios',
			'Fomento de la integración social',
			'Fortalecimiento del sentido de pertenencia',
			'Promoción de la participación activa grupal'
		],
		stats: [
			{
				label: 'Trabajos sociales activos',
				value: 100
			}
		]
	}
];
const indicators = [
	{ value: '6', label: 'Lineas de Accion' },
	{ value: '700', label: 'Estudiantes' },
	{ value: '200+', label: 'Proyectos' },
	{ value: '300+', label: 'Certificaciones' },

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
		title: 'Emisión oficial inmediata',
		description: 'Documentos listos al instante',
		icon: 'sparkles'
	},
	{
		title: 'Firmas institucionales digitales',
		description: 'Autenticidad garantizada',
		icon: 'file'
	},
	{
		title: 'Código QR verificable en línea',
		description: 'Verificacion instantanea',
		icon: 'qr'
	}
];

const faqItems = [
	{
		question: '¿Como me registro en el sistema?',
		answer: 'Ingresa con tus credenciales institucionales de la UDH. Si es tu primera vez, el sistema te guiara para completar tu perfil y seleccionar tu programa de servicio social.'
	},
	{
		question: '¿Cuantas horas debo completar?',
		answer: 'La cantidad de horas depende del reglamento de tu facultad y programa academico. Puedes revisarlo en tu panel o consultarlo con tu coordinador.'
	},
	{
		question: '¿Como se valida mi servicio?',
		answer: 'Tu supervisor registra y valida tus actividades en la plataforma. Al cumplir los requisitos y horas, el sistema habilita la validacion final.'
	},
	{
		question: '¿Quien supervisa mi servicio social?',
		answer: 'El seguimiento lo realiza un docente o supervisor asignado por tu programa, quien revisa tus avances y emite observaciones.'
	},
	{
		question: '¿Puedo cambiar de programa una vez iniciado?',
		answer: 'Si, pero requiere una solicitud y aprobacion academica. El cambio se evalua segun tu avance, disponibilidad y lineamientos institucionales.'
	}
];

function ImportanceIcon({ icon }) {
	if (icon === 'heart') {
		return <SocialServiceIcon size={24} color="currentColor" />;
	}

	if (icon === 'book') {
		return <SupervisorCheckIcon size={24} color="currentColor" />;
	}

	return (
		<UsersIcon />
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
		return <FinalReportIcon size={24} color="currentColor" />;
	}

	if (icon === 'users') {
		return <UsersIcon />;
	}

	if (icon === 'computer') {
		return <DashboardIcon size={24} color="currentColor" />;
	}

	if (icon === 'justice') {
		return <JusticeIcon size={24} color="currentColor" />;
	}

	return (
		<SocialServiceIcon size={24} color="currentColor" icon="heart" />
	);
}

function AudienceIcon({ icon }) {
	if (icon === 'graduation') {
		return <AcademicManagementIcon size={24} color="currentColor" />;
	}

	if (icon === 'teacher') {
		return <SupervisorCheckIcon size={24} color="currentColor" />;
	}

	return <FacultyIcon size={24} color="currentColor" />;
}

function SmartDocIcon({ icon }) {
	if (icon === 'sparkles') {
		return <TrackingCheckIcon size={24} color="currentColor" />;
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

function ServiceBenefitsIcon({ icon }) {
	if (icon === 'users') {
		return <UsersIcon />;
	}

	if (icon === 'book') {
		return <SupervisorCheckIcon size={24} color="currentColor" />;
	}

	if (icon === 'award') {
		return <FacultyIcon size={24} color="currentColor" />;
	}

	return (
		<SocialServiceIcon size={24} color="currentColor" icon="heart" />
	);
}

function LandingPage() {
	const [menuOpen, setMenuOpen] = useState(false);
	const [openFaqIndex, setOpenFaqIndex] = useState(-1);
	const preloadOffset = '300px';
	const [programRef, showProgram] = useInView(preloadOffset);
	const [importanceRef, showImportance] = useInView(preloadOffset);
	const [serviceBenefitsRef, showServiceBenefits] = useInView(preloadOffset);
	const [processRef, showProcess] = useInView(preloadOffset);
	const [actionLinesRef, showActionLines] = useInView(preloadOffset);
	const [galleryRef, showGallery] = useInView(preloadOffset);
	const [indicatorsRef, showIndicators] = useInView(preloadOffset);
	const [audienceRef, showAudience] = useInView(preloadOffset);
	const [smartDocsRef, showSmartDocs] = useInView(preloadOffset);
	const [faqRef, showFaq] = useInView(preloadOffset);
	const [contactRef, showContact] = useInView(preloadOffset);
	const lazyFallback = <PageSkeleton />;

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
								
								<span>Ir a la plataforma  </span>
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
					</div>
				</nav>
			</header>

			<main className="landing-main">
				<Suspense fallback={lazyFallback}>
					<HeroSection />
				</Suspense>

				<div ref={programRef} style={{ minHeight: '1px' }}>
					{showProgram ? (
						<Suspense fallback={lazyFallback}>
							<ProgramSection benefitsItems={benefitsItems} />
						</Suspense>
					) : null}
				</div>

				<div ref={importanceRef} style={{ minHeight: '1px' }}>
					{showImportance ? (
						<Suspense fallback={lazyFallback}>
							<ImportanceSection
								importanceItems={importanceItems}
								renderImportanceIcon={(icon) => <ImportanceIcon icon={icon} />}
							/>
						</Suspense>
					) : null}
				</div>

				<div ref={serviceBenefitsRef} style={{ minHeight: '1px' }}>
					{showServiceBenefits ? (
						<Suspense fallback={lazyFallback}>
							<ServiceBenefitsSection
								serviceBenefitsItems={serviceBenefitsItems}
								renderServiceBenefitsIcon={(icon) => <ServiceBenefitsIcon icon={icon} />}
							/>
						</Suspense>
					) : null}
				</div>

				<div ref={processRef} style={{ minHeight: '1px' }}>
					{showProcess ? (
						<Suspense fallback={lazyFallback}>
							<ProcessSection processSteps={processSteps} />
						</Suspense>
					) : null}
				</div>

				<div ref={actionLinesRef} style={{ minHeight: '1px' }}>
					{showActionLines ? (
						<Suspense fallback={lazyFallback}>
							<ActionLinesSection
								actionLineItems={actionLineItems}
								renderActionLineIcon={(icon) => <ActionLineIcon icon={icon} />}
							/>
						</Suspense>
					) : null}
				</div>

				<div ref={galleryRef} style={{ minHeight: '1px' }}>
					{showGallery ? (
						<Suspense fallback={lazyFallback}>
							<GallerySection galleryItems={galleryItems} />
						</Suspense>
					) : null}
				</div>

				<div ref={indicatorsRef} style={{ minHeight: '1px' }}>
					{showIndicators ? (
						<Suspense fallback={lazyFallback}>
							<IndicatorsSection indicators={indicators} />
						</Suspense>
					) : null}
				</div>

				<div ref={audienceRef} style={{ minHeight: '1px' }}>
					{showAudience ? (
						<Suspense fallback={lazyFallback}>
							<AudienceSection
								audienceItems={audienceItems}
								renderAudienceIcon={(icon) => <AudienceIcon icon={icon} />}
							/>
						</Suspense>
					) : null}
				</div>

				<div ref={smartDocsRef} style={{ minHeight: '1px' }}>
					{showSmartDocs ? (
						<Suspense fallback={lazyFallback}>
							<SmartDocsSection
								smartDocFeatures={smartDocFeatures}
								renderSmartDocIcon={(icon) => <SmartDocIcon icon={icon} />}
							/>
						</Suspense>
					) : null}
				</div>

				<div ref={faqRef} style={{ minHeight: '1px' }}>
					{showFaq ? (
						<Suspense fallback={lazyFallback}>
							<FaqSection
								faqItems={faqItems}
								openFaqIndex={openFaqIndex}
								setOpenFaqIndex={setOpenFaqIndex}
							/>
						</Suspense>
					) : null}
				</div>

				<div ref={contactRef} style={{ minHeight: '1px' }}>
					{showContact ? (
						<Suspense fallback={lazyFallback}>
							<ContactSection />
						</Suspense>
					) : null}
				</div>
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
								<a href="https://www.instagram.com/udh.universidaddehuanuco" className="landing-footer-social-link" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
									<InstagramIcon />
								</a>
								<a href="https://x.com/udh_oficial" className="landing-footer-social-link" aria-label="Twitter" target="_blank" rel="noopener noreferrer">
									<TwitterIcon />
								</a>
							</div>
						</div>

						<div className="landing-footer-links-col">
							<h3 className="landing-footer-col-title">Enlaces Rapidos</h3>
							<ul className="landing-footer-link-list">
								<li><a href="#inicio-principal">Inicio</a></li>
								<li><a href="#programa">Sobre Programa</a></li>
								<li><a href="#beneficios">Beneficios</a></li>
								<li><a href="#proceso">Proceso</a></li>
								<li><a href="#galeria">Galeria</a></li>
							</ul>
						</div>

						<div className="landing-footer-links-col">
							<h3 className="landing-footer-col-title">Recursos</h3>
							<ul className="landing-footer-link-list">
								<li><a href="https://serviciosocial.udh.edu.pe/">Guia de Usuario</a></li>
								<li><a href="https://serviciosocial.udh.edu.pe/">Preguntas Frecuentes</a></li>
								<li><a href="https://serviciosocial.udh.edu.pe/">Tutoriales</a></li>
								<li><a href="https://serviciosocial.udh.edu.pe/">Reglamento</a></li>
								<li><a href="https://wa.me/51956224252?text=Hola%20necesito%20soporte%20tecnico%20para%20la%20plataforma%20servicio%20social%20UDH" target="_blank" rel="noopener noreferrer">Soporte Tecnico</a></li>
							</ul>
						</div>

						<div className="landing-footer-contact-col">
							<h3 className="landing-footer-col-title">Contacto</h3>
							<ul className="landing-footer-contact-list">
								<li>
									<MapPinIcon />
									<span>Carretera Central km 2.6, Huanuco, Peru</span>
								</li>
								<li>
									<PhoneIcon />
									<a href="tel:+51952072469">+51 952 072 469 </a>
								</li>
								<li>
									<MailIcon />
									<a href="mailto:serviciosocial@udh.edu.pe">servicio.social@udh.edu.pe</a>
								</li>
							</ul>
						</div>
					</div>

					<div className="landing-footer-bottom">
						<p>
							© 2026 <a href="#inicio-principal" className="landing-footer-home-button">Servicio Social UDH</a>. Todos los derechos reservados.
						</p>
						<div className="landing-footer-legal-links">
							<a href="https://serviciosocial.udh.edu.pe/">Terminos y Condiciones</a>
						</div>
					</div>
				</div>
			</footer>
		</div>
	);
}

export default LandingPage;

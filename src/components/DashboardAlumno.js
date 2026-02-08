import React, { useState, useEffect, useCallback } from 'react';
import SidebarAlumno from './SidebarAlumno';
import ConformidadPlan from './ConformidadPlan';
import Header from './Header';
import axios from 'axios';
import './DashboardAlumno.css';
import DesignacionDocente from './DesignacionDocente';
import './ModalGlobal.css';
import Swal from 'sweetalert2';
import InformeFinal from './InformeFinal'; 
import SeguimientoActividades from './SeguimientoActividades'
import { useWelcomeToast } from '../hooks/alerts/useWelcomeToast';
import Reglamento from './Reglamento';
import PlanTrabajo from './PlanTrabajo';
import { generarPlanServicioSocialPDF } from '../services/planPdfService';
import { useUser } from '../UserContext';
import ProyectoModal from "./modals/ProyectoModal";
import ObservacionEstudianteModal from "./modals/ObservacionEstudianteModal";
import GrupoModalAlumno from "./modals/GrupoModalAlumno";
import EvidenciaModal from "./modals/EvidenciaModal";
import ActividadModalAlumno from "./modals/ActividadModalAlumno";
import {
  mostrarErrorSesionInvalida,
  mostrarErrorArchivoNoSeleccionado,
  mostrarErrorEnviarProyecto,
  mostrarExitoSolicitudRevision,
  mostrarAlertaSolicitudYaEnviada,
  mostrarAlertaErrorEnviarSolicitud,
  mostrarAlertaSolicitudEnviada,
  mostrarErrorSinIdUsuario,
  mostrarAlertaFaltaIntegrantesGrupo,
  mostrarAlertaCompletarPerfilPrimeraVez,
  mostrarExitoSolicitudCartaTermino,
  mostrarErrorSolicitudCartaTermino
} from "../hooks/alerts/alertas";
import { useFormularioPlan } from '../hooks/useFormularioPlan';
import { useGrupoAlumno } from '../hooks/useGrupoAlumno';
import { useActividadesCronograma } from '../hooks/useActividadesCronograma';

function DashboardAlumno() {
  const { user } = useUser();
  // ── Custom Hooks ──
  const {
    introduccion, setIntroduccion, justificacion, setJustificacion,
    objetivoGeneral, setObjetivoGeneral, objetivosEspecificos, setObjetivosEspecificos,
    metodologiaIntervencion, setMetodologiaIntervencion,
    recursosRequeridos, setRecursosRequeridos, resultadosEsperados, setResultadosEsperados,
    nombreEntidad, setNombreEntidad, misionVision, setMisionVision,
    areasIntervencion, setAreasIntervencion, ubicacionPoblacion, setUbicacionPoblacion,
    areaInfluencia, setAreaInfluencia, fechaPresentacion, setFechaPresentacion,
    periodoEstimado, setPeriodoEstimado, nombreInstitucion, setNombreInstitucion,
    nombreResponsable, setNombreResponsable, lineaAccion, setLineaAccion,
    antecedentes, setAntecedentes, conclusionesInforme, setConclusionesInforme,
    recomendacionesInforme, setRecomendacionesInforme, anexosInforme, setAnexosInforme,
    areaInfluenciaInforme, setAreaInfluenciaInforme,
    recursosUtilizadosInforme, setRecursosUtilizadosInforme,
    metodologiaInforme, setMetodologiaInforme,
    objetivoGeneralInforme, setObjetivoGeneralInforme,
    objetivosEspecificosInforme, setObjetivosEspecificosInforme,
    imagenesAnexos, setImagenesAnexos,
  } = useFormularioPlan();

  const {
    correosGrupo, setCorreosGrupo,
    loadingGrupo, mensajeGrupo,
    integrantesGrupoAlumno,
    modalGrupoVisible, setModalGrupoVisible,
    obtenerIntegrantesDelGrupo,
  } = useGrupoAlumno();

  const [datosCargados, setDatosCargados] = useState(false);

  const {
    actividades, setActividades,
    actividadesSeguimiento, setActividadesSeguimiento,
    actividadSeleccionada, setActividadSeleccionada,
    editIndex, setEditIndex,
    nuevaActividad, setNuevaActividad,
    nuevaFecha, setNuevaFecha,
    nuevaFechaFin, setNuevaFechaFin,
    nuevaJustificacion, setNuevaJustificacion,
    nuevosResultados, setNuevosResultados,
    modalActividadVisible, setModalActividadVisible,
    hayObservaciones, todasAprobadas,
    abrirModalActividad,
    handleEvidencia,
    handleVolverASubir: volverASubirEvidencia,
  } = useActividadesCronograma({ datosCargados });

  // ── Estado local restante ──
  const [collapsed, setCollapsed] = useState(() => window.innerWidth <= 768);
  const [pdfDescargado, setPdfDescargado] = useState(false);
  const [nombre, setNombre] = useState('');
  const [programas, setProgramas] = useState([]);
  const [programaSeleccionado, setProgramaSeleccionado] = useState('');
  const [docentes, setDocentes] = useState([]);
  const [labores, setLabores] = useState([]);
  const [docenteSeleccionado, setDocenteSeleccionado] = useState('');
  const [archivoYaEnviado, setArchivoYaEnviado] = useState(false);
  const [solicitudEnviada, setSolicitudEnviada] = useState(false);
  const [laborSeleccionada, setLaborSeleccionada] = useState('');
  const [estadoPlan, setEstadoPlan] = useState('');
  const [cartaAceptacionPdf, setCartaAceptacionPdf] = useState('');
  const [facultades, setFacultades] = useState([]);
  const [planSeleccionado, setPlanSeleccionado] = useState(null);
  const [nombreLaborSocial, setNombreLaborSocial] = useState('');
  const [modalProyectoVisible, setModalProyectoVisible] = useState(false);
  const [proyectoFile, setProyectoFile] = useState(null);
  const [pdfGenerado, setPdfGenerado] = useState(null);
  const [lineas, setLineas] = useState([]);
  const [estadoConformidad, setEstadoConformidad] = useState('');
  const [estadoSolicitudTermino, setEstadoSolicitudTermino] = useState('no_solicitada');
  const [lineaSeleccionada, setLineaSeleccionada] = useState('');
  const [imagenModal, setImagenModal] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [facultadSeleccionada, setFacultadSeleccionada] = useState('');
  const [nombreFacultad, setNombreFacultad] = useState('');
  const [nombrePrograma, setNombrePrograma] = useState('');
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [codigoUniversitario, setCodigoUniversitario] = useState('');
  const [tipoServicio, setTipoServicio] = useState('');
  const [modalObservacionEstudianteVisible, setModalObservacionEstudianteVisible] = useState(false);
  const [observacionSeleccionada, setObservacionSeleccionada] = useState('');
  

  const toastWarning = (mensaje) => {
    Swal.fire({
      toast: true,
      position: "bottom-start",
      icon: "warning",
      title: mensaje,
      showConfirmButton: false,
      timer: 3500,
      timerProgressBar: true,
      background: "#ffffff",
      color: "#1f2937",
      iconColor: "#f59e0b",
    });
  };


const handleFileChange = (e, tipo) => {
  const archivo = e.target.files[0];
  if (archivo) {
    setImagenesAnexos(prevState => ({
      ...prevState,
      [tipo]: archivo
    }));

    if (tipo === 'cartaAceptacion') {
      setCartaAceptacionPdf(archivo); 
    }
  }
};
useWelcomeToast();

const [activeSection, setActiveSection] = useState(() => {
  return localStorage.getItem('activeSectionAlumno') || 'designacion';
});
const [nombreDocente, setNombreDocente] = useState('');
const abrirModalProyecto = () => setModalProyectoVisible(true);
const cerrarModalProyecto = () => {
  setProyectoFile(null);
  setModalProyectoVisible(false);
};
const handleProyectoFileChange = (e) => {
  const file = e.target.files[0];
  if (file && file.type === 'application/pdf') {
    setProyectoFile(file);
  } else {
    alert('Por favor selecciona un archivo PDF válido.');
  }
};
useEffect(() => {
  const nombreUsuario = localStorage.getItem('nombre_usuario') || 'NOMBRE DEL ALUMNO';
  const codigo = localStorage.getItem('codigo_estudiante') || '';
  setNombre(nombreUsuario);
  setNombreCompleto(nombreUsuario);
  setCodigoUniversitario(codigo);
}, []);
useEffect(() => {
  const fetchLineas = async () => {
    try {
      const res = await axios.get('/api/lineas', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setLineas(res.data);
    } catch (error) {
      console.error('Error al obtener líneas de acción:', error);
    }
  };

  if (user?.token) {
    fetchLineas();
  }
}, [user?.token]);

useEffect(() => {
  if (facultades.length > 0 && facultadSeleccionada) {
    const facultad = facultades.find(f => f.id_facultad === parseInt(facultadSeleccionada));
    if (facultad) setNombreFacultad(facultad.nombre_facultad);
  }
}, [facultades, facultadSeleccionada]);

useEffect(() => {
  if (programas.length > 0 && programaSeleccionado) {
    const programa = programas.find(p => p.id_programa === parseInt(programaSeleccionado));
    if (programa) setNombrePrograma(programa.nombre_programa);
  }
}, [programas, programaSeleccionado]);

useEffect(() => {
  localStorage.setItem('activeSectionAlumno', activeSection);
}, [activeSection]);

const handleSolicitarRevision = async () => {
  const usuario_id = user?.id;
  const token = user?.token;

  if (!usuario_id || !token) {
    mostrarErrorSesionInvalida();
    return;
  }

  if (!proyectoFile) {
    mostrarErrorArchivoNoSeleccionado();
    return;
  }

  try {
    await axios.post(
      `/api/cronograma/${usuario_id}`,
      { actividades },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const formData = new FormData();
    formData.append('archivo_plan_social', proyectoFile);
    formData.append('usuario_id', usuario_id);

    await axios.post('/api/trabajo-social/subir-plan-social', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });

    mostrarExitoSolicitudRevision().then(() => {
      setArchivoYaEnviado(true);
      setPdfDescargado(true);
      fetchTrabajoSocial();
    });

    setProyectoFile(null);
    setSolicitudEnviada(true);
    
  } catch (err) {
    console.error('Error al enviar proyecto:', err);
    mostrarErrorEnviarProyecto(err.response?.data?.message);
  }
};


useEffect(() => {
  const fetchFacultades = async () => {
    try {
      const res = await axios.get('/api/facultades', {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setFacultades(res.data);
    } catch (error) {
      console.error('Error al obtener facultades:', error);
    }
  };

  if (user?.token) {
    fetchFacultades();
  }
}, [user?.token]);


  const toggleSidebar = () => {
    setCollapsed(prev => !prev);
  };

useEffect(() => {
  const usuario_id = user?.id;
  const token = user?.token;

const verificarPrimeraVez = async () => {
  try {
    const res = await axios.get(`/api/usuarios/${usuario_id}/primera-vez`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (res.data.primera_vez) {
      const result = await mostrarAlertaCompletarPerfilPrimeraVez();
      if (result.isConfirmed) {
        window.location.href = '/perfil';
      }
    }
  } catch (err) {
    console.error('Error al verificar primera vez:', err);
  }
};

  if (usuario_id && token) {
    verificarPrimeraVez();
  }
}, [user?.id, user?.token]);

useEffect(() => {
  const usuario_id = user?.id;
  const token = user?.token;

  const fetchDatosEstudiante = async () => {
    if (!usuario_id || !token) return;

    try {
      const res = await axios.get(`/api/estudiantes/datos/usuario/${usuario_id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const estudiante = res.data;
      setFacultadSeleccionada(String(estudiante.facultad_id)); 
      setProgramaSeleccionado(String(estudiante.programa_academico_id));
      setNombreFacultad(estudiante.facultad?.nombre_facultad || '');
      setNombrePrograma(estudiante.programa?.nombre_programa || '');
      setNombreCompleto(estudiante.nombre_estudiante);
      setCodigoUniversitario(estudiante.codigo);

      const resProg = await axios.get(`/api/programas/facultad/${estudiante.facultad_id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProgramas(resProg.data);
    } catch (error) {
      console.error('Error al obtener datos del estudiante:', error);
    }
  };

  if (usuario_id && token) {
    fetchDatosEstudiante();
  }
}, [user?.id, user?.token]);


useEffect(() => {
  if (!docenteSeleccionado || docentes.length === 0) return;

  const docente = docentes.find(
    (d) => String(d.id_docente) === String(docenteSeleccionado)
  );

  setNombreDocente(docente?.nombre_docente || '');
}, [docenteSeleccionado, docentes]);


const fetchTrabajoSocial = useCallback(async () => {
  const usuario_id = user?.id;
  const token = user?.token;
  if (!usuario_id || !token) return;

  try {
    const res = await axios.get(`/api/trabajo-social/usuario/${usuario_id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const plan = res.data;

    if (!plan || !plan.id) {
      setPlanSeleccionado(null);
      setDatosCargados(true);
      return;
    }

    setPlanSeleccionado(plan);
    setFacultadSeleccionada(String(plan.facultad_id || ''));
    setProgramaSeleccionado(String(plan.programa_academico_id || ''));
    setDocenteSeleccionado(String(plan.docente_id || ''));
    setLineaSeleccionada(String(plan.linea_accion_id || ''));
    setLaborSeleccionada(String(plan.labor_social_id || ''));
    setTipoServicio(plan.tipo_servicio_social || '');
    setCartaAceptacionPdf(plan.carta_aceptacion_pdf || '');
    setEstadoPlan(plan.estado_plan_labor_social || '');
    setEstadoSolicitudTermino(plan.solicitud_termino || 'no_solicitada');
    setEstadoConformidad(plan.conformidad_plan_social || '');
    setSolicitudEnviada(true);
    setLineaAccion(plan.linea_accion || '');

    if (plan.archivo_plan_social) setArchivoYaEnviado(true);

    const laborEncontrada = labores.find(l => l.id_labores === plan.labor_social_id);
    if (laborEncontrada) setNombreLaborSocial(laborEncontrada.nombre_labores);

    setDatosCargados(true);
  } catch (error) {
    console.error('Error al obtener los datos del trabajo social:', error);
  }
}, [user?.id, user?.token, labores, setLineaAccion]);


useEffect(() => {
  fetchTrabajoSocial();
}, [fetchTrabajoSocial]);


useEffect(() => {
  const token = user?.token;

  if (programaSeleccionado && token) {
    const fetchDocentes = async () => {
      try {
        const res = await axios.get(`/api/docentes/programa/${programaSeleccionado}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDocentes(res.data);
      } catch (error) {
        console.error('Error al obtener docentes:', error);
      }
    };
    fetchDocentes();
  } else {
    setDocentes([]);
  }
}, [programaSeleccionado, user?.token]);


const handleGoToNextSection = () => {
  if (activeSection === 'designacion') {
    if (estadoPlan === 'aceptado') {
      setActiveSection('conformidad');
      window.scrollTo({ top: 0, behavior: 'smooth' }); 
    } else {
      Swal.fire({
        icon: 'info',
        title: 'Solicitud pendiente',
        text: 'El docente aún no ha aceptado tu solicitud. Espera su respuesta para continuar al siguiente paso.',
        confirmButtonText: 'Entendido'
      });
    }
  } else if (activeSection === 'conformidad') {
    if (estadoConformidad === 'aceptado') {
      setActiveSection('seguimiento');
      window.scrollTo({ top: 0, behavior: 'smooth' }); 
    } else {
      Swal.fire({
        icon: 'info',
        title: 'Conformidad pendiente',
        text: 'Tu asesor aún no ha aprobado el esquema plan. Debes esperar su conformidad para continuar.',
        confirmButtonText: 'Entendido'
      });
    }
  } else if (activeSection === 'seguimiento') {
  if (todasAprobadas && estadoSolicitudTermino === 'aprobada') {
    setActiveSection('informe-final');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    Swal.fire({
      icon: 'info',
      title: 'Acceso restringido',
      text: 'Debes completar y obtener la aprobación de todas las actividades antes de continuar.',
      confirmButtonText: 'Entendido'
    });
  }
}
};

useEffect(() => {
  const token = user?.token;

  if (lineaSeleccionada && token) {
    const fetchLaboresPorLinea = async () => {
      try {
        const res = await axios.get(`/api/labores/linea/${lineaSeleccionada}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setLabores(res.data);
      } catch (error) {
        console.error('Error al obtener labores sociales por línea:', error);
      }
    };

    fetchLaboresPorLinea();
  } else {
    setLabores([]);
  }
}, [lineaSeleccionada, user?.token]);




const handleSolicitarAprobacion = async () => {
  if (solicitudEnviada) {
    mostrarAlertaSolicitudYaEnviada();
    return;
  }

  const usuario_id = user?.id;
  const token = user?.token;

  if (!usuario_id || !token) {
    mostrarErrorSinIdUsuario();
    return;
  }

  try {
    const correosValidos =
      tipoServicio === "grupal"
        ? (correosGrupo || [])
            .map((c) => String(c || "").trim().toLowerCase())
            .filter((c) => /^\d{10}@udh\.edu\.pe$/.test(c))
        : [];

    if (tipoServicio === "grupal" && correosValidos.length < 1) {
      await mostrarAlertaFaltaIntegrantesGrupo();
      return;
    }
    const correosUnicos = [...new Set(correosValidos)];

    const datos = {
      usuario_id: Number(usuario_id),
      facultad_id: Number(facultadSeleccionada),
      programa_academico_id: Number(programaSeleccionado),
      docente_id: Number(docenteSeleccionado),
      labor_social_id: Number(laborSeleccionada),
      tipo_servicio_social: tipoServicio,
      linea_accion_id: Number(lineaSeleccionada),
      correos: correosUnicos,
    };

    await axios.post("/api/trabajo-social", datos, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setSolicitudEnviada(true);
    setEstadoPlan("pendiente");
    mostrarAlertaSolicitudEnviada();
  } catch (error) {
    console.error("Error al enviar solicitud:", error);

    const status = error.response?.status;
    const data = error.response?.data;

    if (status === 409 && Array.isArray(data?.duplicados)) {
      toastWarning(
        `Correos duplicados: ${data.duplicados
          .map((c) => c.split("@")[0])
          .join(", ")}`
      );

      setCorreosGrupo((prev) =>
        prev.filter(
          (c) => !data.duplicados.includes(String(c).trim().toLowerCase())
        )
      );

      return;
    }

    mostrarAlertaErrorEnviarSolicitud(
      data?.message || "Error al enviar solicitud"
    );
  }
};

useEffect(() => {
  if (activeSection === 'seguimiento' && datosCargados) {
    if (estadoConformidad !== 'aceptado') {
      Swal.fire({
        icon: 'info',
        title: 'Acceso restringido',
        text: 'Debes esperar que tu asesor acepte el esquema plan antes de acceder al seguimiento.',
        confirmButtonText: 'Entendido'
      });

      setActiveSection('conformidad');
    }
  }
}, [activeSection, estadoConformidad, datosCargados]);


useEffect(() => {
  if (activeSection === 'conformidad' && datosCargados) {
    if (estadoPlan !== 'aceptado') {
      Swal.fire({
        icon: 'info',
        title: 'Solicitud pendiente',
        text: 'Tu docente aún no ha aceptado tu solicitud. Espera su respuesta antes de continuar.',
        confirmButtonText: 'Entendido'
      });

      setActiveSection('designacion');
    }
  }
}, [activeSection, estadoPlan, datosCargados]);

const handleGenerarPDF = async () => {
  const result = await generarPlanServicioSocialPDF({
    imagenesAnexos,
    actividades,
    nombreInstitucion,
    nombreResponsable,
    lineaAccion,
    fechaPresentacion,
    periodoEstimado,
    introduccion,
    justificacion,
    objetivoGeneral,
    objetivosEspecificos,
    nombreEntidad,
    misionVision,
    areasIntervencion,
    ubicacionPoblacion,
    areaInfluencia,
    metodologiaIntervencion,
    recursosRequeridos,
    resultadosEsperados,
    nombreFacultad,
    nombrePrograma,
    nombreLaborSocial,
    nombreCompleto,
    codigoUniversitario,
  });

  if (!result) return;

  const { url, file } = result;

  setPdfGenerado(url);
  setProyectoFile(file);
  setPdfDescargado(true);

  const link = document.createElement('a');
  link.href = url;
  link.download = 'PLAN-SERVICIO-SOCIAL-UDH.pdf';
  link.click();
};


const solicitarCartaTermino = async () => {
  const token = user?.token;
  const trabajoId = planSeleccionado?.id;

  if (!token || !trabajoId) {
    mostrarErrorSolicitudCartaTermino();
    return;
  }

  try {
    await axios.patch(
      `/api/trabajo-social/${trabajoId}/solicitar-carta-termino`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setEstadoSolicitudTermino('solicitada');
    mostrarExitoSolicitudCartaTermino();

  } catch (error) {
    console.error('Error al solicitar carta:', error);
    mostrarErrorSolicitudCartaTermino();
  }
};

const handleVolverASubir = async (actividad) => {
  const success = await volverASubirEvidencia(actividad);
  if (success) setModalObservacionEstudianteVisible(false);
};

  return (
    <>
      <Header onToggleSidebar={toggleSidebar} />
      <SidebarAlumno
        collapsed={collapsed}
        nombre={nombre}
        onToggleSidebar={toggleSidebar}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        estadoPlan={estadoPlan}
        estadoConformidad={estadoConformidad}
        estadoSolicitudTermino={estadoSolicitudTermino}
      />
      {!collapsed && window.innerWidth <= 768 && (
      <div className="sidebar-overlay" onClick={toggleSidebar}></div>
      )}

      <main className={`main-content ${collapsed ? 'collapsed' : ''}`}>
   <h1
  className="dashboard-title-animada"
  style={{ marginBottom: '40px' }}
  key={activeSection}
>
  {(() => {
    const width = window.innerWidth;

    const titulo =
      activeSection === 'seguimiento'
        ? 'Seguimiento del Servicio Social'
        : activeSection === 'conformidad'
        ? 'Conformidad De Servicio Social'
        : activeSection === 'informe-final'
        ? 'Informe Final'
        : 'Servicio Social UDH';

    let partes = [titulo];

    if (activeSection === 'conformidad') {
      if (width <= 400) {
        partes = ['Conformidad De', 'Servicio Social'];
      } else if (width <= 420) {
        partes = ['Conformidad De Servicio', 'Social'];
      }
    }

    const delayFactor = width < 768 ? 0.02 : 0.05; 

    return partes.map((linea, i) =>
      Array.from(linea).map((letra, index) => (
        <span
            key={`${i}-${index}`}
            style={{ animationDelay: `${(i * 100 + index) * delayFactor}s` }}
          >
            {letra === ' ' ? (
              <span style={{ width: '0.4em', display: 'inline-block' }}>{'\u00A0'}</span>
            ) : (
              letra
            )}
          </span>
      )).concat(i < partes.length - 1 ? [<br key={`br-${i}`} className="mobile-line-break" />] : [])
    );
  })()}
</h1>

{activeSection === 'reglamento' && (
  <div className="dashboard-container">
    <Reglamento />
  </div>
)}

{activeSection === 'plan-trabajo' && (
  <div className="dashboard-container">
    <PlanTrabajo />
  </div>
)}
 {activeSection === 'informe-final' && (
  <div className="dashboard-container">
  <InformeFinal
  nombreFacultad={nombreFacultad}
  nombrePrograma={nombrePrograma}
  nombreCompleto={nombreCompleto}
  codigoUniversitario={codigoUniversitario}
  nombreLaborSocial={nombreLaborSocial}
  nombreInstitucion={nombreInstitucion}
  setNombreInstitucion={setNombreInstitucion}
  nombreResponsable={nombreResponsable}
  setNombreResponsable={setNombreResponsable}
  lineaAccion={lineaAccion}
  setPlanSeleccionado={setPlanSeleccionado}
  setLineaAccion={setLineaAccion}
  fechaPresentacion={fechaPresentacion}
  setFechaPresentacion={setFechaPresentacion}
  periodoEstimado={periodoEstimado}
  setPeriodoEstimado={setPeriodoEstimado}
  antecedentes={antecedentes}
  planSeleccionado={planSeleccionado}
  setAntecedentes={setAntecedentes}
  setModalVisible={setModalVisible} 
  setImagenModal={setImagenModal}   
  objetivoGeneralInforme={objetivoGeneralInforme}
  setObjetivoGeneralInforme={setObjetivoGeneralInforme}
  objetivosEspecificosInforme={objetivosEspecificosInforme}
  setObjetivosEspecificosInforme={setObjetivosEspecificosInforme}
  actividadesSeguimiento={actividadesSeguimiento}
  areaInfluenciaInforme={areaInfluenciaInforme}
  setAreaInfluenciaInforme={setAreaInfluenciaInforme}
  recursosUtilizadosInforme={recursosUtilizadosInforme}
  setRecursosUtilizadosInforme={setRecursosUtilizadosInforme}
  metodologiaInforme={metodologiaInforme}
  setMetodologiaInforme={setMetodologiaInforme}
  conclusionesInforme={conclusionesInforme}
  handleFileChange={handleFileChange}
  setConclusionesInforme={setConclusionesInforme}
  recomendacionesInforme={recomendacionesInforme}
  setRecomendacionesInforme={setRecomendacionesInforme}
  anexosInforme={anexosInforme}
  setAnexosInforme={setAnexosInforme}
/>
 </div>
)}
  {activeSection === 'conformidad' && (
  <ConformidadPlan
  activeSection={activeSection}
  estadoConformidad={estadoConformidad}
  nombreDocente={nombreDocente}
  nombreLaborSocial={nombreLaborSocial}
  abrirModalProyecto={abrirModalProyecto}
  cartaAceptacionPdf={cartaAceptacionPdf}
  setCartaAceptacionPdf={setCartaAceptacionPdf}
  introduccion={introduccion}
  setIntroduccion={setIntroduccion}
  justificacion={justificacion}
  setJustificacion={setJustificacion}
  objetivoGeneral={objetivoGeneral}
  setObjetivoGeneral={setObjetivoGeneral}
  objetivosEspecificos={objetivosEspecificos}
  setObjetivosEspecificos={setObjetivosEspecificos}
  nombreEntidad={nombreEntidad}
  setNombreEntidad={setNombreEntidad}
  misionVision={misionVision}
  setMisionVision={setMisionVision}
  areasIntervencion={areasIntervencion}
  setAreasIntervencion={setAreasIntervencion}
  ubicacionPoblacion={ubicacionPoblacion}
  setUbicacionPoblacion={setUbicacionPoblacion}
  areaInfluencia={areaInfluencia}
  setAreaInfluencia={setAreaInfluencia}
  metodologiaIntervencion={metodologiaIntervencion}
  setMetodologiaIntervencion={setMetodologiaIntervencion}
  recursosRequeridos={recursosRequeridos}
  setRecursosRequeridos={setRecursosRequeridos}
  resultadosEsperados={resultadosEsperados}
  setResultadosEsperados={setResultadosEsperados}
  actividades={actividades}
  setActividades={setActividades}
  abrirModalActividad={abrirModalActividad}
  setNuevaActividad={setNuevaActividad}
  setNuevaFecha={setNuevaFecha}
  setNuevaJustificacion={setNuevaJustificacion}
  setNuevosResultados={setNuevosResultados}
  setEditIndex={setEditIndex}
  setModalActividadVisible={setModalActividadVisible}
  nombreFacultad={nombreFacultad}
  nombrePrograma={nombrePrograma}
  nombreCompleto={nombreCompleto}
  codigoUniversitario={codigoUniversitario}
  fechaPresentacion={fechaPresentacion}
  setFechaPresentacion={setFechaPresentacion}
  periodoEstimado={periodoEstimado}
  setPeriodoEstimado={setPeriodoEstimado}
  nombreInstitucion={nombreInstitucion}
  setNombreInstitucion={setNombreInstitucion}
  nombreResponsable={nombreResponsable}
  setNombreResponsable={setNombreResponsable}
  lineaAccion={lineaAccion}
  setLineaAccion={setLineaAccion}
  handleFileChange={handleFileChange}
  archivoYaEnviado={archivoYaEnviado}
  handleGenerarPDF={handleGenerarPDF}
  nuevaFechaFin={nuevaFechaFin}
  setNuevaFechaFin={setNuevaFechaFin}
  pdfDescargado={pdfDescargado}
  proyectoFile={proyectoFile}
  handleSolicitarRevision={handleSolicitarRevision}
/>
)}
{(activeSection === 'seguimiento' || activeSection === 'designacion') && (
    <div className="card-section">
    {activeSection === 'seguimiento' && (
    <SeguimientoActividades
    actividadesSeguimiento={actividadesSeguimiento}
    hayObservaciones={hayObservaciones}
    handleEvidencia={handleEvidencia}
    setImagenModal={setImagenModal}
    setModalVisible={setModalVisible}
    solicitarCartaTermino={solicitarCartaTermino}
    todasAprobadas={todasAprobadas}
    estadoSolicitudTermino={estadoSolicitudTermino}
    planSeleccionado={planSeleccionado}
    setObservacionSeleccionada={setObservacionSeleccionada}
    setModalObservacionEstudianteVisible={setModalObservacionEstudianteVisible}
    setActividadesSeguimiento={setActividadesSeguimiento}
    actividadSeleccionada={actividadSeleccionada}
    setActividadSeleccionada={setActividadSeleccionada}
    handleVolverASubir={handleVolverASubir}

  />
)}

 {activeSection === 'designacion' && (
<DesignacionDocente
  tipoServicio={tipoServicio}
  obtenerIntegrantesDelGrupo={obtenerIntegrantesDelGrupo}
  setTipoServicio={setTipoServicio}
  solicitudEnviada={solicitudEnviada}
  setModalGrupoVisible={setModalGrupoVisible}
  facultadSeleccionada={facultadSeleccionada}
  programaSeleccionado={programaSeleccionado}
  nombreFacultad={nombreFacultad}
  nombrePrograma={nombrePrograma}
  docentes={docentes}
  correosGrupo={correosGrupo}
  setCorreosGrupo={setCorreosGrupo}
  trabajoId={planSeleccionado?.id}
  docenteSeleccionado={docenteSeleccionado}
  setDocenteSeleccionado={setDocenteSeleccionado}
  setNombreDocente={setNombreDocente}
  labores={labores}
  laborSeleccionada={laborSeleccionada}
  setLaborSeleccionada={setLaborSeleccionada}
  setNombreLaborSocial={setNombreLaborSocial}
  handleSolicitarAprobacion={handleSolicitarAprobacion}
  estadoPlan={estadoPlan}
  setLineaSeleccionada={setLineaSeleccionada}
  lineas={lineas}
  cartaAceptacionPdf={cartaAceptacionPdf}
  lineaSeleccionada={lineaSeleccionada}
/>

)}   
</div>  
)}

<div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
  {activeSection !== 'designacion' && (
    <button
      className="boton-anterior"
      onClick={() => {
        if (activeSection === 'conformidad') setActiveSection('designacion');
        else if (activeSection === 'seguimiento') setActiveSection('conformidad');
        else if (activeSection === 'informe-final') setActiveSection('seguimiento');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }}
    >
      Anterior
    </button>
  )}

  {activeSection !== 'informe-final' && (
    <button 
      className="boton-siguiente" 
      onClick={handleGoToNextSection}
    >
      Siguiente
    </button>
  )}

</div>
      </main>

<ObservacionEstudianteModal
  visible={modalObservacionEstudianteVisible}
  observacionSeleccionada={observacionSeleccionada}
  actividadSeleccionada={actividadSeleccionada}
  onVolverASubir={handleVolverASubir} 
  onClose={() => setModalObservacionEstudianteVisible(false)}
/>

<ActividadModalAlumno
  visible={modalActividadVisible}
  nuevaActividad={nuevaActividad}
  setNuevaActividad={setNuevaActividad}
  nuevaJustificacion={nuevaJustificacion}
  setNuevaJustificacion={setNuevaJustificacion}
  nuevaFecha={nuevaFecha}
  setNuevaFecha={setNuevaFecha}
  nuevaFechaFin={nuevaFechaFin}
  setNuevaFechaFin={setNuevaFechaFin}
  nuevosResultados={nuevosResultados}
  setNuevosResultados={setNuevosResultados}
  editIndex={editIndex}
  setEditIndex={setEditIndex}
  actividades={actividades}
  setActividades={setActividades}
  onClose={() => setModalActividadVisible(false)}
/>

<GrupoModalAlumno
  visible={modalGrupoVisible}
  solicitudEnviada={solicitudEnviada}
  integrantesGrupoAlumno={integrantesGrupoAlumno}
  correosGrupo={correosGrupo}
  setCorreosGrupo={setCorreosGrupo}
  loadingGrupo={loadingGrupo}     
  mensajeGrupo={mensajeGrupo}     
  onClose={() => setModalGrupoVisible(false)}
/>

<EvidenciaModal
  visible={modalVisible}
  imagen={imagenModal}
  onClose={() => setModalVisible(false)}
/>

<ProyectoModal
  visible={modalProyectoVisible}
  proyectoFile={proyectoFile}
  pdfGenerado={pdfGenerado}
  onFileChange={handleProyectoFileChange}
  onClose={() => setModalProyectoVisible(false)}
  onCancel={() => {
    setProyectoFile(null);
    cerrarModalProyecto();
  }}
/>
    </>
    
  );
  
}
export default DashboardAlumno;

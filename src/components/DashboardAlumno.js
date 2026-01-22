import React, { useState, useEffect } from 'react';
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
import jsPDF from 'jspdf';
import { useWelcomeToast } from '../hooks/alerts/useWelcomeToast';
import Reglamento from './Reglamento';
import PlanTrabajo from './PlanTrabajo';
import { PDFDocument } from 'pdf-lib';
import autoTable from 'jspdf-autotable';
import { useUser } from '../UserContext';
import ProyectoModal from "./modals/ProyectoModal";
import ObservacionEstudianteModal from "./modals/ObservacionEstudianteModal";
import GrupoModalAlumno from "./modals/GrupoModalAlumno";
import EvidenciaModal from "./modals/EvidenciaModal";
import ActividadModalAlumno from "./modals/ActividadModalAlumno";
import {
  mostrarErrorObtenerIntegrantesGrupo,
  mostrarErrorSesionInvalida,
  mostrarErrorArchivoNoSeleccionado,
  mostrarErrorEnviarProyecto,
  mostrarExitoSolicitudRevision,
  mostrarAlertaEvidenciaSeleccionada,
  mostrarAlertaSolicitudYaEnviada,
  mostrarAlertaErrorEnviarSolicitud,
  mostrarAlertaSolicitudEnviada,
  mostrarErrorSinIdUsuario,
  mostrarAlertaCompletarPerfilPrimeraVez,
   mostrarExitoSolicitudCartaTermino,
  mostrarErrorSolicitudCartaTermino
} from "../hooks/alerts/alertas";

function DashboardAlumno() {
  const { user } = useUser();
  const [actividadSeleccionada, setActividadSeleccionada] = useState(null);
  const [collapsed, setCollapsed] = useState(() => window.innerWidth <= 768);
  const [pdfDescargado, setPdfDescargado] = useState(false);
  const [nombre, setNombre] = useState('');
  const [conclusionesInforme, setConclusionesInforme] = useState('');
  const [recomendacionesInforme, setRecomendacionesInforme] = useState('');
  const [anexosInforme, setAnexosInforme] = useState('');
  const [programas, setProgramas] = useState([]);
  const [nuevaFechaFin, setNuevaFechaFin] = useState('');
  const [programaSeleccionado, setProgramaSeleccionado] = useState('');
  const [docentes, setDocentes] = useState([]);
  const [labores, setLabores] = useState([]); 
  const [docenteSeleccionado, setDocenteSeleccionado] = useState(''); 
  const [archivoYaEnviado, setArchivoYaEnviado] = useState(false);
  const [solicitudEnviada, setSolicitudEnviada] = useState(false);
  const [laborSeleccionada, setLaborSeleccionada] = useState('');
  const [estadoPlan, setEstadoPlan] = useState('');
  const [datosCargados, setDatosCargados] = useState(false);
  const [cartaAceptacionPdf, setCartaAceptacionPdf] = useState('');
  const [facultades, setFacultades] = useState([]);
  const [planSeleccionado, setPlanSeleccionado] = useState(null);
  const [nombreLaborSocial, setNombreLaborSocial] = useState('');
  const [modalProyectoVisible, setModalProyectoVisible] = useState(false);
  const [proyectoFile, setProyectoFile] = useState(null);
  const [fechaPresentacion, setFechaPresentacion] = useState('');
  const [justificacion, setJustificacion] = useState('');
  const [objetivoGeneral, setObjetivoGeneral] = useState('');
  const [areaInfluenciaInforme, setAreaInfluenciaInforme] = useState('');
  const [recursosUtilizadosInforme, setRecursosUtilizadosInforme] = useState('');
  const [metodologiaInforme, setMetodologiaInforme] = useState('');
  const [objetivosEspecificos, setObjetivosEspecificos] = useState('');
  const [metodologiaIntervencion, setMetodologiaIntervencion] = useState('');
  const [recursosRequeridos, setRecursosRequeridos] = useState('');
  const [resultadosEsperados, setResultadosEsperados] = useState('');
  const [pdfGenerado, setPdfGenerado] = useState(null);
  const [lineas, setLineas] = useState([]);
  const [nombreInstitucion, setNombreInstitucion] = useState('');
  const [nombreResponsable, setNombreResponsable] = useState('');
  const [lineaAccion, setLineaAccion] = useState('');
  const [estadoConformidad, setEstadoConformidad] = useState('');
  const [estadoSolicitudTermino, setEstadoSolicitudTermino] = useState('no_solicitada');
  const [modalActividadVisible, setModalActividadVisible] = useState(false);
  const [nuevaActividad, setNuevaActividad] = useState('');
  const [nuevaFecha, setNuevaFecha] = useState('');
  const [antecedentes, setAntecedentes] = useState('');
  const [objetivoGeneralInforme, setObjetivoGeneralInforme] = useState('');
  const [objetivosEspecificosInforme, setObjetivosEspecificosInforme] = useState('');
  const [actividades, setActividades] = useState([]);
  const [editIndex, setEditIndex] = useState(null); 
  const [lineaSeleccionada, setLineaSeleccionada] = useState('');
  const [imagenModal, setImagenModal] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [actividadesSeguimiento, setActividadesSeguimiento] = useState([]);
  const [facultadSeleccionada, setFacultadSeleccionada] = useState('');
  const [nombreFacultad, setNombreFacultad] = useState('');
  const [nombrePrograma, setNombrePrograma] = useState('');
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [codigoUniversitario, setCodigoUniversitario] = useState('');
  const [nuevaJustificacion, setNuevaJustificacion] = useState('');
  const [nuevosResultados, setNuevosResultados] = useState('');
  const [tipoServicio, setTipoServicio] = useState('');
  const [modalGrupoVisible, setModalGrupoVisible] = useState(false);
  const [correosGrupo, setCorreosGrupo] = useState(['']);
  const [periodoEstimado, setPeriodoEstimado] = useState('');
  const [introduccion, setIntroduccion] = useState('');
  const [integrantesGrupoAlumno, setIntegrantesGrupoAlumno] = useState([]);
  const [nombreEntidad, setNombreEntidad] = useState('');
  const [misionVision, setMisionVision] = useState('');
  const [modalObservacionEstudianteVisible, setModalObservacionEstudianteVisible] = useState(false);
  const [observacionSeleccionada, setObservacionSeleccionada] = useState('');
  const [areasIntervencion, setAreasIntervencion] = useState('');
  const [ubicacionPoblacion, setUbicacionPoblacion] = useState('');
  const [areaInfluencia, setAreaInfluencia] = useState('');
  const [imagenesAnexos, setImagenesAnexos] = useState({
    cartaAceptacion: null,
    datosContacto: null,
    organigrama: null,
    documentosAdicionales: null
  });
  

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


const obtenerIntegrantesDelGrupo = async () => {
  const usuario_id = user?.id;
  const token = user?.token;

  if (!usuario_id || !token) return;

  try {
    const response = await axios.get(
      `/api/integrantes/estudiante/actual?usuario_id=${usuario_id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setIntegrantesGrupoAlumno(response.data);
    setModalGrupoVisible(true);
  } catch (error) {
    console.error("Error al obtener integrantes del grupo:", error);

    const mensaje = error.response?.data?.message;
    mostrarErrorObtenerIntegrantesGrupo(mensaje);
  }
};

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


const handleEvidencia = (actividadId, index) => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.capture = 'environment';

  input.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const updated = [...actividadesSeguimiento];
    updated[index].archivoTemporalEvidencia = file;
    setActividadesSeguimiento(updated);

    mostrarAlertaEvidenciaSeleccionada(); 
  };

  input.click();
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
    const nombreUsuario = localStorage.getItem('nombre_usuario') || 'NOMBRE DEL ALUMNO';
    setNombre(nombreUsuario);
  }, []);


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

  const abrirModalActividad = () => {
    setNuevaActividad('');
    setNuevaJustificacion('');
    setNuevaFecha('');
    setNuevosResultados('');
    setEditIndex(null);
    setModalActividadVisible(true);
  };

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
      setFacultadSeleccionada(estudiante.facultad_id);
      setProgramaSeleccionado(estudiante.programa_academico_id);
      setNombreFacultad(estudiante.Facultade?.nombre_facultad || '');
      setNombrePrograma(estudiante.ProgramasAcademico?.nombre_programa || '');
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
  const token = user?.token;

  const fetchProgramas = async () => {
    if (!token) return;

    try {
      const res = await axios.get('/api/programas', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProgramas(res.data);
    } catch (error) {
      console.error('Error al obtener todos los programas académicos:', error);
    }
  };

  fetchProgramas();
}, [user?.token]);


  useEffect(() => {
    if (docenteSeleccionado && docentes.length > 0) {
      const docente = docentes.find((d) => d.id_docente === docenteSeleccionado);
      setNombreDocente(docente ? docente.nombre_docente : '');
    }
  }, [docenteSeleccionado, docentes]); 

const fetchTrabajoSocial = React.useCallback(async () => {
  const usuario_id = user?.id;
  const token = user?.token;
  if (!usuario_id || !token) return;

  try {
    const res = await axios.get(`/api/trabajo-social/usuario/${usuario_id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (res.data) {
      setFacultadSeleccionada(res.data.facultad_id);
      setProgramaSeleccionado(res.data.programa_academico_id);
      setDocenteSeleccionado(res.data.docente_id);
      setLineaSeleccionada(res.data.linea_accion_id);
      setLaborSeleccionada(res.data.labor_social_id);
      setTipoServicio(res.data.tipo_servicio_social);
      setCartaAceptacionPdf(res.data.carta_aceptacion_pdf);
      setEstadoPlan(res.data.estado_plan_labor_social);
      setEstadoSolicitudTermino(res.data.solicitud_termino);
      setEstadoConformidad(res.data.conformidad_plan_social);
      setSolicitudEnviada(true);
      setLineaAccion(res.data.linea_accion || '');

      if (res.data.archivo_plan_social) {
        setArchivoYaEnviado(true);
      }

      const laborEncontrada = labores.find(l => l.id_labores === res.data.labor_social_id);
      if (laborEncontrada) {
        setNombreLaborSocial(laborEncontrada.nombre_labores);
      }

      setDatosCargados(true);
    }
  } catch (error) {
    console.error('Error al obtener los datos del trabajo social:', error);
  }
}, [user, labores]);

useEffect(() => {
  fetchTrabajoSocial();
}, [fetchTrabajoSocial]);

  
useEffect(() => {
  const usuario_id = user?.id;
  const token = user?.token;

  const fetchEstadoTrabajoSocial = async () => {
    if (!usuario_id || !token) return;

    try {
      const res = await axios.get(`/api/trabajo-social/usuario/${usuario_id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.data?.estado_plan_labor_social) {
        setEstadoPlan(res.data.estado_plan_labor_social);
      }
    } catch (error) {
      console.error('Error al obtener estado del trabajo social:', error);
    }
  };

  if (usuario_id && token) {
    fetchEstadoTrabajoSocial();
  }
}, [user?.id, user?.token]);



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
    const correosLimpios =
      tipoServicio === "grupal"
        ? correosGrupo
            .map((c) => String(c || "").trim().toLowerCase())
            .filter(Boolean)
        : [];

    const datos = {
      usuario_id: Number(usuario_id),
      facultad_id: Number(facultadSeleccionada),
      programa_academico_id: Number(programaSeleccionado),
      docente_id: Number(docenteSeleccionado),
      labor_social_id: Number(laborSeleccionada),
      tipo_servicio_social: tipoServicio,
      linea_accion_id: Number(lineaSeleccionada),
      correos: correosLimpios,
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


const mergePDFs = async (mainPdfBlob, anexos) => {
  const mainPdfBytes = await mainPdfBlob.arrayBuffer();
  const mainPdfDoc = await PDFDocument.load(mainPdfBytes);

  for (const anexo of anexos) {
    if (!anexo) continue;

    const anexoBytes = await anexo.arrayBuffer();
    const anexoDoc = await PDFDocument.load(anexoBytes);

    const copiedPages = await mainPdfDoc.copyPages(anexoDoc, anexoDoc.getPageIndices());
    copiedPages.forEach((page) => mainPdfDoc.addPage(page));
  }

  const mergedPdfBytes = await mainPdfDoc.save();
  return new Blob([mergedPdfBytes], { type: 'application/pdf' });
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
  const usuario_id = user?.id; 

  if (!usuario_id || !datosCargados || !user?.token) return;

  const obtenerActividades = async () => {
    try {
      const res = await axios.get(`/api/cronograma/${usuario_id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      if (Array.isArray(res.data)) {
        setActividadesSeguimiento(res.data);
      }
    } catch (error) {
      console.error('Error al obtener actividades desde la BD:', error);
    }
  };

  obtenerActividades();
}, [datosCargados, user?.id, user?.token]);



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
  const camposRequeridos = [
    nombreInstitucion, nombreResponsable, lineaAccion, fechaPresentacion,
    periodoEstimado, introduccion, justificacion, objetivoGeneral,
    objetivosEspecificos, nombreEntidad, misionVision, areasIntervencion,
    ubicacionPoblacion, areaInfluencia, metodologiaIntervencion,
    recursosRequeridos, resultadosEsperados
  ];

    if (!imagenesAnexos.cartaAceptacion) {
      Swal.fire({
        icon: 'warning',
        title: 'Falta el ANEXO',
        text: 'Debes adjuntar el convenio de Cooperación Institucional antes de generar el PDF.',
      });
      return;
    }

    const camposVacios = camposRequeridos.some(campo => campo.trim() === '') || actividades.length === 0;
    if (camposVacios) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Completa todos los campos del esquema plan y agrega al menos una actividad antes de generar el PDF.',
      });
      return;
    }

  const periodoEnDias = {
    '4 MESES': 120,
    '5 MESES': 150,
    '6 MESES': 180
  };

  const diasRequeridos = periodoEnDias[periodoEstimado.toUpperCase()];
  const sumaDiasActividades = actividades.reduce((total, act) => {
    const fechaInicio = new Date(act.fecha);
    const fechaFin = new Date(act.fechaFin);
    const diffEnMs = fechaFin - fechaInicio;
    const diffDias = diffEnMs / (1000 * 60 * 60 * 24);
    return total + (diffDias > 0 ? diffDias : 0);
  }, 0);

  if (sumaDiasActividades < diasRequeridos) {
    await Swal.fire({
      icon: 'warning',
      title: 'Duración insuficiente',
      text: `La suma total de tus actividades es de ${Math.floor(sumaDiasActividades)} días, pero el periodo estimado es de ${diasRequeridos} días.`,
      confirmButtonText: 'Corregir'
    });
    return;
  } 
  const actividadesOrdenadas = [...actividades].sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
  for (let i = 1; i < actividadesOrdenadas.length; i++) {
    const anteriorFin = new Date(actividadesOrdenadas[i - 1].fechaFin);
    const actualInicio = new Date(actividadesOrdenadas[i].fecha);

    if (actualInicio < anteriorFin) {
      await Swal.fire({
        icon: 'warning',
        title: 'Fechas traslapadas',
        text: `La actividad "${actividadesOrdenadas[i].actividad}" comienza antes de que termine la actividad anterior.`,
        confirmButtonText: 'Corregir'
      });
      return;
    }
  }
  const doc = new jsPDF();
  const altoPagina = doc.internal.pageSize.getHeight(); 

  doc.setFont('times');
  doc.setFontSize(12);
  doc.text('UNIVERSIDAD DE HUÁNUCO', 105, 20, { align: 'center' });
  doc.setFont('times', 'bold');
  doc.setFontSize(14);
  doc.text(`FACULTAD DE ${nombreFacultad.toUpperCase()}`, 105, 30, { align: 'center' });
  doc.setFont('times', 'bold');
  doc.setFontSize(14);

const textoPrograma = `PROGRAMA ACADÉMICO DE ${nombrePrograma.toUpperCase()}`;
const lineas = doc.splitTextToSize(textoPrograma, 160); 

if (lineas.length === 1) {
  doc.text(lineas[0], 105, 40, { align: 'center' });
} else {
  doc.text(lineas[0], 105, 40, { align: 'center' });
  doc.text(lineas[1], 105, 47, { align: 'center' });
}

  const logo = await fetch('/images/logonuevo.png')
    .then(res => res.blob())
    .then(blob => new Promise(resolve => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    }));

doc.addImage(logo, 'PNG', 56, 50, 90, 60); 

  doc.setFontSize(16);
  doc.text('PLAN SERVICIO SOCIAL UDH', 105, 120, { align: 'center' });

    doc.setLineWidth(0.5); 
    doc.line(30, 125, 180, 125); 
    doc.setFontSize(14);
    doc.setFont('times', 'bolditalic');
    doc.text(`"${nombreLaborSocial}"`, 105, 132, { align: 'center' });
    doc.line(30, 137, 180, 137); 
    doc.setFontSize(12);

    const yInicial = 155;
    const saltoLinea = 10;
    let yActual = yInicial;

    const escribirCampoa = (label, valor, y) => {
      doc.setFont('times', 'bold');
      doc.text(label, 25, y); 
      doc.setFont('times', 'normal');
      doc.text(valor, 80, y); 
    };


escribirCampoa('Nombre Completo:', nombreCompleto, yActual);
yActual += saltoLinea;

escribirCampoa('Código Universitario:', codigoUniversitario, yActual);
yActual += saltoLinea;

escribirCampoa('Nombre de la Institución:', nombreInstitucion, yActual);
yActual += saltoLinea;

escribirCampoa('Responsable Institucional:', nombreResponsable, yActual);
yActual += saltoLinea;

escribirCampoa('Línea de Acción:', lineaAccion, yActual);
yActual += saltoLinea;

escribirCampoa('Fecha de Presentación:', fechaPresentacion, yActual);
yActual += saltoLinea;

escribirCampoa('Periodo Estimado:', periodoEstimado, yActual);

  doc.setFontSize(12);
  doc.text('HUÁNUCO - PERÚ', 105, 270, { align: 'center' });
  doc.text('2025', 105, 278, { align: 'center' });
  doc.addPage();
    doc.setFont('times', 'bold');
    doc.setFontSize(14);
    const tituloIntro = 'INTRODUCCIÓN';
    const anchoTitulo = doc.getTextWidth(tituloIntro);
    const yTitulo = 60;
    doc.text(tituloIntro, (doc.internal.pageSize.getWidth() - anchoTitulo) / 2, yTitulo);

    doc.setFont('times', 'normal');
    doc.setFontSize(12);
    const introLineas = doc.splitTextToSize(introduccion, 170);
    const yContenido = yTitulo + 20;
    doc.text(introLineas, 30, yContenido); 
    doc.addPage();

let y = 20;
doc.setFontSize(12);
doc.setFont('times', 'bold');
doc.text('1. JUSTIFICACIÓN', 20, y);
doc.setFont('times', 'normal');
y += 12; 
const lineasJustificacion = doc.splitTextToSize(justificacion, 170);
doc.text(lineasJustificacion, 20, y);
y += lineasJustificacion.length * 6 + 4;
doc.setFont('times', 'bold');
doc.text('2. OBJETIVOS', 20, y);
y += 12; 

doc.setFont('times', 'bold');
doc.text('2.1 OBJETIVO GENERAL:', 25, y);
doc.setFont('times', 'normal');
y += 6;
const lineasObjGeneral = doc.splitTextToSize(objetivoGeneral, 170);
doc.text(lineasObjGeneral, 25, y);
y += lineasObjGeneral.length * 6 + 4;

doc.setFont('times', 'bold');
doc.text('2.2 OBJETIVOS ESPECÍFICOS:', 25, y);
doc.setFont('times', 'normal');
y += 6;
const lineasObjEspecificos = doc.splitTextToSize(objetivosEspecificos, 170);
const margenInferior = 20; 
const altoContenido = lineasObjEspecificos.length * 6;

if (y + altoContenido > altoPagina - margenInferior) {
  doc.addPage();
  y = 20; 
}

doc.text(lineasObjEspecificos, 25, y);
y += altoContenido + 4;

doc.setFont('times', 'bold');
doc.text('3. MARCO INSTITUCIONAL', 20, y);
y += 12;

const marcoSubsecciones = [
  ['3.1 NOMBRE DE LA ENTIDAD:', nombreEntidad],
  ['3.2 MISIÓN Y VISIÓN:', misionVision],
  ['3.3 SERVICIOS:', areasIntervencion],
  ['3.4 ÁREAS DE INTERVENCIÓN O SERVICIOS QUE OFRECE:', areasIntervencion],
  ['3.5 UBICACIÓN Y POBLACIÓN:', ubicacionPoblacion],
];

for (const [titulo, texto] of marcoSubsecciones) {
  doc.setFont('times', 'bold');
  doc.text(titulo, 25, y);
  doc.setFont('times', 'normal');
  y += 6;
  const lineasSub = doc.splitTextToSize(texto, 170);

  const altoContenido = lineasSub.length * 6;
  const margenInferior = 20;
  if (y + altoContenido > altoPagina - margenInferior) {
    doc.addPage();
    y = 20;
  }
  doc.text(lineasSub, 25, y);
  y += altoContenido + 4;

  if (y > altoPagina - margenInferior) {
    doc.addPage();
    y = 20;
  }
}

doc.setFont('times', 'bold');
doc.text('4. ÁREA DE INFLUENCIA', 20, y);
doc.setFont('times', 'normal');
y += 6;
const lineasArea = doc.splitTextToSize(areaInfluencia, 170);

const altoContenidoArea = lineasArea.length * 6;
if (y + altoContenidoArea > altoPagina - margenInferior) {
  doc.addPage();
  y = 20;
}
doc.text(lineasArea, 20, y);
y += altoContenidoArea + 4;

doc.setFont('times', 'bold');
doc.text('5. METODOLOGÍA DE INTERVENCIÓN', 20, y);
doc.setFont('times', 'normal');
y += 6;
const lineasMetodo = doc.splitTextToSize(metodologiaIntervencion, 170);
doc.text(lineasMetodo, 20, y);
y += lineasMetodo.length * 6 + 4;

doc.setFont('times', 'bold');
doc.text('6. RECURSOS REQUERIDOS', 20, y);
doc.setFont('times', 'normal');
y += 6;
const lineasRecursos = doc.splitTextToSize(recursosRequeridos, 170);

const altoContenidoRecursos = lineasRecursos.length * 6;
if (y + altoContenidoRecursos > altoPagina - margenInferior) {
  doc.addPage();
  y = 20;
}
doc.text(lineasRecursos, 20, y);
y += altoContenidoRecursos + 4;

doc.setFont('times', 'bold');
doc.text('7. RESULTADOS ESPERADOS', 20, y);
doc.setFont('times', 'normal');
y += 6;
const lineasResultados = doc.splitTextToSize(resultadosEsperados, 170);
const altoContenidoResultados = lineasResultados.length * 6;
if (y + altoContenidoResultados > altoPagina - margenInferior) {
  doc.addPage();
  y = 20;
}
doc.text(lineasResultados, 20, y);
y += altoContenidoResultados + 4;

doc.addPage('a4', 'landscape'); 
const anchoPagina = doc.internal.pageSize.getWidth();
doc.setFont('times', 'bold');
doc.setFontSize(18);
doc.text('CRONOGRAMA DE ACTIVIDADES', anchoPagina / 2, 80, { align: 'center' });
autoTable(doc, {
  startY: 90,
  margin: { left: 25, right: 25 }, 
  tableWidth: 'wrap', 
  head: [['Actividad', 'Justificación', 'Fecha Estimada', 'Fecha Fin', 'Resultados Esperados']],
  body: actividades.map((a) => [
    a.actividad,
    a.justificacion,
    a.fecha,
    a.fechaFin || '',
    a.resultados
  ]),
  styles: { fontSize: 11, halign: 'center', valign: 'middle' },
  headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold', fontSize: 12 },
  alternateRowStyles: { fillColor: [240, 240, 240] },
  columnStyles: {
    0: { halign: 'left', cellWidth: 60 },  
    1: { halign: 'left', cellWidth: 60 },  
    2: { halign: 'center', cellWidth: 32 },
    3: { halign: 'center', cellWidth: 32 },
    4: { halign: 'left', cellWidth: 60 },  
  }
});

doc.addPage('a4', 'portrait');
doc.setFont('times', 'bold');
doc.setFontSize(40);
doc.text('ANEXOS', 105, 150, { align: 'center' }); 

 const pdfBlob = doc.output('blob');
 const anexos = [
  imagenesAnexos.cartaAceptacion,
  imagenesAnexos.datosContacto,
  imagenesAnexos.organigrama,
  imagenesAnexos.documentosAdicionales
];

const mergedBlob = await mergePDFs(pdfBlob, anexos);
const url = URL.createObjectURL(mergedBlob);
const archivoFinal = new File([mergedBlob], 'PLAN-SERVICIO-SOCIAL-UDH.pdf', { type: 'application/pdf' });

setPdfGenerado(url);
setProyectoFile(archivoFinal);
setPdfDescargado(true);

const link = document.createElement('a');
link.href = url;
link.download = 'PLAN-SERVICIO-SOCIAL-UDH.pdf';
link.click();
};

const hayObservaciones = actividadesSeguimiento.some(
  (actividad) => actividad.estado === 'observado' && actividad.observacion
);
const todasAprobadas = actividadesSeguimiento.length > 0 &&
  actividadesSeguimiento.every((actividad) => actividad.estado === 'aprobado');

const solicitarCartaTermino = async () => {
  const usuario_id = user?.id;
  const token = user?.token;

  if (!usuario_id || !token) return;

  try {
    const { data } = await axios.get(`/api/trabajo-social/usuario/${usuario_id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const trabajoId = data.id;
    if (!trabajoId) {
      throw new Error("No se encontró el ID del trabajo social.");
    }

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
  if (!actividad) {
    Swal.fire('Error', 'No hay actividad seleccionada para eliminar la evidencia.', 'error');
    return;
  }

  try {
    await axios.delete(`/api/cronograma/evidencia/${actividad.id}`, {
      headers: { Authorization: `Bearer ${user.token}` }
    });

    Swal.fire('Éxito', 'La evidencia fue eliminada. Puedes volver a subir una nueva.', 'success');

    const actualizadas = actividadesSeguimiento.map((a) =>
      a.id === actividad.id
        ? { ...a, evidencia: null, estado: 'pendiente', archivoTemporalEvidencia: null }
        : a
    );
    setActividadesSeguimiento(actualizadas);
    setModalObservacionEstudianteVisible(false);
  } catch (error) {
    console.error(error);
    Swal.fire('Error', 'No se pudo eliminar la evidencia.', 'error');
  }
};

useEffect(() => {
  const usuarioId = user?.id;
  const token = user?.token;

  if (!usuarioId || !token) return;

  const fetchPlan = async () => {
    try {
      const res = await axios.get(`/api/trabajo-social/usuario/${usuarioId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPlanSeleccionado(res.data);
    } catch (err) {
      console.error('Error al obtener plan:', err);
    }
  };

  fetchPlan();
}, [user?.id, user?.token]);

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
    facultades={facultades}
    facultadSeleccionada={facultadSeleccionada}
    programas={programas}
    programaSeleccionado={programaSeleccionado}
    docentes={docentes}
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

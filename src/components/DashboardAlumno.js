
import React, { useState, useEffect } from 'react';
import SidebarAlumno from './SidebarAlumno';
import ConformidadPlan from './ConformidadPlan';
import Header from './Header';
import axios from 'axios';
import './DashboardAlumno.css';
import DesignacionDocente from './DesignacionDocente';
import './ModalGlobal.css';
import Swal from 'sweetalert2';
import InformeFinal from './InformeFinal'; // porque estás en /src/components
import SeguimientoActividades from './SeguimientoActividades'
import jsPDF from 'jspdf';
import Reglamento from './Reglamento';
import PlanTrabajo from './PlanTrabajo';
import { PDFDocument } from 'pdf-lib';
import autoTable from 'jspdf-autotable';
import { useUser } from '../UserContext';
function DashboardAlumno() {
  const { user } = useUser();
  

  const [collapsed, setCollapsed] = useState(() => window.innerWidth <= 768);
  const [pdfDescargado, setPdfDescargado] = useState(false);
  const [nombre, setNombre] = useState('');
  const [conclusionesInforme, setConclusionesInforme] = useState('');
  const [recomendacionesInforme, setRecomendacionesInforme] = useState('');
  const [anexosInforme, setAnexosInforme] = useState('');
  const [programas, setProgramas] = useState([]);
  const [nuevaFechaFin, setNuevaFechaFin] = useState('');
  const [programaSeleccionado, setProgramaSeleccionado] = useState('');
  const [docentes, setDocentes] = useState([]); // Estado para los docentes
  const [labores, setLabores] = useState([]); // Estado para las labores sociales
  const [docenteSeleccionado, setDocenteSeleccionado] = useState(''); // Estado para el docente seleccionado
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
  const token = user?.token;
  const [imagenesAnexos, setImagenesAnexos] = useState({
    cartaAceptacion: null,
    datosContacto: null,
    organigrama: null,
    documentosAdicionales: null
  });
  const handleFileChange = (e, tipo) => {
    const archivo = e.target.files[0];
    if (archivo) {
      setImagenesAnexos(prevState => ({
        ...prevState,
        [tipo]: archivo
      }));
    }
  };

const obtenerIntegrantesDelGrupo = async () => {
  const usuario_id = user?.id;
  const token = user?.token;

  if (!usuario_id || !token) return;

  try {
    const response = await axios.get(`http://localhost:5000/api/integrantes/estudiante/actual?usuario_id=${usuario_id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    setIntegrantesGrupoAlumno(response.data);
    setModalGrupoVisible(true); // Asegúrate de tener este estado también
  } catch (error) {
    console.error('Error al obtener integrantes del grupo:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo cargar el grupo.',
    });
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
      const res = await axios.get('http://localhost:5000/api/lineas', {
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
}, [user]);

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
    alert('No se encontró el ID de usuario o el token. Inicia sesión nuevamente.');
    return;
  }

  if (!proyectoFile) {
    alert('Primero selecciona un archivo.');
    return;
  }

  try {
    // Paso 1: Guardar cronograma en la BD
    await axios.post(`http://localhost:5000/api/cronograma/${usuario_id}`, {
      actividades
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    // Paso 2: Subir archivo PDF del esquema
    const formData = new FormData();
    formData.append('archivo_plan_social', proyectoFile);
    formData.append('usuario_id', usuario_id);

    await axios.post('http://localhost:5000/api/trabajo-social/subir-plan-social', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      }
    });

    Swal.fire({
      icon: 'success',
      title: 'Revisión solicitada',
      text: 'Tu proyecto ha sido enviado correctamente al asesor para su revisión.',
      timer: 2500,
      showConfirmButton: false
    }).then(() => {
      setArchivoYaEnviado(true);
      setPdfDescargado(true);
      fetchTrabajoSocial(); // ✅ Si esta función depende de `user`, asegúrate que esté definida con ese contexto
    });

    setProyectoFile(null);
    setSolicitudEnviada(true);

  } catch (err) {
    console.error('Error al enviar proyecto:', err);
    alert('Ocurrió un error al enviar tu plan.');
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

    // Guardar temporalmente el archivo en el array
    const updated = [...actividadesSeguimiento];
    updated[index].archivoTemporalEvidencia = file;
    setActividadesSeguimiento(updated);

    Swal.fire({
      icon: 'success',
      title: 'Evidencia seleccionada',
      text: 'No se ha enviado aún. Presiona el botón "Enviar" para confirmar.',
      timer: 2000,
      showConfirmButton: false
    });

  };

  input.click();
};



useEffect(() => {
  const fetchFacultades = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/facultades', {
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
}, [user]);


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
      const res = await axios.get(`http://localhost:5000/api/usuarios/${usuario_id}/primera-vez`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.primera_vez) {
        Swal.fire({
          title: '¡Bienvenido!',
          text: 'Antes de continuar, debes completar tu perfil.',
          icon: 'info',
          confirmButtonText: 'Aceptar',
          allowOutsideClick: false,
          allowEscapeKey: false
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = '/perfil';
          }
        });
      }
    } catch (err) {
      console.error('Error al verificar primera vez:', err);
    }
  };

  if (usuario_id && token) {
    verificarPrimeraVez();
  }
}, [user]);

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
      const res = await axios.get(`http://localhost:5000/api/estudiantes/datos/usuario/${usuario_id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const estudiante = res.data;
      setFacultadSeleccionada(estudiante.facultad_id);
      setProgramaSeleccionado(estudiante.programa_academico_id);
      setNombreFacultad(estudiante.Facultade?.nombre_facultad || '');
      setNombrePrograma(estudiante.ProgramasAcademico?.nombre_programa || '');
      setNombreCompleto(estudiante.nombre_estudiante);
      setCodigoUniversitario(estudiante.codigo);

      const resProg = await axios.get(`http://localhost:5000/api/programas/facultad/${estudiante.facultad_id}`, {
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
}, [user]);




useEffect(() => {
  const token = user?.token;

  const fetchProgramas = async () => {
    if (!token) return;

    try {
      const res = await axios.get('http://localhost:5000/api/programas', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProgramas(res.data);
    } catch (error) {
      console.error('Error al obtener todos los programas académicos:', error);
    }
  };

  fetchProgramas();
}, [user]);






  useEffect(() => {
    if (docenteSeleccionado && docentes.length > 0) {
      const docente = docentes.find((d) => d.id_docente === docenteSeleccionado);
      setNombreDocente(docente ? docente.nombre_docente : '');
    }
  }, [docenteSeleccionado, docentes]); 

 const fetchTrabajoSocial = async () => {
  const usuario_id = user?.id;
  const token = user?.token;
  if (!usuario_id || !token) return;

  try {
    const res = await axios.get(`http://localhost:5000/api/trabajo-social/usuario/${usuario_id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
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

      const laborEncontrada = labores.find((l) => l.id_labores === res.data.labor_social_id);
      if (laborEncontrada) {
        setNombreLaborSocial(laborEncontrada.nombre_labores);
      }

      setDatosCargados(true);
    }
  } catch (error) {
    console.error('Error al obtener los datos del trabajo social:', error);
  }
};


useEffect(() => {
  fetchTrabajoSocial();
}, [labores]);

  
useEffect(() => {
  const fetchEstadoTrabajoSocial = async () => {
    const usuario_id = user?.id;
    const token = user?.token;

    if (!usuario_id || !token) return;

    try {
      const res = await axios.get(`http://localhost:5000/api/trabajo-social/usuario/${usuario_id}`, {
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

  if (user) {
    fetchEstadoTrabajoSocial();
  }
}, [user]);


useEffect(() => {
  if (programaSeleccionado && token) {
    const fetchDocentes = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/docentes/programa/${programaSeleccionado}`, {
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
}, [programaSeleccionado, token]);

const handleGoToNextSection = () => {
  if (activeSection === 'designacion') {
    if (estadoPlan === 'aceptado') {
      setActiveSection('conformidad');
      window.scrollTo({ top: 0, behavior: 'smooth' }); // 👈 scroll arriba
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
      window.scrollTo({ top: 0, behavior: 'smooth' }); // 👈 scroll arriba
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
      window.scrollTo({ top: 0, behavior: 'smooth' }); // 👈 scroll arriba
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
        const res = await axios.get(`http://localhost:5000/api/labores/linea/${lineaSeleccionada}`, {
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
}, [lineaSeleccionada, token]);
// ✅ incluir `user` como dependencia





const handleSolicitarAprobacion = async () => {
  if (solicitudEnviada) {
    alert('Ya has enviado la solicitud.');
    return;
  }

  const usuario_id = user?.id; // usar desde el contexto

  if (!usuario_id || !user?.token) {
    alert('No se encontró el ID de usuario o token. Inicia sesión nuevamente.');
    return;
  }

  try {
    const datos = {
      usuario_id: parseInt(usuario_id),
      facultad_id: parseInt(facultadSeleccionada),
      programa_academico_id: parseInt(programaSeleccionado),
      docente_id: parseInt(docenteSeleccionado),
      labor_social_id: parseInt(laborSeleccionada),
      tipo_servicio_social: tipoServicio,
      linea_accion_id: parseInt(lineaSeleccionada)
    };

    // 1. Guardar la solicitud principal
    const response = await axios.post('http://localhost:5000/api/trabajo-social', datos, {
      headers: {
        Authorization: `Bearer ${user.token}`
      }
    });

    // 2. Si es grupal, guardar los correos
    if (tipoServicio === 'grupal') {
      const trabajoSocialId = response.data.id;
      if (!trabajoSocialId) {
        console.warn('No se recibió el ID del trabajo social creado.');
        return;
      }

      await axios.post('http://localhost:5000/api/integrantes', {
        trabajo_social_id: trabajoSocialId,
        correos: correosGrupo.filter(c => c.trim() !== '')
      }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });

      console.log('Integrantes del grupo guardados correctamente.');
    }

    setSolicitudEnviada(true);
    setEstadoPlan('pendiente');

    Swal.fire({
      icon: 'success',
      title: 'Solicitud enviada',
      text: 'Tu solicitud ha sido registrada correctamente.',
      showConfirmButton: false,
      timer: 2000
    });

  } catch (error) {
    console.error('Error al enviar solicitud:', error);
    alert('Hubo un error al enviar la solicitud.');
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
  const usuario_id = user?.id; // usar desde el contexto

  if (!usuario_id || !datosCargados || !user?.token) return;

  const obtenerActividades = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/cronograma/${usuario_id}`, {
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
}, [datosCargados, user]);



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


  const camposVacios = camposRequeridos.some(campo => campo.trim() === '') || actividades.length === 0;
  if (camposVacios) {
    Swal.fire({
      icon: 'warning',
      title: 'Campos incompletos',
      text: 'Completa todos los campos del esquema plan y agrega al menos una actividad antes de generar el PDF.',
    });
    return;
  }
  // Validación de duración total del cronograma vs periodo estimado
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
  const altoPagina = doc.internal.pageSize.getHeight(); // <-- ¡Pon esto aquí!

// ...el resto de tu código...

  // Portada
   doc.setFont('times');
  doc.setFontSize(12);
  doc.text('UNIVERSIDAD DE HUÁNUCO', 105, 20, { align: 'center' });
  doc.setFont('times', 'bold');
  doc.setFontSize(14);
  doc.text(`FACULTAD DE ${nombreFacultad.toUpperCase()}`, 105, 30, { align: 'center' });
  doc.setFont('times', 'bold');
  doc.setFontSize(14);

const textoPrograma = `PROGRAMA ACADÉMICO DE ${nombrePrograma.toUpperCase()}`;
const lineas = doc.splitTextToSize(textoPrograma, 160); // Ajusta 160 para que solo salgan 2 líneas máximo

// Asegúrate de imprimir solo 2 líneas (rellena si solo hay una)
if (lineas.length === 1) {
  doc.text(lineas[0], 105, 40, { align: 'center' });
} else {
  doc.text(lineas[0], 105, 40, { align: 'center' });
  doc.text(lineas[1], 105, 47, { align: 'center' });
}


  // Logo
  const logo = await fetch('/images/logonuevo.png')
    .then(res => res.blob())
    .then(blob => new Promise(resolve => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    }));

doc.addImage(logo, 'PNG', 56, 50, 90, 60); // ancho: 70, alto: 60

  doc.setFontSize(16);
  doc.text('PLAN SERVICIO SOCIAL UDH', 105, 120, { align: 'center' });

  // Línea superior
    doc.setLineWidth(0.5); // grosor de la línea
    doc.line(30, 125, 180, 125); // línea recta horizontal

    // Título centrado
    doc.setFontSize(14);
    doc.setFont('times', 'bolditalic');
    doc.text(`"${nombreLaborSocial}"`, 105, 132, { align: 'center' });

    // Línea inferior
    doc.line(30, 137, 180, 137); // línea recta horizontal

    doc.setFontSize(12);

    const yInicial = 155;
    const saltoLinea = 10;
    let yActual = yInicial;

    const escribirCampoa = (label, valor, y) => {
      doc.setFont('times', 'bold');
      doc.text(label, 25, y); // antes era 40
      doc.setFont('times', 'normal');
      doc.text(valor, 80, y); // antes era 95
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

      // Página 2: Solo la introducción centrada
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

// 1. Justificación
doc.text('1. JUSTIFICACIÓN', 20, y);
doc.setFont('times', 'normal');
y += 12; 
const lineasJustificacion = doc.splitTextToSize(justificacion, 170);
doc.text(lineasJustificacion, 20, y);
y += lineasJustificacion.length * 6 + 4;

// 2. Objetivos
doc.setFont('times', 'bold');
doc.text('2. OBJETIVOS', 20, y);
y += 12; // Más separación aquí

// 2.1 Objetivo General
doc.setFont('times', 'bold');
doc.text('2.1 OBJETIVO GENERAL:', 25, y);
doc.setFont('times', 'normal');
y += 6;
const lineasObjGeneral = doc.splitTextToSize(objetivoGeneral, 170);
doc.text(lineasObjGeneral, 25, y);
y += lineasObjGeneral.length * 6 + 4;

// 2.2 Objetivos Específicos
doc.setFont('times', 'bold');
doc.text('2.2 OBJETIVOS ESPECÍFICOS:', 25, y);
doc.setFont('times', 'normal');
y += 6;
const lineasObjEspecificos = doc.splitTextToSize(objetivosEspecificos, 170);

// Verifica si el contenido se sale de la página

const margenInferior = 20; // margen inferior de seguridad
const altoContenido = lineasObjEspecificos.length * 6;

if (y + altoContenido > altoPagina - margenInferior) {
  doc.addPage();
  y = 20; // reinicia la posición Y en la nueva página
}

doc.text(lineasObjEspecificos, 25, y);
y += altoContenido + 4;

// 3. Marco Institucional
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

  // 👇 Aplica salto de página para cualquier subsección si es necesario
  const altoContenido = lineasSub.length * 6;
  const margenInferior = 20;
  if (y + altoContenido > altoPagina - margenInferior) {
    doc.addPage();
    y = 20;
  }
  doc.text(lineasSub, 25, y);
  y += altoContenido + 4;

  // 👇 Si después de escribir, el cursor está muy abajo, agrega página
  if (y > altoPagina - margenInferior) {
    doc.addPage();
    y = 20;
  }
}

// 4. Área de Influencia
doc.setFont('times', 'bold');
doc.text('4. ÁREA DE INFLUENCIA', 20, y);
doc.setFont('times', 'normal');
y += 6;
const lineasArea = doc.splitTextToSize(areaInfluencia, 170);

// 👇 Aplica salto de página si el contenido es muy largo
const altoContenidoArea = lineasArea.length * 6;
if (y + altoContenidoArea > altoPagina - margenInferior) {
  doc.addPage();
  y = 20;
}
doc.text(lineasArea, 20, y);
y += altoContenidoArea + 4;

// 5. Metodología de Intervención
doc.setFont('times', 'bold');
doc.text('5. METODOLOGÍA DE INTERVENCIÓN', 20, y);
doc.setFont('times', 'normal');
y += 6;
const lineasMetodo = doc.splitTextToSize(metodologiaIntervencion, 170);
doc.text(lineasMetodo, 20, y);
y += lineasMetodo.length * 6 + 4;

// 6. Recursos Requeridos
doc.setFont('times', 'bold');
doc.text('6. RECURSOS REQUERIDOS', 20, y);
doc.setFont('times', 'normal');
y += 6;
const lineasRecursos = doc.splitTextToSize(recursosRequeridos, 170);

// 👇 Aplica salto de página si el contenido es muy largo
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

// 👇 Aplica salto de página si el contenido es muy largo
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

// Tabla ocupando todo el ancho
autoTable(doc, {
  startY: 90,
  margin: { left: 25, right: 25 }, // Márgenes laterales más amplios
  tableWidth: 'wrap', // Ajusta la tabla al contenido
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
    0: { halign: 'left', cellWidth: 60 },  // Actividad
    1: { halign: 'left', cellWidth: 60 },  // Justificación
    2: { halign: 'center', cellWidth: 32 },// Fecha Estimada
    3: { halign: 'center', cellWidth: 32 },// Fecha Fin
    4: { halign: 'left', cellWidth: 60 },  // Resultados Esperados
  }
});



doc.addPage('a4', 'portrait');
// Página nueva para ANEXOS


// Título "ANEXOS" centrado y grande
doc.setFont('times', 'bold');
doc.setFontSize(40); // Tamaño grande
doc.text('ANEXOS', 105, 150, { align: 'center' }); // Centrado vertical y horizontal


  // Descargar
 const pdfBlob = doc.output('blob');
const anexos = [
  imagenesAnexos.cartaAceptacion,
  imagenesAnexos.datosContacto,
  imagenesAnexos.organigrama,
  imagenesAnexos.documentosAdicionales
];

const mergedBlob = await mergePDFs(pdfBlob, anexos);

// Mostrar y guardar
const url = URL.createObjectURL(mergedBlob);
const archivoFinal = new File([mergedBlob], 'esquema-plan-con-anexos.pdf', { type: 'application/pdf' });

setPdfGenerado(url);
setProyectoFile(archivoFinal);
setPdfDescargado(true);

const link = document.createElement('a');
link.href = url;
link.download = 'esquema-plan-con-anexos.pdf';
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
    // Obtener trabajo social del alumno
    const { data } = await axios.get(`http://localhost:5000/api/trabajo-social/usuario/${usuario_id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const trabajoId = data.id;
    if (!trabajoId) {
      throw new Error("No se encontró el ID del trabajo social.");
    }

    // Solicitar carta de término
    await axios.patch(`http://localhost:5000/api/trabajo-social/${trabajoId}/solicitar-carta-termino`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });

    setEstadoSolicitudTermino('solicitada');

    Swal.fire({
      icon: 'success',
      title: 'Solicitud enviada',
      text: 'Tu carta de término ha sido solicitada correctamente.',
      timer: 2000,
      showConfirmButton: false
    });

  } catch (error) {
    console.error('Error al solicitar carta:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un problema al solicitar la carta de término.'
    });
  }
};


useEffect(() => {
  const usuarioId = user?.id;
  const token = user?.token;

  if (!usuarioId || !token) return;

  const fetchPlan = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/trabajo-social/usuario/${usuarioId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPlanSeleccionado(res.data);
    } catch (err) {
      console.error('Error al obtener plan:', err);
    }
  };

  fetchPlan();
}, [user]);

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
      {Array.from(
        activeSection === 'seguimiento'
          ? 'Seguimiento del Servicio Social'
          : activeSection === 'conformidad'
          ? 'Conformidad De Servicio Social'
          : activeSection === 'informe-final'
          ? 'Informe Final'
          : 'Servicio Social UDH'
      ).map((letra, index) => (
        <span key={index} style={{ animationDelay: `${index * 0.05}s` }}>
          {letra === ' ' ? '\u00A0' : letra}
        </span>
      ))}
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
  {/* Botón ANTERIOR */}
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

  {/* Botón SIGUIENTE */}
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

     

{modalObservacionEstudianteVisible && (
  <div className="modal-observacion-overlay">
    <div className="modal-observacion-content">
      <h3 style={{ marginBottom: '10px' }}>Observaciónes del Docente</h3>
      <p style={{ color: '#4A5568' }}>{observacionSeleccionada}</p>
      <div className="modal-observacion-actions">
        <button
          className="modal-observacion-btn-cancelar"
          onClick={() => setModalObservacionEstudianteVisible(false)}
        >
          Cerrar
        </button>
      </div>
    </div>
  </div>
)}

  {modalActividadVisible && (
  <div className="modal-overlay-alumno">
    <div className="modal-content-alumno">
      <h3>Agregar Actividad</h3>

      <div className="form-group">
        <label className="bold-text">Actividad</label>
        <input
        type="text"
        className="input-estilo-select"
        style={{ width: '100%' }}  // 👈 Añade esto
        value={nuevaActividad}
        onChange={(e) => setNuevaActividad(e.target.value)}
        placeholder="Ingrese nombre de la actividad"
      />
      </div>
      <div className="form-group">
  <label className="bold-text">Justificación</label>
  <textarea
    className="input-estilo-select"
    value={nuevaJustificacion}
    onChange={(e) => setNuevaJustificacion(e.target.value)}
    placeholder="Describa aquí..."
  />
</div>

      <div className="form-group">
        <label className="bold-text">Fecha Estimada</label>
        <input
          type="date"
          className="input-estilo-select"
          value={nuevaFecha}
          onChange={(e) => setNuevaFecha(e.target.value)}
        />
      </div>
<div className="form-group">
  <label className="bold-text">Fecha Fin</label>
  <input
    type="date"
    className="input-estilo-select"
    value={nuevaFechaFin}
    onChange={(e) => setNuevaFechaFin(e.target.value)}
  />
</div>
      <div className="form-group">
  <label className="bold-text">Resultados Esperados</label>
  <textarea
    className="input-estilo-select"
    value={nuevosResultados}
    onChange={(e) => setNuevosResultados(e.target.value)}
    placeholder="Describa aquí los resultados..."
  />
</div>

      <div className="modal-actions-alumno">
        <button
      onClick={async () => {
      if (nuevaActividad.trim() === '' || nuevaFecha.trim() === '') {
        await Swal.fire({
          icon: 'warning',
          title: 'Campos incompletos',
          text: 'Completa todos los campos obligatorios antes de guardar.',
          confirmButtonText: 'Aceptar'
        });
        return;
      }

      const fechaInicio = new Date(nuevaFecha);
      const fechaFin = new Date(nuevaFechaFin);

      if (nuevaFechaFin.trim() !== '') {
        const diferenciaMs = fechaFin - fechaInicio;
        const diasDiferencia = diferenciaMs / (1000 * 60 * 60 * 24);

         if (diasDiferencia > 30) {
      await Swal.fire({
        icon: 'error',
        title: 'Duración excedida',
        text: 'Cada actividad puede durar como máximo 30 días.',
        confirmButtonText: 'Entendido'
        });
        return;
      }

      if (diasDiferencia < 0) {
        await Swal.fire({
          icon: 'error',
          title: 'Fechas inválidas',
          text: 'La fecha fin no puede ser anterior a la fecha de inicio.',
          confirmButtonText: 'Corregir'
        });
        return;
      }
    }

    const nuevaFila = {
      actividad: nuevaActividad,
      fecha: nuevaFecha,
      fechaFin: nuevaFechaFin,
      justificacion: nuevaJustificacion,
      resultados: nuevosResultados, // nuevo campo
    };
    

    if (editIndex !== null) {
      // Editar
      const copia = [...actividades];
      copia[editIndex] = nuevaFila;
      setActividades(copia);
    } else {
      // Agregar nuevo
      setActividades([...actividades, nuevaFila]);
    }

    // Resetear todo
   setNuevaActividad('');
    setNuevaFecha('');
    setNuevaFechaFin('');
    setNuevosResultados('');
    setNuevaJustificacion('');
    setEditIndex(null);
    setModalActividadVisible(false);
    
  }}
>
  Guardar
</button>
        <button onClick={() => setModalActividadVisible(false)}>Cancelar</button>
        
      </div>
    </div>
  </div>
)}

{modalGrupoVisible && (
  <div className="modal-grupo-elegante-overlay">
    <div className="modal-grupo-elegante-content">
      <h3 className="modal-grupo-elegante-title">Integrantes del Grupo</h3>

      {solicitudEnviada ? (
        <ul className="lista-integrantes">
        {integrantesGrupoAlumno.length > 0 ? (
          integrantesGrupoAlumno.map((integrante, index) => (
            <li key={index}>{integrante.correo_institucional}</li>
          ))
        ) : (
          <li>No hay integrantes registrados.</li>
        )}
      </ul>

      ) : (
        correosGrupo.map((correo, index) => (
          <div className="modal-grupo-elegante-field" key={index}>
            <label className="modal-grupo-elegante-label">
              Correo institucional #{index + 1}
            </label>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="text"
                className="modal-grupo-elegante-input"
                placeholder="Ingrese el Código Universitario"
                value={correo.replace('@udh.edu.pe', '')}
                onChange={(e) => {
                  const input = e.target.value.replace(/\D/g, '');
                  if (input.length <= 10) {
                    const nuevos = [...correosGrupo];
                    nuevos[index] = input.length === 10 ? `${input}@udh.edu.pe` : input;
                    setCorreosGrupo(nuevos);
                  }
                }}
                onBlur={() => {
                  const codigo = correo.replace('@udh.edu.pe', '');
                  if (codigo.length > 0 && codigo.length < 10) {
                    Swal.fire({
                      icon: 'warning',
                      title: 'Código incompleto',
                      text: 'El código debe tener exactamente 10 dígitos.',
                      confirmButtonColor: '#3085d6',
                      confirmButtonText: 'Entendido'
                    });
                  }
                }}
              />
              <span style={{ marginLeft: '6px', fontSize: '14px', color: '#555' }}>
                @udh.edu.pe
              </span>
            </div>
          </div>
        ))
      )}

      <div
        className="modal-grupo-elegante-actions"
        style={{
          justifyContent:
            solicitudEnviada || correosGrupo.length >= 10 ? 'center' : 'space-between',
          display: 'flex',
          gap: '10px'
        }}
      >
        {!solicitudEnviada && correosGrupo.length < 10 && (
          <button
            onClick={() => {
              if (correosGrupo.length >= 10) {
                Swal.fire({
                  icon: 'warning',
                  title: 'Límite alcanzado',
                  text: 'Solo se permiten hasta 4 integrantes en el grupo.',
                  confirmButtonColor: '#3085d6',
                  confirmButtonText: 'Entendido'
                });
              } else {
                setCorreosGrupo([...correosGrupo, '']);
              }
            }}
            className="modal-grupo-elegante-btn agregar"
          >
            + Agregar otro
          </button>
        )}

        <button
          onClick={() => {
            if (!solicitudEnviada) {
              const filtrados = correosGrupo.filter((correo) => {
                const codigo = correo.replace('@udh.edu.pe', '');
                return codigo.length === 10;
              });
              setCorreosGrupo(filtrados);
            }
            setModalGrupoVisible(false);
          }}
          className="modal-grupo-elegante-btn aceptar"
        >
          Cerrar
        </button>
      </div>
    </div>
  </div>
)}


{modalVisible && (
  <div className="modal-evidencia-overlay">
    <div className="modal-evidencia-content">
      <img src={imagenModal} alt="Evidencia" className="modal-evidencia-image" />
      <button
        onClick={() => setModalVisible(false)}
        className="btn-cerrar-modal-cronogramasss"
      >
        Cerrar
      </button>
    </div>
  </div>
)}


{modalProyectoVisible && (
  <div className="modal-overlay-alumno">
    <div className="modal-content-alumno">
      <h3>Subir Proyecto</h3>
      <input type="file" accept="application/pdf" onChange={handleProyectoFileChange} />
      {proyectoFile && <p>Archivo seleccionado: {proyectoFile.name}</p>}

      {/* Mostrar el archivo PDF generado si está disponible */}
      {pdfGenerado && (
        <div>
          <h4>PDF Generado</h4>
          <a href={pdfGenerado} target="_blank" rel="noopener noreferrer">
            Ver PDF generado
          </a>
        </div>
      )}

      <div className="modal-actions-alumno">
        <button onClick={() => setModalProyectoVisible(false)}>Aceptar</button>
        <button onClick={() => {
          setProyectoFile(null);
          cerrarModalProyecto();
        }}>Cancelar</button>
      </div>
    </div>
  </div>
)}

    </>
    
  );
  
}
export default DashboardAlumno;

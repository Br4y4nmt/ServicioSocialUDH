import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useUser } from '../../UserContext';
import { useWelcomeToast } from '../alerts/useWelcomeToast';
import { useFormularioPlan } from '../alumno/useFormularioPlan';
import { useGrupoAlumno } from '../alumno/useGrupoAlumno';
import { useActividadesCronograma } from '../alumno/useActividadesCronograma';
import { generarPlanServicioSocialPDF } from '../../services/planPdfService';
import {
  alertInfo,
  alertSuccess,
  alertWarning,
  mostrarAlertaCompletarPerfilPrimeraVez,
  alertError
} from '../alerts/alertas';

export function useDashboardAlumno() {
  const { user } = useUser();
  const formularioPlan = useFormularioPlan();
  const formularioPlanRef = useRef(formularioPlan);

  useEffect(() => {
    formularioPlanRef.current = formularioPlan;
  }, [formularioPlan]);
  const grupoAlumno = useGrupoAlumno();
  const [datosCargados, setDatosCargados] = useState(false);
  const [activeSection, setActiveSection] = useState(() => {
    return localStorage.getItem('activeSectionAlumno') || 'designacion';
  });
  const actividadesCronograma = useActividadesCronograma({ datosCargados, activeSection });
  const [collapsed, setCollapsed] = useState(() => window.innerWidth <= 768);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 768);
  

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
  const [lineas, setLineas] = useState([]);
  const [estadoConformidad, setEstadoConformidad] = useState('');
  const [estadoSolicitudTermino, setEstadoSolicitudTermino] = useState('no_solicitada');
  const [lineaSeleccionada, setLineaSeleccionada] = useState('');
  const [facultadSeleccionada, setFacultadSeleccionada] = useState('');
  const [nombreFacultad, setNombreFacultad] = useState('');
  const [nombrePrograma, setNombrePrograma] = useState('');
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [codigoUniversitario, setCodigoUniversitario] = useState('');
  const [tipoServicio, setTipoServicio] = useState('');
  const [nombreDocente, setNombreDocente] = useState('');
  const [modalProyectoVisible, setModalProyectoVisible] = useState(false);
  const [proyectoFile, setProyectoFile] = useState(null);
  const [pdfGenerado, setPdfGenerado] = useState(null);
  const [pdfDescargado, setPdfDescargado] = useState(false);
  const [imagenModal, setImagenModal] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalObservacionEstudianteVisible, setModalObservacionEstudianteVisible] = useState(false);
  const [observacionSeleccionada, setObservacionSeleccionada] = useState('');

  const toastWarning = useCallback((mensaje) => {
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
  }, []);

  useWelcomeToast();

  const toggleSidebar = useCallback(() => {
    setCollapsed(prev => !prev);
  }, []);

  const abrirModalProyecto = useCallback(() => setModalProyectoVisible(true), []);
  const cerrarModalProyecto = useCallback(() => {
    setProyectoFile(null);
    setModalProyectoVisible(false);
  }, []);

  const handleProyectoFileChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setProyectoFile(file);
    } else {
      alert('Por favor selecciona un archivo PDF válido.');
    }
  }, []);

  const handleFileChange = useCallback((e, tipo) => {
    const archivo = e.target.files[0];
    if (archivo) {
      formularioPlan.setImagenesAnexos(prevState => ({
        ...prevState,
        [tipo]: archivo
      }));
      if (tipo === 'cartaAceptacion') {
        setCartaAceptacionPdf(archivo);
      }
    }
  }, [formularioPlan]);

  const handleVolverASubir = useCallback(async (actividad) => {
    const success = await actividadesCronograma.handleVolverASubir(actividad);
    if (success) setModalObservacionEstudianteVisible(false);
  }, [actividadesCronograma]);


  useEffect(() => {
    const nombreUsuario = localStorage.getItem('nombre_usuario') || 'NOMBRE DEL ALUMNO';
    const codigo = localStorage.getItem('codigo_estudiante') || '';
    setNombre(nombreUsuario);
    setNombreCompleto(nombreUsuario);
    setCodigoUniversitario(codigo);
  }, []);

  useEffect(() => {
    localStorage.setItem('activeSectionAlumno', activeSection);
  }, [activeSection]);

  useEffect(() => {
    if (activeSection !== 'designacion' || !user?.token) return;
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
    fetchLineas();
  }, [user?.token, activeSection]);

  useEffect(() => {
    if (activeSection !== 'designacion' || !user?.token || !facultadSeleccionada) return;
    const fetchProgramas = async () => {
      try {
        const res = await axios.get(`/api/programas/facultad/${facultadSeleccionada}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setProgramas(res.data);
      } catch (error) {
        console.error('Error al obtener programas:', error);
      }
    };
    fetchProgramas();
  }, [activeSection, facultadSeleccionada, user?.token]);

  useEffect(() => {
    if (activeSection !== 'designacion' || !user?.token) return;
    const fetchFacultades = async () => {
      try {
        const res = await axios.get('/api/facultades', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setFacultades(res.data);
      } catch (error) {
        console.error('Error al obtener facultades:', error);
      }
    };
    fetchFacultades();
  }, [user?.token, activeSection]);

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
    const usuario_id = user?.id;
    const token = user?.token;
    if (!usuario_id || !token) return;

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
    verificarPrimeraVez();
  }, [user?.id, user?.token]);

  useEffect(() => {
    const usuario_id = user?.id;
    const token = user?.token;
    if (!usuario_id || !token) return;

    const fetchDatosEstudiante = async () => {
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
      } catch (error) {
        console.error('Error al obtener datos del estudiante:', error);
      }
    };
    fetchDatosEstudiante();
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
      formularioPlanRef.current?.setLineaAccion(plan.linea_accion || '');

      if (plan.archivo_plan_social) setArchivoYaEnviado(true);

      setDatosCargados(true);
    } catch (error) {
      console.error('Error al obtener los datos del trabajo social:', error);
    }
  }, [user?.id, user?.token]);

  useEffect(() => {
    fetchTrabajoSocial();
  }, [fetchTrabajoSocial]);

  useEffect(() => {
    if (labores.length > 0 && laborSeleccionada) {
      const laborEncontrada = labores.find(l => l.id_labores === parseInt(laborSeleccionada));
      if (laborEncontrada) setNombreLaborSocial(laborEncontrada.nombre_labores);
    }
  }, [labores, laborSeleccionada]);

  useEffect(() => {
    if (activeSection !== 'designacion') return;
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
  }, [programaSeleccionado, user?.token, activeSection]);

  useEffect(() => {
    if (activeSection !== 'designacion') return;
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
  }, [lineaSeleccionada, user?.token, activeSection]);

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



  const handleSolicitarRevision = useCallback(async () => {
    const usuario_id = user?.id;
    const token = user?.token;

    if (!usuario_id || !token) {
      await alertError('Sesión inválida', 'Tu sesión ha expirado o no es válida. Por favor inicia sesión de nuevo.');
      return;
    }
    if (!proyectoFile) {
      await alertWarning('Archivo no seleccionado', 'Por favor selecciona un archivo PDF antes de enviar.');
      return;
    }

    try {
      await axios.post(
        `/api/cronograma/${usuario_id}`,
        { actividades: actividadesCronograma.actividades },
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

      await alertSuccess('Solicitud enviada', 'Tu solicitud ha sido enviada correctamente.');
      setArchivoYaEnviado(true);
      setPdfDescargado(true);
      fetchTrabajoSocial();

      setProyectoFile(null);
      setSolicitudEnviada(true);

      // pequeña recarga para asegurar que la vista refleje los cambios inmediatamente
      setTimeout(() => {
        try { window.location.reload(); } catch (e) { /* noop */ }
      }, 800);
    } catch (err) {
      console.error('Error al enviar proyecto:', err);
      const mensaje = err.response?.data?.message;
      await alertError('Error al enviar proyecto', mensaje || 'Inténtalo más tarde.');
    }
  }, [user?.id, user?.token, proyectoFile, actividadesCronograma.actividades, fetchTrabajoSocial]);

  const handleGoToNextSection = useCallback(() => {
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
      if (actividadesCronograma.todasAprobadas && estadoSolicitudTermino === 'aprobada') {
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
  }, [activeSection, estadoPlan, estadoConformidad, estadoSolicitudTermino, actividadesCronograma.todasAprobadas]);

  const handleSolicitarAprobacion = useCallback(async () => {
    if (solicitudEnviada) {
      await alertInfo('Solicitud ya enviada', 'Ya has enviado una solicitud anteriormente.');
      return;
    }

    const usuario_id = user?.id;
    const token = user?.token;

    if (!usuario_id || !token) {
      await alertError('Sesión inválida', 'Tu sesión ha expirado o no es válida. Por favor inicia sesión de nuevo.');
      return;
    }

    try {
      const correosValidos =
        tipoServicio === "grupal"
          ? (grupoAlumno.correosGrupo || [])
              .map((c) => String(c || "").trim().toLowerCase())
              .filter((c) => /^\d{10}@udh\.edu\.pe$/.test(c))
          : [];

      if (tipoServicio === "grupal" && correosValidos.length < 1) {
        await alertWarning('Faltan integrantes', 'Agrega al menos un integrante para servicios grupales.');
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
      alertSuccess('Solicitud enviada', 'Tu solicitud ha sido enviada correctamente.');
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
        grupoAlumno.setCorreosGrupo((prev) =>
          prev.filter(
            (c) => !data.duplicados.includes(String(c).trim().toLowerCase())
          )
        );
        return;
      }

      const backendMessage = data?.message;
      await alertError('Error al enviar solicitud', backendMessage || 'Error al enviar solicitud');
    }
  }, [
    solicitudEnviada, user?.id, user?.token, tipoServicio,
    grupoAlumno, facultadSeleccionada, programaSeleccionado,
    docenteSeleccionado, laborSeleccionada, lineaSeleccionada, toastWarning
  ]);

  const handleGenerarPDF = useCallback(async () => {
    const result = await generarPlanServicioSocialPDF({
      imagenesAnexos: formularioPlan.imagenesAnexos,
      actividades: actividadesCronograma.actividades,
      nombreInstitucion: formularioPlan.nombreInstitucion,
      nombreResponsable: formularioPlan.nombreResponsable,
      lineaAccion: formularioPlan.lineaAccion,
      fechaPresentacion: formularioPlan.fechaPresentacion,
      periodoEstimado: formularioPlan.periodoEstimado,
      introduccion: formularioPlan.introduccion,
      justificacion: formularioPlan.justificacion,
      objetivoGeneral: formularioPlan.objetivoGeneral,
      objetivosEspecificos: formularioPlan.objetivosEspecificos,
      nombreEntidad: formularioPlan.nombreEntidad,
      misionVision: formularioPlan.misionVision,
      areasIntervencion: formularioPlan.areasIntervencion,
      ubicacionPoblacion: formularioPlan.ubicacionPoblacion,
      areaInfluencia: formularioPlan.areaInfluencia,
      metodologiaIntervencion: formularioPlan.metodologiaIntervencion,
      recursosRequeridos: formularioPlan.recursosRequeridos,
      resultadosEsperados: formularioPlan.resultadosEsperados,
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
  }, [
    formularioPlan, actividadesCronograma.actividades,
    nombreFacultad, nombrePrograma, nombreLaborSocial,
    nombreCompleto, codigoUniversitario
  ]);

  const solicitarCartaTermino = useCallback(async () => {
    const token = user?.token;
    const trabajoId = planSeleccionado?.id;

    if (!token || !trabajoId) {
      await alertError('Solicitud inválida', 'No se pudo solicitar la carta de término. Inténtalo más tarde.');
      return;
    }

    try {
      await axios.patch(
        `/api/trabajo-social/${trabajoId}/solicitar-carta-termino`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEstadoSolicitudTermino('solicitada');
      await alertSuccess('Solicitud enviada', 'La solicitud de carta de término fue enviada correctamente.');
    } catch (error) {
      console.error('Error al solicitar carta:', error);
      const backendMessage = error.response?.data?.message;
      await alertError('Error al solicitar carta', backendMessage || 'Inténtalo más tarde.');
    }
  }, [user?.token, planSeleccionado?.id]);

  return {

    user,
    collapsed,
    isMobile,
    toggleSidebar,
    activeSection,
    setActiveSection,
    nombre,
    formularioPlan,
    grupoAlumno,
    actividadesCronograma,
    programas,
    programaSeleccionado,
    docentes,
    labores,
    docenteSeleccionado, setDocenteSeleccionado,
    solicitudEnviada,
    laborSeleccionada, setLaborSeleccionada,
    estadoPlan,
    cartaAceptacionPdf, setCartaAceptacionPdf,
    planSeleccionado, setPlanSeleccionado,
    nombreLaborSocial, setNombreLaborSocial,
    lineas,
    estadoConformidad,
    estadoSolicitudTermino,
    lineaSeleccionada, setLineaSeleccionada,
    facultadSeleccionada,
    nombreFacultad,
    nombrePrograma,
    nombreCompleto,
    codigoUniversitario,
    tipoServicio, setTipoServicio,
    nombreDocente, setNombreDocente,
    archivoYaEnviado,
    modalProyectoVisible, setModalProyectoVisible,
    proyectoFile, setProyectoFile,
    pdfGenerado,
    pdfDescargado,
    imagenModal, setImagenModal,
    modalVisible, setModalVisible,
    modalObservacionEstudianteVisible, setModalObservacionEstudianteVisible,
    observacionSeleccionada, setObservacionSeleccionada,
    handleFileChange,
    abrirModalProyecto,
    cerrarModalProyecto,
    handleProyectoFileChange,
    handleSolicitarRevision,
    handleGoToNextSection,
    handleSolicitarAprobacion,
    handleGenerarPDF,
    solicitarCartaTermino,
    handleVolverASubir,
  };
}

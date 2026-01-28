import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import SidebarGestor from './SidebarGestor';
import Header from '../components/Header';
import ImpersonateLogin from './ImpersonateLogin';
import CambiosTiempo from './CambiosTiempo';
import CambioAsesor from "./CambioAsesor"; 
import Dasborasd  from "./Dashboard";
import FacultadNuevoModal from "./modals/FacultadNuevoModal";
import ProgramaNuevoModal from "./modals/ProgramaNuevoModal"; 
import DocenteNuevoModal from "./modals/DocenteNuevoModal";
import FacultadEditarModal from "./modals/FacultadEditarModal";
import ProgramaEditarModal from "./modals/ProgramaEditarModal";
import EstudianteNuevoModal from "./modals/EstudianteNuevoModal";
import LaborNuevoModal from "./modals/LaborNuevoModal";
import LineaEditarModal from "./modals/LineaEditarModal";
import LineaNuevoModal from "./modals/LineaNuevoModal";
import LaborEditarModal from "./modals/LaborEditarModal";
import DocenteEditarModal from "./modals/DocenteEditarModal";
import SeguimientoModal from "./modals/SeguimientoModal";
import { pdf } from '@react-pdf/renderer';
import QRCode from 'qrcode';
import EditIcon from "../hooks/componentes/Icons/EditIcon";
import DeleteIcon from "../hooks/componentes/Icons/DeleteIcon";
import VerBoton from "../hooks/componentes/VerBoton";
import InformePDF from '../components/InformefinalProgramaPDF';
import './DashboardGestor.css';
import EstudiantesConcluidos from './EstudiantesConcluidos';
import { useUser } from '../UserContext';
import {
  confirmarEliminacionDesignacionSupervisor,
  mostrarExitoEliminacionDesignacionSupervisor,
  mostrarErrorEliminacionDesignacionSupervisor,
  mostrarAlertaIntegrantesNoDisponibles,
  mostrarAlertaErrorConexionUDH,
  mostrarExitoInformeAprobado,
  mostrarErrorProcesarInforme,
  confirmarEliminarLinea,
  mostrarLineaEliminada,
  mostrarErrorEliminarLinea,
  mostrarAlertaCamposIncompletosPrograma,
  mostrarAlertaCorreoProgramaInvalido,
  mostrarAlertaWhatsappProgramaInvalido,
  mostrarAlertaProgramaCreado,
  mostrarAlertaCorreoProgramaDuplicado,
  mostrarAlertaErrorPrograma400,
  mostrarAlertaErrorProgramaDesconocido,
  confirmarEliminarPrograma,
  mostrarAlertaProgramaEliminado,
  mostrarAlertaErrorEliminarPrograma,
  mostrarAlertaWhatsappInvalido,
  mostrarAlertaFaltanCamposDocente,
  mostrarAlertaDocenteRegistrado,
  mostrarAlertaCorreoDuplicadoDocente,
  mostrarErrorRegistrarDocente,
  mostrarAlertaCamposIncompletosProgramaEdicion,
  mostrarAlertaCorreoInvalidoPrograma,
  mostrarAlertaProgramaActualizado,
  mostrarAlertaErrorActualizarPrograma,
  confirmarEliminarDocente,
  mostrarDocenteEliminado,
  mostrarErrorEliminarDocente,
  mostrarDocenteActualizado,
  mostrarErrorCorreoDuplicadoAlActualizarDocente,
  mostrarErrorActualizarDocente,
  confirmarEliminarLabor,
  mostrarLaborEliminada,
  mostrarErrorEliminarLabor,
  confirmarEliminarFacultad,
  mostrarFacultadEliminada,
  mostrarErrorEliminarFacultad,
} from "../hooks/alerts/alertas";


function DashboardGestor() {
  const [programas, setProgramas] = useState([]);
  const [modalNuevaFacultadVisible, setModalNuevaFacultadVisible] = useState(false);
  const [programaSeleccionado, setProgramaSeleccionado] = useState('');
  const [nuevoPrograma, setNuevoPrograma] = useState('');
  const [editandoId, setEditandoId] = useState(null);
  const [nombreEditado, setNombreEditado] = useState('');
  const [modalProgramaVisible, setModalProgramaVisible] = useState(false);
  const [docentes, setDocentes] = useState([]);
  const [emailPrograma, setEmailPrograma] = useState('');
  const [modalLaborVisible, setModalLaborVisible] = useState(false);
  const [modalEditarLaborVisible, setModalEditarLaborVisible] = useState(false);
  const [idLaborEditando, setIdLaborEditando] = useState(null);  
  const [busquedaDocente, setBusquedaDocente] = useState('');
  const [modalDocenteVisible, setModalDocenteVisible] = useState(false);
  const [nuevoDocenteEmail, setNuevoDocenteEmail] = useState('');
  const [whatsappPrograma, setWhatsappPrograma] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [, setNuevoDocenteDni] = useState('');
  const [emailDocenteEditado, setEmailDocenteEditado] = useState('');
  const [aprobandoId, setAprobandoId] = useState(null);
  const [nuevaFacultadDocente, setNuevaFacultadDocente] = useState('');
  const [nuevoProgramaDocente, setNuevoProgramaDocente] = useState('');
  const [nuevoDocenteWhatsapp, setNuevoDocenteWhatsapp] = useState('');
  const [editandoDocenteId, setEditandoDocenteId] = useState(null);
  const [nombreDocenteEditado, setNombreDocenteEditado] = useState('');
  const [programaDocenteEditado, setProgramaDocenteEditado] = useState('');
  const [busquedaLabor, setBusquedaLabor] = useState('');
  const [modalEditarDocenteVisible, setModalEditarDocenteVisible] = useState(false);
  const [facultadDocenteEditada, setFacultadDocenteEditada] = useState('');
  const [busquedaPrograma, setBusquedaPrograma] = useState('');
  const [busquedaFacultad, setBusquedaFacultad] = useState('');
  const [modalEditarProgramaVisible, setModalEditarProgramaVisible] = useState(false);
  const [idEditandoPrograma, setIdEditandoPrograma] = useState(null);
  const [facultadEditada, setFacultadEditada] = useState('');
  const [programaEditado, setProgramaEditado] = useState('');
  const [facultadPrograma, setFacultadPrograma] = useState('');
  const [modalEditarVisible, setModalEditarVisible] = useState(false);
  const [labores, setLabores] = useState([]);
  const [nuevaLabor, setNuevaLabor] = useState('');
  const [emailEditado, setEmailEditado] = useState('');
  const [editandoLaborId, setEditandoLaborId] = useState(null);
  const [nombreLaborEditado, setNombreLaborEditado] = useState('');
  const [collapsed, setCollapsed] = useState(false);
  const [lineaLabor, setLineaLabor] = useState('');
  const [modalEstudianteVisible, setModalEstudianteVisible] = useState(false);
  const [codigoUniversitario, setCodigoUniversitario] = useState('');
  const [activeSection, setActiveSection] = useState('facultades');
  const [facultades, setFacultades] = useState([]);
  const [nuevaFacultad, setNuevaFacultad] = useState('');
  const [lineas, setLineas] = useState([]);
  const [modalSeguimientoVisible, setModalSeguimientoVisible] = useState(false);
  const [seguimiento, setSeguimiento] = useState(null);
  const [nuevaLinea, setNuevaLinea] = useState('');
  const [busquedaLinea, setBusquedaLinea] = useState('');
  const [modalLineaVisible, setModalLineaVisible] = useState(false);
  const [modalEditarLineaVisible, setModalEditarLineaVisible] = useState(false);
  const [idEditandoLinea, setIdEditandoLinea] = useState(null);
  const [nombreLineaEditado, setNombreLineaEditado] = useState('');
  const [informesFinales, setInformesFinales] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [busquedaSupervisor, setBusquedaSupervisor] = useState('');
  const [programaSupervisor, setProgramaSupervisor] = useState('');
  const [filtroEstudiantes, setFiltroEstudiantes] = useState('');
  const [supervisores, setSupervisores] = useState([]);
  const { user } = useUser();
  const token = user?.token;

const eliminarSupervisor = async (id) => {
  const confirmacion = await confirmarEliminacionDesignacionSupervisor();
  if (!confirmacion.isConfirmed) return;

  try {
    await axios.delete(`/api/trabajo-social/seleccionado/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    await fetchSupervisores();

    await mostrarExitoEliminacionDesignacionSupervisor();
  } catch (error) {
    console.error('Error al eliminar designación:', error);

    const mensaje = error.response?.data?.message || 'No se pudo eliminar la designación.';
    await mostrarErrorEliminacionDesignacionSupervisor(mensaje);
  }
};

  const toggleSidebar = () => {
    setCollapsed(prev => !prev);
  };

const fetchEstudiantes = useCallback(async () => {
  if (!token) return;
  try {
    const res = await axios.get("/api/estudiantes", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setEstudiantes(res.data);
  } catch (error) {
    console.error("Error al obtener estudiantes:", error);
  }
}, [token]);

useEffect(() => {
  fetchEstudiantes();
}, [fetchEstudiantes]);


const aceptarInforme = async (id) => {

   if (aprobandoId === id) return; 

  setAprobandoId(id);
  try {
    const informe = informesFinales.find((i) => i.id === id);
    if (!informe) {
      console.warn('Informe no encontrado para el ID:', id);
      return;
    }

    const tipoServicio = (
      informe.trabajo_social?.tipo_servicio_social ||
      informe.tipo_servicio_social ||
      null
    );

    const trabajoId = informe.trabajo_social_id || informe.id;

    if (tipoServicio === 'grupal') {
      let estudiantes = [];

      try {
        const response = await axios.get(`/api/integrantes/${trabajoId}/enriquecido`, {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 7000
        });

        estudiantes = response.data;

        if (!Array.isArray(estudiantes) || estudiantes.length === 0) {
          await mostrarAlertaIntegrantesNoDisponibles();
          return;
        }

      } catch (error) {
        console.error('Error al conectar con API UDH:', error);
        await mostrarAlertaErrorConexionUDH();
        return; 
      }

      for (const estudiante of estudiantes) {
        try {
          const nombreEstudiante = estudiante.nombre_completo;
          const codigo = estudiante.codigo_universitario;
          const correoPrincipal = informe.trabajo_social?.correo_institucional || informe.correo_institucional;

          if (estudiante.correo_institucional === correoPrincipal) {
            console.log(`⏩ Saltando estudiante principal: ${correoPrincipal}`);
            continue;
          }

          const informePersonalizado = {
            ...informe,
            Estudiante: { nombre_estudiante: nombreEstudiante },
            ProgramasAcademico: {
              ...informe.ProgramasAcademico,
              Facultade: {
                nombre_facultad: estudiante.facultad,
              },
            },
          };

          const verificationUrlMiembro =
            `${process.env.REACT_APP_API_URL}/api/certificados-final/${trabajoId}/${codigo}`; 
          const qrMiembro = await QRCode.toDataURL(verificationUrlMiembro);

          const blob = await pdf(
            <InformePDF
              informe={informePersonalizado}
              qrImage={qrMiembro}
              verificationUrl={verificationUrlMiembro}
            />
          ).toBlob();


          const formData = new FormData();
          formData.append('archivo', blob, `certificado_final_${codigo}.pdf`);
          formData.append('trabajo_id', trabajoId);
          formData.append('codigo_universitario', codigo);

          await axios.post('/api/certificados-final', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`,
            },
          });

          console.log(`Certificado generado para integrante: ${codigo}`);
        } catch (err) {
          console.error(`Error generando certificado para integrante:`, err);
        }
      }
    }

    const nombreEstudiantePrincipal = informe.Estudiante?.nombre_estudiante || 'Estudiante';
    const nombreFacultad = informe.ProgramasAcademico?.Facultade?.nombre_facultad || 'Facultad';
    const verificationUrl =
    `${process.env.REACT_APP_API_URL}/api/trabajo-social/certificado-final/${id}`;
    const qrDataUrl = await QRCode.toDataURL(verificationUrl);

    const informePrincipal = {
      ...informe,
      Estudiante: { nombre_estudiante: nombreEstudiantePrincipal },
      ProgramasAcademico: {
        ...informe.ProgramasAcademico,
        Facultade: {
          nombre_facultad: nombreFacultad,
        },
      },
    };

    const blobPrincipal = await pdf(
      <InformePDF
        informe={informePrincipal}
        qrImage={qrDataUrl}
        verificationUrl={verificationUrl}
      />
    ).toBlob();

    const formDataPrincipal = new FormData();
    formDataPrincipal.append('archivo', blobPrincipal, `certificado_final_${id}.pdf`);
    formDataPrincipal.append('trabajo_id', id);

    await axios.post('/api/trabajo-social/guardar-certificado-final', formDataPrincipal, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });

    await axios.patch(`/api/trabajo-social/estado/${id}`, {
      nuevo_estado: 'aprobado',
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });

    fetchInformesFinales();

    await mostrarExitoInformeAprobado();

  } catch (error) {
    console.error('Error general al aceptar informe:', error);
    await mostrarErrorProcesarInforme();
  }
};


const fetchSupervisores = useCallback(async () => {
  if (!token) return;
  try {
    const res = await axios.get('/api/trabajo-social/supervisores', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setSupervisores(Array.isArray(res.data) ? res.data : []);
  } catch (error) {
    console.error('Error al cargar supervisores:', error);
  }
}, [token]);


const verSeguimiento = async (usuario_id) => {
      try {
        const res = await axios.get(`/api/trabajo-social/seguimiento/${usuario_id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSeguimiento(res.data);
        setModalSeguimientoVisible(true);
      } catch (error) {
        console.error("Error al obtener seguimiento:", error);
        Swal.fire("Error", "No se pudo obtener el seguimiento del trámite", "error");
      }
  };


const fetchInformesFinales = useCallback(async () => {
  if (!token) return;
  try {
    const res = await axios.get('/api/trabajo-social/informes-finales', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setInformesFinales(res.data);
  } catch (error) {
    console.error('Error al cargar informes finales:', error);
  }
}, [token]);

const fetchLineas = useCallback(async () => {
  if (!token) return;
  try {
    const res = await axios.get('/api/lineas', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setLineas(res.data);
  } catch (error) {
    console.error('Error al cargar líneas de acción:', error);
  }
}, [token]);

const crearLinea = async () => {
  if (!nuevaLinea.trim()) return;
  try {
    await axios.post('/api/lineas', {
      nombre_linea: nuevaLinea
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setNuevaLinea('');
    fetchLineas();
  } catch (error) {
    console.error('Error al crear línea de acción:', error);
  }
};

const guardarEdicionLinea = async (id) => {
  try {
    await axios.put(`/api/lineas/${id}`, {
      nombre_linea: nombreLineaEditado
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setIdEditandoLinea(null);
    setNombreLineaEditado('');
    fetchLineas();
  } catch (error) {
    console.error('Error al actualizar línea de acción:', error);
  }
};

const eliminarLinea = async (id) => {
  const resultado = await confirmarEliminarLinea();

  if (!resultado.isConfirmed) return;

  try {
    await axios.delete(`/api/lineas/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    mostrarLineaEliminada();
    fetchLineas();

  } catch (error) {
    console.error('Error al eliminar línea de acción:', error);
    mostrarErrorEliminarLinea();
  }
};

const fetchProgramas = useCallback(async () => {
  if (!token) return;
  try {
    const res = await axios.get('/api/programas', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setProgramas(res.data);
  } catch (error) {
    console.error('Error al cargar programas:', error);
  }
}, [token]);

const crearPrograma = async () => {
  if (!nuevoPrograma.trim() || !facultadPrograma || !emailPrograma || !whatsappPrograma) {
    mostrarAlertaCamposIncompletosPrograma();
    return;
  }

  const emailValido = /@(gmail\.com|udh\.edu\.pe)$/.test(emailPrograma);
  if (!emailValido) {
    mostrarAlertaCorreoProgramaInvalido();
    return;
  }

  if (whatsappPrograma.length !== 9) {
    mostrarAlertaWhatsappProgramaInvalido();
    return;
  }

  try {
    await axios.post('/api/programas', {
      nombre_programa: nuevoPrograma,
      id_facultad: facultadPrograma,
      email: emailPrograma,
      whatsapp: whatsappPrograma,
      rol_id: 4,
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });

    mostrarAlertaProgramaCreado();

    setNuevoPrograma('');
    setFacultadPrograma('');
    setEmailPrograma('');
    setWhatsappPrograma('');
    fetchProgramas();

  } catch (error) {
    console.error('Error al crear programa:', error);

    if (error.response?.status === 409) {
      mostrarAlertaCorreoProgramaDuplicado();
    } else if (error.response?.status === 400) {
      mostrarAlertaErrorPrograma400(error.response.data.message);
    } else {
      mostrarAlertaErrorProgramaDesconocido();
    }
  }
};

const guardarEdicionFacultad = async (id) => {
  try {
    await axios.put(`/api/facultades/${id}`, {
      nombre_facultad: nombreEditado,
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setEditandoId(null);
    setNombreEditado('');
    await fetchFacultades();
  } catch (error) {
     console.error('Error al actualizar facultad:', error);
  }
};

const eliminarPrograma = async (id) => {
  const confirmacion = await confirmarEliminarPrograma();
  if (!confirmacion.isConfirmed) return;

  try {
    await axios.delete(`/api/programas/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    await fetchProgramas();
    mostrarAlertaProgramaEliminado();
  } catch (error) {
    console.error('Error al eliminar programa:', error);
    mostrarAlertaErrorEliminarPrograma();
  }
};

const cancelarEdicion = () => {
  setEditandoId(null);
  setNombreEditado('');
};


const fetchDocentes = useCallback(async () => {
  if (!token) return;
  try {
    const res = await axios.get('/api/docentes', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setDocentes(res.data);
  } catch (error) {
    console.error('Error al cargar docentes:', error);
  }
}, [token]);


const crearDocente = async () => {
  if (
    !nuevoDocenteEmail ||
    !nuevoDocenteWhatsapp ||
    !nuevaFacultadDocente ||
    !nuevoProgramaDocente
  ) {
    mostrarAlertaFaltanCamposDocente();
    return;
  }

  if (nuevoDocenteWhatsapp.length !== 9) {
    mostrarAlertaWhatsappInvalido();
    return;
  }

  try {
    await axios.post(
      '/api/auth/registrar-docente-completo',
      {
        email: nuevoDocenteEmail,
        whatsapp: nuevoDocenteWhatsapp,
        facultad_id: nuevaFacultadDocente,
        programa_academico_id: nuevoProgramaDocente,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setNuevoDocenteEmail('');
    setNuevoDocenteWhatsapp('');
    setNuevaFacultadDocente('');
    setNuevoProgramaDocente('');

    mostrarAlertaDocenteRegistrado();
    fetchDocentes();
  } catch (error) {
    console.error('Error al registrar docente:', error);

    if (error.response?.status === 409) {
      mostrarAlertaCorreoDuplicadoDocente();
    } else {
      mostrarErrorRegistrarDocente(error.response?.data?.message);
    }
  }
};
 
const guardarEdicionPrograma = async () => {
  if (!programaEditado.trim() || !facultadEditada || !emailEditado.trim()) {
    mostrarAlertaCamposIncompletosProgramaEdicion();
    return;
  }

  const correoValido =
    emailEditado.endsWith('@gmail.com') || emailEditado.endsWith('@udh.edu.pe');

  if (!correoValido) {
    mostrarAlertaCorreoInvalidoPrograma();
    return;
  }

  try {
    await axios.put(
      `/api/programas/${idEditandoPrograma}`,
      {
        nombre_programa: programaEditado,
        id_facultad: facultadEditada,
        email: emailEditado,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    mostrarAlertaProgramaActualizado();

    setModalEditarProgramaVisible(false);
    setIdEditandoPrograma(null);
    setProgramaEditado('');
    setFacultadEditada('');
    setEmailEditado('');

    fetchProgramas();
  } catch (error) {
    console.error('Error al actualizar el programa académico:', error);

    mostrarAlertaErrorActualizarPrograma(error.response?.data?.message);
  }
};

const eliminarDocente = async (id) => {
  const confirmacion = await confirmarEliminarDocente();

  if (!confirmacion.isConfirmed) return;

  try {
    await axios.delete(`/api/docentes/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    await fetchDocentes();

    mostrarDocenteEliminado();

  } catch (error) {
    console.error('Error al eliminar docente:', error);
    mostrarErrorEliminarDocente(error.response?.data?.message);
  }
};

useEffect(() => {
  const fetchProgramasPorFacultad = async () => {
    if (!nuevaFacultadDocente) {
      setProgramas([]); 
      return;
    }

    try {
      const res = await axios.get(`/api/programas/facultad/${nuevaFacultadDocente}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProgramas(res.data); 
    } catch (error) {
      console.error('Error al obtener programas filtrados:', error);
    }
  };

  fetchProgramasPorFacultad();
}, [nuevaFacultadDocente, token]);


const guardarEdicionDocente = async (id) => {
  try {
    await axios.put(`/api/docentes/${id}`, {
      nombre_docente: nombreDocenteEditado,
      email: emailDocenteEditado,
      programa_academico_id: programaDocenteEditado,
      facultad_id: facultadDocenteEditada,
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    mostrarDocenteActualizado();

    setEditandoDocenteId(null);
    fetchDocentes();

  } catch (error) {
    console.error('Error al actualizar docente:', error);

    if (error.response?.status === 409) {
      mostrarErrorCorreoDuplicadoAlActualizarDocente();
    } else {
      mostrarErrorActualizarDocente(error.response?.data?.message);
    }
  }
};

const fetchLabores = useCallback(async () => {
  try {
    const res = await axios.get('/api/labores', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setLabores(res.data);
  } catch (error) {
    console.error('Error al cargar labores sociales:', error);
  }
}, [token]);

  const crearLabor = async () => {
    if (!nuevaLabor.trim() || !lineaLabor) return;
    try {
      await axios.post('/api/labores', {
      nombre_labores: nuevaLabor,
      linea_id: lineaLabor
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
      setNuevaLabor('');
      fetchLabores();
    } catch (error) {
      console.error('Error al crear labor social:', error);
    }
  };


const eliminarLabor = async (id) => {
  const confirmacion = await confirmarEliminarLabor();
  if (!confirmacion.isConfirmed) return;

  try {
    await axios.delete(`/api/labores/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    await fetchLabores();
    mostrarLaborEliminada();

  } catch (error) {
    console.error('Error al eliminar labor social:', error);
    mostrarErrorEliminarLabor(error.response?.data?.message);
  }
};

const guardarEdicionLabor = async (id) => {
  try {
    await axios.put(`/api/labores/${id}`, {
    nombre_labores: nombreLaborEditado,
    linea_id: lineaLabor
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setEditandoLaborId(null);
    fetchLabores();
  } catch (error) {
    console.error('Error al actualizar labor social:', error);
  }
};

const fetchFacultades = useCallback(async () => {
  if (!token) return;
  try {
    const res = await axios.get('/api/facultades', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setFacultades(res.data);
  } catch (error) {
    console.error('Error al cargar facultades:', error);
  }
}, [token]);


const crearFacultad = async () => {
    if (!nuevaFacultad.trim()) return;
    try {
      await axios.post('/api/facultades', {
      nombre_facultad: nuevaFacultad,
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      setNuevaFacultad('');
      fetchFacultades();
    } catch (error) {
      console.error('Error al crear facultad:', error);
    }
  };

const eliminarFacultad = async (id) => {
  const confirmacion = await confirmarEliminarFacultad();
  if (!confirmacion.isConfirmed) return;

  try {
    await axios.delete(`/api/facultades/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    await fetchFacultades();
    mostrarFacultadEliminada();

  } catch (error) {
    console.error('Error al eliminar facultad:', error);
    mostrarErrorEliminarFacultad(error.response?.data?.message);
  }
};

const rechazarInforme = async (id) => {
    try {
      await axios.patch(`/api/trabajo-social/estado/${id}`, {
        nuevo_estado: 'rechazado',
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchInformesFinales();
    } catch (error) {
      console.error('Error al rechazar informe:', error);
    }
  };  

useEffect(() => {
  if (!token) return;
  fetchProgramas();
  fetchDocentes();
  fetchLabores();
  fetchInformesFinales();
  fetchFacultades();
  fetchLineas();
  fetchSupervisores();
}, [
  token,
  fetchProgramas,
  fetchDocentes,
  fetchLabores,
  fetchInformesFinales,
  fetchFacultades,
  fetchLineas,
  fetchSupervisores,
]);


return (
    <div className="layout-gestor">
    <Header onToggleSidebar={toggleSidebar} />
    <SidebarGestor
      collapsed={collapsed}
      nombre="Nombre del Gestor"
      onToggleSidebar={toggleSidebar}
      activeSection={activeSection}
      setActiveSection={setActiveSection}
    />
  <div className={`dashboard-container-gestor ${collapsed ? "expanded" : ""}`}>
        <h2>Dashboard Gestor UDH</h2>
  
{activeSection === 'facultades' && (
  <div className="facultades-container">
    <div className="facultades-card">
    <div className="facultades-header">
  <div className="facultades-header-left">
    <h2>Facultades</h2>
    <button
      className="docentes-btn-agregar"
      onClick={() => setModalNuevaFacultadVisible(true)}
    >
      Agregar
    </button>
  </div>

  <div className="facultades-header-right">
    <label className="facultades-search-label">
      Buscar:
      <input
          type="text"
          className="facultades-search-input"
          placeholder=""
          value={busquedaFacultad}
          onChange={(e) => setBusquedaFacultad(e.target.value)}
        />
    </label>
  </div>
</div>
      <div className="facultades-table-wrapper">
        <table className="facultades-table">
          <thead>
            <tr>
              <th>Nº</th>
              <th>Nombre</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
          {facultades
          .filter(f =>
              (f.nombre_facultad || '').toLowerCase().includes(busquedaFacultad.toLowerCase())
            )
          .map((f, index) => (
            <tr key={f.id_facultad}>
              <td>{index + 1}</td>
                <td>
                {(f.nombre_facultad || '').toUpperCase()}
                </td>
                <td>
                  <span className="facultades-badge-activo">Activo</span>
                </td>
                <td>
                  <>
                    <button
                      onClick={() => {
                        setEditandoId(f.id_facultad);
                        setNombreEditado(f.nombre_facultad);
                        setModalEditarVisible(true);
                      }}
                      className="facultades-btn editar"
                    >
                      <EditIcon />
                    </button>

                    <button
                      onClick={() => eliminarFacultad(f.id_facultad)}
                      className="facultades-btn eliminar"
                    >
                      <DeleteIcon />
                    </button>
                  </>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  <FacultadEditarModal
  isOpen={modalEditarVisible}
  nombre={nombreEditado}
  onChangeNombre={setNombreEditado}
  onCancelar={() => {
    cancelarEdicion();
    setModalEditarVisible(false);
  }}
  onGuardar={async () => {
    await guardarEdicionFacultad(editandoId);
    setModalEditarVisible(false);
  }}
/>

  <FacultadNuevoModal
  isOpen={modalNuevaFacultadVisible}
  nombreFacultad={nuevaFacultad}
  onChangeNombre={setNuevaFacultad}
  onClose={() => {
    setModalNuevaFacultadVisible(false);
    setNuevaFacultad("");
  }}
  onGuardar={async () => {
    await crearFacultad();
    setModalNuevaFacultadVisible(false);
    setNuevaFacultad("");
  }}
/>
  </div>
)}

{activeSection === 'programas' && (
  <div className="programas-container">
    <div className="programas-card">
    <div className="programas-header">
  <div className="programas-header-left">
    <h2>Programas Académicos</h2>
    <button
      className="docentes-btn-agregar"
      onClick={() => setModalProgramaVisible(true)}
    >
      Agregar
    </button>
  </div>

  <div className="programas-header-right">
    <label className="programas-search-label">
      Buscar:
      <input
        type="text"
        className="programas-search-input"
        value={busquedaPrograma}
        onChange={(e) => setBusquedaPrograma(e.target.value)}
      />
    </label>
  </div>
</div>
      <div className="programas-table-wrapper">
        <table className="programas-table">
        <thead className="programas-table-thead">
          <tr>
            <th>Nº</th>
            <th>Nombre</th>
            <th>Facultad</th>
            <th>Email</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {programas
            .filter((prog) =>
                (prog.nombre_programa || '').toLowerCase().includes(busquedaPrograma.toLowerCase())
              )
              .map((prog, index) => (
            <tr key={prog.id_programa}>
                <td>{index + 1}</td>
                <td>{(prog.nombre_programa || '').toUpperCase()}</td>
                <td>{(prog.Facultade?.nombre_facultad || 'SIN FACULTAD').toUpperCase()}</td>
                <td>{prog.email || 'SIN CORREO'}</td>
              <td>
                <button
                  onClick={() => {
                    setIdEditandoPrograma(prog.id_programa);
                    setProgramaEditado(prog.nombre_programa);
                    setFacultadEditada(prog.Facultade?.id_facultad || '');
                    setEmailEditado(prog.email);
                    setModalEditarProgramaVisible(true);
                  }}
                  className="facultades-btn editar"
                >
                  <EditIcon />
                </button>

                <button
                  onClick={() => eliminarPrograma(prog.id_programa)}
                  className="facultades-btn eliminar"
                >
                  <DeleteIcon />
                </button>
              </td>
              </tr>
            ))}
        </tbody>
        </table>
      </div>
    </div>
  </div>
)}

<ProgramaEditarModal
  isOpen={modalEditarProgramaVisible}
  nombre={programaEditado}
  onChangeNombre={setProgramaEditado}
  facultad={facultadEditada}
  onChangeFacultad={setFacultadEditada}
  email={emailEditado}
  onChangeEmail={setEmailEditado}
  facultades={facultades}
  onClose={() => {
    setModalEditarProgramaVisible(false);
    setIdEditandoPrograma(null);
    setProgramaEditado("");
    setFacultadEditada("");
    setEmailEditado("");
  }}
  onGuardar={guardarEdicionPrograma}
/>

<ProgramaNuevoModal
  isOpen={modalProgramaVisible}
  nombrePrograma={nuevoPrograma}
  onChangeNombrePrograma={setNuevoPrograma}
  facultadPrograma={facultadPrograma}
  onChangeFacultadPrograma={setFacultadPrograma}
  emailPrograma={emailPrograma}
  onChangeEmailPrograma={setEmailPrograma}
  whatsappPrograma={whatsappPrograma}
  onChangeWhatsappPrograma={(value) => {
    if (/^\d{0,9}$/.test(value)) {
      setWhatsappPrograma(value);
    }
  }}
  facultades={facultades}
  onClose={() => {
    setModalProgramaVisible(false);
    setNuevoPrograma("");
    setFacultadPrograma("");
    setEmailPrograma("");
    setWhatsappPrograma("");
  }}
  onGuardar={() => {
    if (whatsappPrograma.length !== 9) {
      Swal.fire({
        icon: "error",
        title: "Número inválido",
        text: "El número de WhatsApp debe tener exactamente 9 dígitos.",
        confirmButtonColor: "#d33",
      });
      return;
    }
    crearPrograma();
    setModalProgramaVisible(false);
  }}
/>

{activeSection === 'supervisores' && (
  <div className="docentes-container">
    <div className="docentes-card">
      <div className="docentes-header">
        <div className="docentes-header-left">
          <h2>Desig. Docente Supervisor</h2>
        </div>

        <div className="docentes-header-right">
          <label className="docentes-search-label">
            Buscar:
            <input
              type="text"
              className="docentes-search-input"
              placeholder="Nombre del estudiante"
              value={busquedaSupervisor}
              onChange={(e) => setBusquedaSupervisor(e.target.value)}
            />
          </label>
        </div>

        <label className="docentes-search-label">
          Buscar por Programa Académico:
          <select
            className="select-profesional"
            value={programaSupervisor}
            onChange={(e) => setProgramaSupervisor(e.target.value)}
          >
            <option value="">Todos</option>
            {programas.map((prog) => (
              <option key={prog.id_programa} value={prog.nombre_programa}>
                {prog.nombre_programa}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="docentes-table-wrapper">
        <table className="docentes-table">
          <thead className="docentes-table-thead">
            <tr>
              <th>Nº</th>
              <th>Nombre</th>
              <th>Programa Académico</th>
              <th>Estado</th>
              <th>Carta de Aceptación</th>
              <th>Supervisor</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {(supervisores || [])
              .filter((sup) =>
                (sup.estudiante?.nombre_estudiante || '')
                  .toLowerCase()
                  .includes((busquedaSupervisor || '').toLowerCase())
              )
              .filter((sup) => {
                if (!programaSupervisor) return true;
                const nombreProg =
                  sup.programa?.nombre_programa ||
                  sup.ProgramasAcademico?.nombre_programa ||
                  '';
                return (
                  nombreProg.toLowerCase() === programaSupervisor.toLowerCase()
                );
              })
              .map((sup, index) => {
                const nombre = (sup.estudiante?.nombre_estudiante || 'SIN NOMBRE').toUpperCase();
                const programa =
                  (sup.programa?.nombre_programa ||
                    sup.ProgramasAcademico?.nombre_programa ||
                    'SIN PROGRAMA').toUpperCase();
                const supervisor =
                  sup.supervisor?.nombre_supervisor ||
                  sup.supervisor?.nombre ||
                  'SIN SUPERVISOR';
                const cartaPdf = sup.carta_aceptacion_pdf || sup.carta_pdf || null;

                return (
                  <tr key={sup.id_supervisor || sup.id || index}>
                    <td>{index + 1}</td>
                    <td>{nombre}</td>
                    <td>{programa}</td>
                    <td>
                      {(() => {
                        const raw = (
                          sup.estado ||
                          sup.estado_plan_labor_social ||
                          'pendiente'
                        ).toLowerCase();
                        const estado = ['aceptado', 'rechazado', 'pendiente'].includes(raw)
                          ? raw
                          : 'pendiente';
                        const label = {
                          aceptado: 'Aceptado',
                          rechazado: 'Rechazado',
                          pendiente: 'Pendiente',
                        }[estado];

                        return <span className={`badge-estado ${estado}`}>{label}</span>;
                      })()}
                    </td>
                    <td>
                      {cartaPdf ? (
                        <a
                          href={`${process.env.REACT_APP_API_URL}/uploads/planes_labor_social/${cartaPdf}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-ver-pdf"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            fill="#2e2e2e"
                            viewBox="0 0 24 24"
                            className="icono-ojo"
                          >
                            <path d="M12 4.5C7 4.5 2.73 8.11 1 12c1.73 3.89 6 7.5 11 7.5s9.27-3.61 11-7.5c-1.73-3.89-6-7.5-11-7.5zm0 13c-3.03 0-5.5-2.47-5.5-5.5S8.97 6.5 12 6.5s5.5 2.47 5.5 5.5S15.03 17.5 12 17.5zm0-9c-1.93 0-3.5 1.57-3.5 3.5S10.07 15.5 12 15.5s3.5-1.57 3.5-3.5S13.93 8.5 12 8.5z" />
                          </svg>
                          <span>Ver</span>
                        </a>
                      ) : (
                        <span className="no-generado">NO GENERADO</span>
                      )}
                    </td>
                    <td>{supervisor}</td>
                    <td>
                      <button
                        onClick={() => eliminarSupervisor(sup.id || sup.id_supervisor)}
                        className="facultades-btn eliminar"
                        title="Eliminar designación"
                      >
                        <DeleteIcon />
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  </div>
)}


{activeSection === 'informes-finales' && (
  <div className="docentes-container">
    <div className="docentes-card">
      <div className="docentes-header">
        <div className="docentes-header-left">
          <h2>Informes Finales</h2>
        </div>
        <div className="docentes-header-right">
          <label className="docentes-search-label">
            Buscar:
            <input
              type="text"
              className="docentes-search-input"
              placeholder="Nombre del estudiante"
              value={busquedaDocente}
              onChange={(e) => setBusquedaDocente(e.target.value)}
            />
          </label>
        </div>
        <div className="docentes-header-right">
      <label className="docentes-search-label">
        Buscar por Programa Académico:
            <select
            className="select-profesional"
            
            value={programaSeleccionado}
            onChange={(e) => setProgramaSeleccionado(e.target.value)}  
          >
            <option value="">Todos</option>
            {programas.map((prog) => (
              <option key={prog.id_programa} value={prog.nombre_programa}>
                {prog.nombre_programa}
              </option>
            ))}
          </select>
      </label>
      </div>
      </div>

      <div className="docentes-table-wrapper">
        <table className="docentes-table">
          <thead className="docentes-table-thead">
            <tr>
              <th>Nº</th>
              <th>Estudiante</th>
              <th>Programa</th>
              <th>Facultad</th>
              <th>Fecha de Envío</th>
              <th>Archivo</th>
              <th>Documentos</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {informesFinales
                 .filter((inf) => {
            return programaSeleccionado
              ? inf.ProgramasAcademico?.nombre_programa
                  ?.toLowerCase()
                  .includes(programaSeleccionado.toLowerCase()) 
              : true;  
          })
          .filter((inf) =>
            (inf.Estudiante?.nombre_estudiante || '').toLowerCase().includes(busquedaDocente.toLowerCase())
          )
              .map((inf, index) => (
                <tr key={inf.id}>
                  <td>{index + 1}</td>
                  <td>{(inf.Estudiante?.nombre_estudiante || 'SIN NOMBRE').toUpperCase()}</td>
                  <td>{(inf.ProgramasAcademico?.nombre_programa || 'SIN PROGRAMA').toUpperCase()}</td>
                  <td>{(inf.Facultad?.nombre_facultad || 'SIN FACULTAD').toUpperCase()}</td>
                  <td>{new Date(inf.createdAt).toLocaleDateString()}</td>
                  <td>
                  {inf.informe_final_pdf ? (
                    <VerBoton
                      label="Ver"
                      onClick={() =>
                        window.open(
                          `${process.env.REACT_APP_API_URL}/uploads/informes_finales/${inf.informe_final_pdf}`,
                          "_blank",
                          "noopener,noreferrer"
                        )
                      }
                    />
                  ) : (
                    <span className="no-generado">NO GENERADO</span>
                  )}
                </td>
                  <td> 
                    {inf.certificado_final ? (
                      <VerBoton
                        label="Ver"
                        onClick={() =>
                          window.open(
                            `${process.env.REACT_APP_API_URL}/uploads/certificados_finales/${inf.certificado_final}`,
                            "_blank",
                            "noopener,noreferrer"
                          )
                        }
                      />
                    ) : (
                      <span className="no-generado">NO GENERADO</span>
                    )}
                  </td>
                  <td>
                    {inf.estado_informe_final === 'pendiente' ? (
                      <>
                        <button
                          className="btn-accion aceptar"
                          onClick={() => aceptarInforme(inf.id)}
                          disabled={aprobandoId === inf.id}
                        >
                          {aprobandoId === inf.id ? (
                            <span className="btn-spinner-wrap">
                              <span className="btn-spinner" />
                              Generando...
                            </span>
                          ) : (
                            "Aprobar"
                          )}
                        </button>

                        <button
                        className="btn-accion rechazar"
                        onClick={() => rechazarInforme(inf.id)}
                        disabled={aprobandoId === inf.id}
                      >
                        Rechazar
                      </button>
                      </>
                    ) : (
                      <span
                        className={`badge-estado ${
                          inf.estado_informe_final === 'aprobado' ? 'aprobado' : 'rechazado'
                        }`}
                      >
                        {inf.estado_informe_final.toUpperCase()}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
)}


{activeSection === 'estudiantes' && (
  <div className="docentes-container">
    <div className="docentes-card">
      <div className="docentes-header">
          <div className="docentes-header-left flex items-center gap-4">
    <h2>Estudiantes</h2>
    <button
      className="docentes-btn-agregar"
      onClick={() => setModalEstudianteVisible(true)}
    >
      Agregar
    </button>
  </div>
        
        <div className="docentes-header-right">
          <label className="docentes-search-label">
            Buscar:
            <input
              type="text"
              className="docentes-search-input-es"
              placeholder="Nombre del estudiante o DNI"
              value={filtroEstudiantes}
              onChange={(e) => setFiltroEstudiantes(e.target.value)}
            />
          </label>
        </div>

        <label className="docentes-search-label">
          Buscar por Programa Académico:
          <select
            className="select-profesional"
            value={programaSeleccionado}
            onChange={(e) => setProgramaSeleccionado(e.target.value)}
          >
            <option value="">Todos</option>
            {programas.map((prog) => (
              <option key={prog.id_programa} value={prog.nombre_programa}>
                {prog.nombre_programa}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="docentes-table-wrapper">
        <table className="docentes-table">
          <thead className="docentes-table-thead">
            <tr>
              <th>Nº</th> 
              <th>Nombre</th>
              <th>DNI</th>
              <th>Correo</th>
              <th>Celular</th>
              <th>Programa Académico</th>
            </tr>
          </thead>
          <tbody>
            {estudiantes
              .filter((est) => {
                const coincideTexto =
                  est.nombre_estudiante?.toLowerCase().includes(filtroEstudiantes.toLowerCase()) ||
                  est.dni?.includes(filtroEstudiantes);

                const coincidePrograma =
                  programaSeleccionado === '' ||
                  est.programa?.nombre_programa === programaSeleccionado;

                return coincideTexto && coincidePrograma;
              })
              .map((est, index) => (
                <tr key={est.id_estudiante}>
                  <td>{index + 1}</td>
                  <td>{est.nombre_estudiante || 'SIN NOMBRE'}</td>
                  <td>{est.dni || '—'}</td>
                  <td>{est.email || 'SIN CORREO'}</td>
                  <td>{est.celular || '—'}</td>
                  <td>{est.programa?.nombre_programa?.toUpperCase() || 'SIN PROGRAMA'}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
)}

{activeSection === 'estudiantes-concluidos' && (
  <EstudiantesConcluidos
    estudiantes={estudiantes}
    filtroEstudiantes={filtroEstudiantes}
    setFiltroEstudiantes={setFiltroEstudiantes}
    programas={programas}
    programaSeleccionado={programaSeleccionado}
    setProgramaSeleccionado={setProgramaSeleccionado}
    setModalEstudianteVisible={setModalEstudianteVisible}
  />
)}

<EstudianteNuevoModal
  isOpen={modalEstudianteVisible}
  codigo={codigoUniversitario}
  onChangeCodigo={(value) => {
    if (/^\d{0,10}$/.test(value)) {
      setCodigoUniversitario(value);
    }
  }}
  whatsapp={nuevoDocenteWhatsapp}
  onChangeWhatsapp={(value) => {
    if (/^\d{0,9}$/.test(value)) {
      setNuevoDocenteWhatsapp(value);
    }
  }}
  onClose={() => {
    setModalEstudianteVisible(false);
    setCodigoUniversitario('');
    setNuevoDocenteWhatsapp('');
  }}
  onGuardar={async () => {
    if (codigoUniversitario.length !== 10) {
      Swal.fire({
        icon: "error",
        title: "Código inválido",
        text: "El código universitario debe tener exactamente 10 dígitos.",
      });
      return;
    }

    if (nuevoDocenteWhatsapp.length !== 9) {
      Swal.fire({
        icon: "error",
        title: "Número inválido",
        text: "El WhatsApp debe tener exactamente 9 dígitos.",
      });
      return;
    }

    try {
      const res = await axios.post(
        "/api/auth/register-codigo",
        {
          codigo: codigoUniversitario,
          whatsapp: nuevoDocenteWhatsapp,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Swal.fire({
        icon: "success",
        title: "Éxito",
        text: res.data.message,
      });

      await fetchEstudiantes();
      setModalEstudianteVisible(false);
      setCodigoUniversitario("");
      setNuevoDocenteWhatsapp("");
    } catch (error) {
      console.error("Error registrando estudiante:", error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.response?.data?.message ||
          "No se pudo registrar el estudiante",
      });
    }
  }}
/>

{activeSection === 'docentes' && (
  <div className="docentes-container">
    <div className="docentes-card">
      <div className="docentes-header">
        <div className="docentes-header-left">
          <h2>Docentes</h2>
          {<button className="docentes-btn-agregar" onClick={() => setModalDocenteVisible(true)}>
            Agregar
          </button> }
        </div>
        <div className="docentes-header-right">
    <label className="docentes-search-label">
      Buscar:
      <input
        type="text"
        className="docentes-search-input"
        placeholder="Nombre del docente"
        value={busquedaDocente}
        onChange={(e) => setBusquedaDocente(e.target.value)}
      />
    </label>
  </div>
      </div>
      
      <div className="docentes-table-wrapper">
        <table className="docentes-table">
          <thead className="docentes-table-thead">
            <tr>
              <th>Nº</th>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Facultad</th>
              <th>Programa Academico</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
          {docentes
          .filter((doc) =>
            (doc.nombre_docente || '').toLowerCase().includes(busquedaDocente.toLowerCase())
          )
         .map((doc, index) => (
          <tr key={doc.id_docente}>
            <td>{index + 1}</td>
                <td>
                  {editandoDocenteId === doc.id_docente ? (
                    <input
                      type="text"
                      className="docentes-input-edit"
                      value={nombreDocenteEditado}
                      onChange={(e) => setNombreDocenteEditado(e.target.value)}
                    />
                  ) : (
                    (doc.nombre_docente || 'SIN NOMBRE').toUpperCase()

                  )}
                </td>
                <td>{doc.email || 'SIN CORREO'}</td>
                <td>
                  {(doc.Facultade?.nombre_facultad || 'SIN FACULTAD').toUpperCase()}
                </td>
                <td>
                  {editandoDocenteId === doc.id_docente ? (
                    <select
                      className="docentes-select-edit"
                      value={programaDocenteEditado}
                      onChange={(e) => setProgramaDocenteEditado(e.target.value)}
                    >
                      {programas.map((prog) => (
                        <option key={prog.id_programa} value={prog.id_programa}>
                          {prog.nombre_programa}
                        </option>
                      ))}
                    </select>
                  ) : (
                    (doc.ProgramaDelDocente?.nombre_programa || 'SIN PROGRAMA').toUpperCase()
                  )}
                </td>
               <td className="docentes-acciones-cell">
                <button
                onClick={() => {
                  setEditandoDocenteId(doc.id_docente);
                  setNombreDocenteEditado(doc.nombre_docente);
                  setEmailDocenteEditado(doc.email || '');
                  setProgramaDocenteEditado(doc.programa_academico_id);
                  setFacultadDocenteEditada(doc.facultad_id);
                  setModalEditarDocenteVisible(true);
                }}
                className="facultades-btn editar"
              >
                <EditIcon />
              </button>
                <button
                onClick={() => eliminarDocente(doc.id_docente)}
                className="facultades-btn eliminar"
              >
                <DeleteIcon />
              </button>
              </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
)}

<DocenteEditarModal
  isOpen={modalEditarDocenteVisible}
  nombre={nombreDocenteEditado}
  onChangeNombre={setNombreDocenteEditado}
  email={emailDocenteEditado}
  onChangeEmail={setEmailDocenteEditado}
  facultad={facultadDocenteEditada}
  onChangeFacultad={setFacultadDocenteEditada}
  programa={programaDocenteEditado}
  onChangePrograma={setProgramaDocenteEditado}
  facultades={facultades}
  programas={programas}
  onClose={() => {
    setModalEditarDocenteVisible(false);
    setEditandoDocenteId(null);
    setNombreDocenteEditado("");
    setEmailDocenteEditado("");
    setFacultadDocenteEditada("");
    setProgramaDocenteEditado("");
  }}
  onGuardar={() => {
    guardarEdicionDocente(editandoDocenteId);
    setModalEditarDocenteVisible(false);
  }}
/>

<DocenteNuevoModal
  isOpen={modalDocenteVisible}
  email={nuevoDocenteEmail}
  onChangeEmail={setNuevoDocenteEmail}
  whatsapp={nuevoDocenteWhatsapp}
  onChangeWhatsapp={(value) => {
    if (/^\d{0,9}$/.test(value)) {
      setNuevoDocenteWhatsapp(value);
    }
  }}
  facultad={nuevaFacultadDocente}
  onChangeFacultad={(value) => {
    setNuevaFacultadDocente(value);
    setNuevoProgramaDocente(""); 
  }}
  programa={nuevoProgramaDocente}
  onChangePrograma={setNuevoProgramaDocente}
  facultades={facultades}
  programas={programas.filter(
    (prog) => prog.id_facultad === parseInt(nuevaFacultadDocente || 0, 10)
  )}
  onClose={() => {
    setModalDocenteVisible(false);
    setNuevoDocenteEmail("");
    setNuevoDocenteDni("");
    setNuevoDocenteWhatsapp("");
    setNuevaFacultadDocente("");
    setNuevoProgramaDocente("");
  }}
  onGuardar={() => {
    if (nuevoDocenteWhatsapp.length !== 9) {
      Swal.fire({
        icon: "error",
        title: "Número inválido",
        text: "El número de WhatsApp debe tener exactamente 9 dígitos.",
        confirmButtonColor: "#d33",
      });
      return;
    }

    crearDocente();
    setModalDocenteVisible(false);
  }}
/>

{activeSection === 'cambios-tiempo' && (
  <CambiosTiempo />
)}

{activeSection === 'cambio-asesor' && (
  <CambioAsesor />
)}
{activeSection === 'dasborasd' && (
  <Dasborasd />
)}

{activeSection === 'impersonate' && (
  <ImpersonateLogin />
)}

{activeSection === 'labores' && (
  <div className="labores-container">
    <div className="labores-card">
    <div className="labores-header">
  <div className="labores-header-title">
    <h2>Servicios Sociales</h2>
    <button className="docentes-btn-agregar" onClick={() => setModalLaborVisible(true)}>
      Agregar
    </button>
  </div>
  <div className="labores-header-right">
  <label className="labores-search-label">
    Buscar:
    <input
      type="text"
      className="labores-search-input"
      placeholder="Nombre de la labor"
      value={busquedaLabor}
      onChange={(e) => setBusquedaLabor(e.target.value)}
    />
  </label>
</div>
</div>
      <div className="labores-table-wrapper">
        <table className="labores-table">
          <thead className="labores-table-thead">
            <tr>
              <th>Nº</th>
              <th>Nombre</th>
              <th>Linea de Accion</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
          {labores
  .filter((labor) =>
    (labor.nombre_labores || '').toLowerCase().includes(busquedaLabor.toLowerCase())

  )
  .map((labor,index) => (
              <tr key={labor.id_labores}>
                <td>{index + 1}</td>
                <td>
                  {editandoLaborId === labor.id_labores ? (
                    <input
                      type="text"
                      className="labores-input-edit"
                      value={nombreLaborEditado}
                      onChange={(e) => setNombreLaborEditado(e.target.value)}
                    />
                  ) : (
                    labor.nombre_labores.toUpperCase()
                  )}
                </td>
                <td>
                  {editandoLaborId === labor.id_labores ? (
                   <select
                  className="labores-select-edit"
                  value={lineaLabor}
                  onChange={(e) => setLineaLabor(e.target.value)}
                >
                  <option value="">-- Línea de Acción --</option>
                  {lineas.map((l) => (
                    <option key={l.id_linea} value={l.id_linea}>
                      {l.nombre_linea}
                    </option>
                  ))}
                </select>
                  ) : (
                    labor.LineaAccion?.nombre_linea?.toUpperCase() || 'SIN LÍNEA'
                  )}
                </td>
                <td>
                <button
                  className="facultades-btn editar"
                  onClick={() => {
                    setIdLaborEditando(labor.id_labores);
                    setNombreLaborEditado(labor.nombre_labores);
                    setLineaLabor(labor.linea_accion_id);
                    setModalEditarLaborVisible(true);
                  }}
                >
                  <EditIcon />
                </button>

                <button
                  className="facultades-btn eliminar"
                  onClick={() => eliminarLabor(labor.id_labores)}
                >
                  <DeleteIcon />
                </button>
              </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
)}

{activeSection === 'seguimiento.trami' && (
  <div className="docentes-container">
    <div className="docentes-card">
      <div className="docentes-header">
        <div className="docentes-header-left">
          <h2>Seguimiento de Trámite</h2>
        </div>

        <div className="docentes-header-right">
          <label className="docentes-search-label">
            Buscar:
            <input
              type="text"
              className="docentes-search-input-es"
              placeholder="Nombre del estudiante"
              value={filtroEstudiantes}
              onChange={(e) => setFiltroEstudiantes(e.target.value)}
            />
          </label>
        </div>
      </div>

      <div className="docentes-table-wrapper">
        <table className="docentes-table">
          <thead className="docentes-table-thead">
            <tr>
              <th>Nº</th>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Programa Académico</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {estudiantes
              .filter((est) =>
                est.nombre_estudiante?.toLowerCase().includes(filtroEstudiantes.toLowerCase())
              )
              .map((est, index) => (
                <tr key={est.id_estudiante}>
                  <td>{index + 1}</td>
                  <td>{est.nombre_estudiante || 'SIN NOMBRE'}</td>
                  <td>{est.email || 'SIN CORREO'}</td>
                  <td>{est.programa?.nombre_programa?.toUpperCase() || 'SIN PROGRAMA'}</td>
                  <td>
                    <VerBoton
                    onClick={() => verSeguimiento(est.id_estudiante)}
                    label="Ver"
                  />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
)}

{activeSection === 'lineas' && (
  <div className="labores-container">
    <div className="labores-card">
      <div className="labores-header">
        <div className="labores-header-title">
          <h2>Líneas de Acción</h2>
          <button className="docentes-btn-agregar" onClick={() => setModalLineaVisible(true)}>Agregar</button>
        </div>
        <div className="labores-header-right">
          <label className="labores-search-label">
            Buscar:
            <input
              type="text"
              className="labores-search-input"
              placeholder="Nombre de la línea"
              value={busquedaLinea}
              onChange={(e) => setBusquedaLinea(e.target.value)}
            />
          </label>
        </div>
      </div>
      <div className="labores-table-wrapper">
        <table className="labores-table">
          <thead className="labores-table-thead">
            <tr>
              <th>Nº</th>
              <th>Nombre</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {lineas
              .filter((l) => (l.nombre_linea || '').toLowerCase().includes(busquedaLinea.toLowerCase()))
              .map((l, index) => (
              <tr key={l.id_linea}>
                <td>{index + 1}</td>
                  <td>{(l.nombre_linea || 'SIN NOMBRE').toUpperCase()}</td>
                 <td className="labores-acciones-cell">
                  <button
                    className="facultades-btn editar"
                    onClick={() => {
                      setIdEditandoLinea(l.id_linea);
                      setNombreLineaEditado(l.nombre_linea);
                      setModalEditarLineaVisible(true);
                    }}
                  >
                    <EditIcon />
                  </button>

                  <button
                    className="facultades-btn eliminar"
                    onClick={() => eliminarLinea(l.id_linea)}
                  >
                    <DeleteIcon />
                  </button>
                </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
)}

<SeguimientoModal
  isOpen={modalSeguimientoVisible}
  seguimiento={seguimiento}
  onClose={() => setModalSeguimientoVisible(false)}
/>

<LineaNuevoModal
  isOpen={modalLineaVisible}
  nombreLinea={nuevaLinea}
  onChangeNombreLinea={setNuevaLinea}
  onClose={() => {
    setModalLineaVisible(false);
    setNuevaLinea('');
  }}
  onGuardar={() => {
    crearLinea();
    setModalLineaVisible(false);
  }}
/>

<LineaEditarModal
  isOpen={modalEditarLineaVisible}
  nombreLinea={nombreLineaEditado}
  onChangeNombreLinea={setNombreLineaEditado}
  onClose={() => {
    setModalEditarLineaVisible(false);
    setIdEditandoLinea(null);
  }}
  onGuardar={() => {
    guardarEdicionLinea(idEditandoLinea);
    setModalEditarLineaVisible(false);
  }}
/>

<LaborEditarModal
  isOpen={modalEditarLaborVisible}
  nombreLabor={nombreLaborEditado}
  onChangeNombreLabor={setNombreLaborEditado}
  lineaLabor={lineaLabor}
  onChangeLineaLabor={setLineaLabor}
  lineas={lineas}
  onClose={() => {
    setModalEditarLaborVisible(false);
    setIdLaborEditando(null);
    setNombreLaborEditado("");
    setLineaLabor("");
  }}
  onGuardar={async () => {
    await guardarEdicionLabor(idLaborEditando);
    setModalEditarLaborVisible(false);
  }}
/>

<LaborNuevoModal
  isOpen={modalLaborVisible}
  nombreLabor={nuevaLabor}
  onChangeNombreLabor={setNuevaLabor}
  lineaLabor={lineaLabor}
  onChangeLineaLabor={setLineaLabor}
  lineas={lineas}
  onClose={() => {
    setModalLaborVisible(false);
    setNuevaLabor("");
    setLineaLabor("");
  }}
  onGuardar={() => {
    crearLabor();
    setModalLaborVisible(false);
  }}
/>
      </div>
      </div>
  );
  
}

export default DashboardGestor;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import SidebarGestor from './SidebarGestor';
import Header from '../components/Header';
import ImpersonateLogin from './ImpersonateLogin';
import CambiosTiempo from './CambiosTiempo';
import CambioAsesor from "./CambioAsesor"; 
import Dasborasd  from "./Dashboard";
import { pdf } from '@react-pdf/renderer';
import QRCode from 'qrcode';
import VerBoton, { VerBotonInline } from "../hooks/componentes/VerBoton";
import InformePDF from '../components/InformefinalProgramaPDF';
import './DashboardGestor.css';
import { useUser } from '../UserContext';


function DashboardGestor() {
  const [programas, setProgramas] = useState([]);
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
  const confirmacion = await Swal.fire({
    title: '¿Eliminar designación?',
    text: 'Se quitará la designación del docente supervisor.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6'
  });

  if (!confirmacion.isConfirmed) return;

  try {
    await axios.delete(`/api/trabajo-social/seleccionado/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    await fetchSupervisores();

    Swal.fire({
      icon: 'success',
      title: 'Eliminado',
      text: 'La designación fue eliminada correctamente.',
      timer: 2000,
      showConfirmButton: false
    });
  } catch (error) {
    console.error('Error al eliminar designación:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.response?.data?.message || 'No se pudo eliminar la designación.'
    });
  }
};
const fetchEstudiantes = async () => {
  try {
    const res = await axios.get("/api/estudiantes", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setEstudiantes(res.data);
  } catch (error) {
    console.error("Error al obtener estudiantes:", error);
  }
};

useEffect(() => {
  if (!token) return;
  fetchEstudiantes();
}, [token]);
const aceptarInforme = async (id) => {
  try {
    const informe = informesFinales.find((i) => i.id === id);
    if (!informe) {
      console.warn('⚠️ Informe no encontrado para el ID:', id);
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
          await Swal.fire({
            icon: 'warning',
            title: 'Servidor UDH sin respuesta',
            text: 'No se pudieron obtener los integrantes del grupo. Intenta nuevamente más tarde.',
            confirmButtonText: 'Aceptar',
          });
          return;
        }

      } catch (error) {
        console.error('Error al conectar con API UDH:', error);
        await Swal.fire({
          icon: 'error',
          title: 'Error de conexión',
          text: 'No se pudo conectar con el servidor de la UDH. Por favor, inténtalo más tarde.',
          confirmButtonText: 'Aceptar',
        });
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

          const blob = await pdf(<InformePDF informe={informePersonalizado} />).toBlob();

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
    const verificationUrl = `${process.env.REACT_APP_API_URL}/verificar/${id}`;
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

    Swal.fire({
      icon: 'success',
      title: 'Informe aprobado',
      text: 'Los certificados fueron generados y guardados exitosamente.',
      confirmButtonText: 'Aceptar',
    });

  } catch (error) {
    console.error('Error general al aceptar informe:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo procesar el informe.',
    });
  }
};

const fetchSupervisores = async () => {
  if (!token) return;
  try {
    const res = await axios.get('/api/trabajo-social/supervisores', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setSupervisores(Array.isArray(res.data) ? res.data : []);
  } catch (error) {
    console.error('Error al cargar supervisores:', error);
  }
};


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



useEffect(() => {
  const fetchEstudiantes = async () => {
    try {
      const res = await axios.get('/api/estudiantes', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEstudiantes(res.data);
    } catch (error) {
      console.error('Error al obtener estudiantes:', error);
    }
  };

  fetchEstudiantes();
}, []);

const fetchInformesFinales = async () => {
  try {
    const res = await axios.get('/api/trabajo-social/informes-finales', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setInformesFinales(res.data);
  } catch (error) {
    console.error('Error al cargar informes finales:', error);
  }
};

  const fetchLineas = async () => {
  try {
    const res = await axios.get('/api/lineas', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setLineas(res.data);
  } catch (error) {
    console.error('Error al cargar líneas de acción:', error);
  }
};

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
  const resultado = await Swal.fire({
    title: '¿Estás seguro?',
    text: 'Esta acción eliminará la línea de acción permanentemente.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  });

  if (resultado.isConfirmed) {
    try {
      await axios.delete(`/api/lineas/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      Swal.fire({
        icon: 'success',
        title: '¡Eliminado!',
        text: 'La línea de acción ha sido eliminada.',
        confirmButtonColor: '#1a237e',
        timer: 2000,
        showConfirmButton: false
      });

      fetchLineas();
    } catch (error) {
      console.error('Error al eliminar línea de acción:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo eliminar la línea de acción.',
        confirmButtonColor: '#d33'
      });
    }
  }
};


  const fetchProgramas = async () => {
    try {
      const res = await axios.get('/api/programas', {
      headers: { Authorization: `Bearer ${token}` }
    });
      setProgramas(res.data);
    } catch (error) {
      console.error('Error al cargar programas:', error);
    }
  };
  const toggleSidebar = () => {
    setCollapsed(prev => !prev);
  };

const crearPrograma = async () => {
  if (!nuevoPrograma.trim() || !facultadPrograma || !emailPrograma || !whatsappPrograma) {
    Swal.fire({
      icon: 'warning',
      title: 'Campos incompletos',
      text: 'Por favor completa todos los campos.',
    });
    return;
  }

  const emailValido = /@(gmail\.com|udh\.edu\.pe)$/.test(emailPrograma);
  if (!emailValido) {
    Swal.fire({
      icon: 'error',
      title: 'Correo inválido',
      text: 'Solo se permiten correos @gmail.com o @udh.edu.pe',
      confirmButtonColor: '#d33'
    });
    return;
  }

  if (whatsappPrograma.length !== 9) {
    Swal.fire({
      icon: 'error',
      title: 'Número inválido',
      text: 'El número de WhatsApp debe tener exactamente 9 dígitos.',
      confirmButtonColor: '#d33'
    });
    return;
  }

  try {
    await axios.post('/api/programas', {
      nombre_programa: nuevoPrograma,
      id_facultad: facultadPrograma,
      email: emailPrograma,
      whatsapp: whatsappPrograma,
      rol_id: 4
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    Swal.fire({
      icon: 'success',
      title: 'Programa creado exitosamente',
      showConfirmButton: false,
      timer: 2000
    });

    setNuevoPrograma('');
    setFacultadPrograma('');
    setEmailPrograma('');
    setWhatsappPrograma('');
    fetchProgramas();

  } catch (error) {
    console.error('Error al crear programa:', error);

    if (error.response?.status === 409) {
      Swal.fire({
        icon: 'error',
        title: 'Correo duplicado',
        text: 'Ya existe un usuario con ese correo.',
      });
    } else if (error.response?.status === 400) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response.data.message,
        confirmButtonColor: '#d33'
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error desconocido',
        text: 'Ocurrió un error inesperado.',
        confirmButtonColor: '#d33'
      });
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
  const confirmacion = await Swal.fire({
    title: '¿Estás seguro?',
    text: 'Esta acción eliminará el programa académico de forma permanente.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6'
  });

  if (confirmacion.isConfirmed) {
    try {
      await axios.delete(`/api/programas/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      await fetchProgramas(); 

      Swal.fire({
        icon: 'success',
        title: 'Programa eliminado',
        text: 'El programa fue eliminado correctamente.',
        confirmButtonColor: '#1a237e'
      });

    } catch (error) {
      console.error('Error al eliminar programa:', error);

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un error al eliminar el programa.',
        confirmButtonColor: '#d33'
      });
    }
  }
};
  const cancelarEdicion = () => {
    setEditandoId(null);
    setNombreEditado('');
  };



  const fetchDocentes = async () => {
    try {
      const res = await axios.get('/api/docentes', {
      headers: { Authorization: `Bearer ${token}` }
    });
      setDocentes(res.data);
    } catch (error) {
      console.error('Error al cargar docentes:', error);
    }
  };


const crearDocente = async () => {
  if (
    !nuevoDocenteEmail ||
    !nuevoDocenteWhatsapp ||
    !nuevaFacultadDocente ||
    !nuevoProgramaDocente
  ) {
    Swal.fire({
      icon: 'warning',
      title: '¡Faltan campos!',
      text: 'Completa todos los campos incluyendo facultad y programa.',
    });
    return;
  }

  if (nuevoDocenteWhatsapp.length !== 9) {
    Swal.fire({
      icon: 'error',
      title: 'Número inválido',
      text: 'El número de WhatsApp debe tener exactamente 9 dígitos.',
    });
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

    // Limpiar campos (ya no necesitas limpiar el DNI)
    setNuevoDocenteEmail('');
    setNuevoDocenteWhatsapp('');
    setNuevaFacultadDocente('');
    setNuevoProgramaDocente('');

    Swal.fire({
      icon: 'success',
      title: '¡Éxito!',
      text: 'Docente registrado exitosamente.',
    });

    fetchDocentes();
  } catch (error) {
    console.error('Error al registrar docente:', error);

    if (error.response?.status === 409) {
      Swal.fire({
        icon: 'error',
        title: 'Correo duplicado',
        text: 'Ya existe un usuario registrado con ese correo.',
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: '¡Error!',
        text:
          error.response?.data?.message ||
          'Error al registrar docente. Intenta nuevamente.',
      });
    }
  }
};



  
const guardarEdicionPrograma = async () => {
  if (!programaEditado.trim() || !facultadEditada || !emailEditado.trim()) {
    Swal.fire({
      icon: 'warning',
      title: 'Campos incompletos',
      text: 'Completa todos los campos requeridos.',
    });
    return;
  }

  // Validación de formato de correo
  const correoValido = emailEditado.endsWith('@gmail.com') || emailEditado.endsWith('@udh.edu.pe');
  if (!correoValido) {
    Swal.fire({
      icon: 'error',
      title: 'Correo inválido',
      text: 'El correo debe ser @gmail.com o @udh.edu.pe.',
    });
    return;
  }

  try {
    await axios.put(`/api/programas/${idEditandoPrograma}`, {
      nombre_programa: programaEditado,
      id_facultad: facultadEditada,
      email: emailEditado
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    Swal.fire({
      icon: 'success',
      title: 'Programa actualizado',
      showConfirmButton: false,
      timer: 1800
    });

    // Limpiar estado y cerrar modal
    setModalEditarProgramaVisible(false);
    setIdEditandoPrograma(null);
    setProgramaEditado('');
    setFacultadEditada('');
    setEmailEditado('');

    fetchProgramas();
  } catch (error) {
    console.error('Error al actualizar el programa académico:', error);

    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.response?.data?.message || 'No se pudo actualizar el programa.',
    });
  }
};

  
  
const eliminarDocente = async (id) => {
  const confirmacion = await Swal.fire({
    title: '¿Estás seguro?',
    text: 'Esta acción eliminará al docente permanentemente.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  });

  if (confirmacion.isConfirmed) {
    try {
      await axios.delete(`/api/docentes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      await fetchDocentes();

      Swal.fire({
        icon: 'success',
        title: '¡Docente eliminado!',
        text: 'El docente fue eliminado correctamente.',
        confirmButtonColor: '#1a237e',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Error al eliminar docente:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo eliminar el docente.',
        confirmButtonColor: '#d33'
      });
    }
  }
};


useEffect(() => {
  const fetchProgramasPorFacultad = async () => {
    if (!nuevaFacultadDocente) {
      setProgramas([]); // Limpia programas si no hay facultad seleccionada
      return;
    }

    try {
      const res = await axios.get(`/api/programas/facultad/${nuevaFacultadDocente}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProgramas(res.data); // ¡Cambia los programas mostrados!
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

    // Mostrar alerta de éxito
    Swal.fire({
      icon: 'success',
      title: 'Docente actualizado',
      text: 'Los datos del docente se actualizaron correctamente.',
      timer: 2000,
      showConfirmButton: false,
    });

    // Limpiar estado y recargar lista
    setEditandoDocenteId(null);
    fetchDocentes();

  } catch (error) {
    console.error('Error al actualizar docente:', error);

    if (error.response?.status === 409) {
      Swal.fire({
        icon: 'error',
        title: 'Correo duplicado',
        text: 'Ya existe otro usuario registrado con este correo.',
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'No se pudo actualizar el docente.',
      });
    }
  }
};

  const fetchLabores = async () => {
    try {
      const res = await axios.get('/api/labores', {
      headers: { Authorization: `Bearer ${token}` }
    });
      setLabores(res.data);
    } catch (error) {
      console.error('Error al cargar labores sociales:', error);
    }
  };

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
  const confirmacion = await Swal.fire({
    title: '¿Estás seguro?',
    text: 'Esta acción eliminará el servicio social permanentemente.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  });

  if (confirmacion.isConfirmed) {
    try {
      await axios.delete(`/api/labores/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      await fetchLabores();

      Swal.fire({
        icon: 'success',
        title: '¡Servicio social eliminado!',
        text: 'La labor fue eliminada correctamente.',
        confirmButtonColor: '#1a237e',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Error al eliminar labor social:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo eliminar el servicio social.',
        confirmButtonColor: '#d33'
      });
    }
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


  const fetchFacultades = async () => {
    try {
      const res = await axios.get('/api/facultades', {
      headers: { Authorization: `Bearer ${token}` }
    });
      setFacultades(res.data);
    } catch (error) {
      console.error('Error al cargar facultades:', error);
    }
  };

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
  const confirmacion = await Swal.fire({
    title: '¿Estás seguro?',
    text: 'Esta acción eliminará la facultad permanentemente.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  });

  if (confirmacion.isConfirmed) {
    try {
      await axios.delete(`/api/facultades/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      await fetchFacultades();

      Swal.fire({
        icon: 'success',
        title: '¡Facultad eliminada!',
        text: 'La facultad fue eliminada correctamente.',
        confirmButtonColor: '#1a237e',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Error al eliminar facultad:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo eliminar la facultad.',
        confirmButtonColor: '#d33'
      });
    }
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
}, [token]);

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
      className="facultades-btn-agregar"
      onClick={() => document.querySelector(".facultades-modal").classList.add("show")}
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
                  <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" width="16" height="16">
                                      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1.003 1.003 0 0 0 0-1.42l-2.34-2.34a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z"/>
                                    </svg>
                  </button>
                  <button
                    onClick={() => eliminarFacultad(f.id_facultad)}
                    className="facultades-btn eliminar"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" width="16" height="16">
                                      <path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-4.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z"/>
                                    </svg>
                  </button>
                </>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    {modalEditarVisible && (
  <div className="facultades-modal show">
    <div className="facultades-modal-content">
      <h3>Editar Facultad</h3>
      <input
        type="text"
        className="facultades-modal-input"
        placeholder="Nuevo nombre de la facultad"
        value={nombreEditado}
        onChange={(e) => setNombreEditado(e.target.value)}
      />
      <div className="facultades-modal-actions">
        <button
          className="facultades-btn cancelar"
          onClick={() => {
            cancelarEdicion();
            setModalEditarVisible(false);
          }}
        >
          Cancelar
        </button>
        <button
        className="facultades-btn guardar"
        onClick={async () => {
          await guardarEdicionFacultad(editandoId);
          setModalEditarVisible(false);
        }}
      >
        Guardar
      </button>
      </div>
    </div>
  </div>
)}

    {/* Modal personalizado */}
    <div className="facultades-modal">
      <div className="facultades-modal-content">
        <h3>Nueva Facultad</h3>
        <input
          type="text"
          className="facultades-modal-input"
          placeholder="Nombre de la facultad"
          value={nuevaFacultad}
          onChange={(e) => setNuevaFacultad(e.target.value)}
        />
        <div className="facultades-modal-actions">
          <button
            className="facultades-btn cancelar"
            onClick={() => {
              document.querySelector(".facultades-modal").classList.remove("show");
              setNuevaFacultad('');
            }}
          >
            Cancelar
          </button>
          <button
            className="facultades-btn guardar"
            onClick={() => {
              crearFacultad();
              document.querySelector(".facultades-modal").classList.remove("show");
            }}
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  </div>
)}


 
{activeSection === 'programas' && (
  <div className="programas-container">
    <div className="programas-card">
    <div className="programas-header">
  <div className="programas-header-left">
    <h2>Programas Académicos</h2>
    <button
      className="programas-btn-agregar"
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
            className="programas-btn editar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" width="16" height="16">
                      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1.003 1.003 0 0 0 0-1.42l-2.34-2.34a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z"/>
                    </svg>
          </button>
          <button
            onClick={() => eliminarPrograma(prog.id_programa)}
            className="programas-btn eliminar"
          >
           <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" width="16" height="16">
                      <path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-4.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z"/>
                    </svg>
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

{modalEditarProgramaVisible && (
  <div className="programas-modal show">
    <div className="programas-modal-content">
      <h3>Editar Programa Académico</h3>

      <input
        type="text"
        className="programas-modal-input"
        placeholder="Nombre del programa"
        value={programaEditado}
        onChange={(e) => setProgramaEditado(e.target.value)}
        autoFocus
      />

      <select
        className="programas-modal-select"
        value={facultadEditada}
        onChange={(e) => setFacultadEditada(e.target.value)}
      >
        <option value="">Selecciona una facultad</option>
        {facultades.map((fac) => (
          <option key={fac.id_facultad} value={fac.id_facultad}>
            {fac.nombre_facultad}
          </option>
        ))}
      </select>

      <input
        type="email"
        className="programas-modal-input"
        placeholder="Correo institucional"
        value={emailEditado}
        onChange={(e) => setEmailEditado(e.target.value)}
      />

      <div className="programas-modal-actions">
        <button
          className="programas-btn cancelar"
          onClick={() => {
            setModalEditarProgramaVisible(false);
            setIdEditandoPrograma(null);
            setProgramaEditado('');
            setFacultadEditada('');
            setEmailEditado('');
          }}
        >
          Cancelar
        </button>
        <button
          className="programas-btn guardar"
          onClick={guardarEdicionPrograma}
        >
          Guardar
        </button>
      </div>
    </div>
  </div>
)}


{modalProgramaVisible && (
  <div className="programas-modal show">
    <div className="programas-modal-content">
      <h3>Nuevo Programa Académico</h3>

      {/* Input del nombre */}
      <input
        type="text"
        className="programas-modal-input"
        placeholder="Nombre del programa"
        value={nuevoPrograma}
        onChange={(e) => setNuevoPrograma(e.target.value)}
      />

      {/* Select de facultades */}
      <select
        className="programas-modal-select"
        value={facultadPrograma}
        onChange={(e) => setFacultadPrograma(e.target.value)}
      >
        <option value="">Selecciona una facultad</option>
        {facultades.map((fac) => (
          <option key={fac.id_facultad} value={fac.id_facultad}>
            {fac.nombre_facultad}
          </option>
        ))}
      </select>
      <input
        type="email"
        className="programas-modal-input"
        placeholder="Correo institucional del programa"
        value={emailPrograma}
        onChange={(e) => setEmailPrograma(e.target.value)}
      />
      <input
        type="text"
        className="programas-modal-input"
        placeholder="WhatsApp del programa"
        value={whatsappPrograma}
        onChange={(e) => {
          const value = e.target.value;
          if (/^\d{0,9}$/.test(value)) {
            setWhatsappPrograma(value);
          }
        }}
      />
      <div className="programas-modal-actions">
        <button
          className="programas-btn cancelar"
          onClick={() => {
            setModalProgramaVisible(false);
            setNuevoPrograma('');
            setFacultadPrograma('');
            setEmailPrograma('');
            setWhatsappPrograma('');
          }}
        >
          Cancelar
        </button>
        <button
          className="programas-btn guardar"
          onClick={() => {
            if (whatsappPrograma.length !== 9) {
              Swal.fire({
                icon: 'error',
                title: 'Número inválido',
                text: 'El número de WhatsApp debe tener exactamente 9 dígitos.',
                confirmButtonColor: '#d33'
              });
              return;
            }
            crearPrograma();
            setModalProgramaVisible(false);
          }}
        >
          Guardar
        </button>
      </div>
    </div>
  </div>
)}

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
                        className="docentes-btn eliminar"
                        title="Eliminar designación"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" width="16" height="16">
                          <path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-4.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z"/>
                        </svg>
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
                        >
                          Aprobar
                        </button>
                        <button
                          className="btn-accion rechazar"
                          onClick={() => rechazarInforme(inf.id)}
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
      className="agregar-btn"
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
{modalEstudianteVisible && (
  <div className="docentes-modal show">
    <div className="docentes-modal-content">
      <h3>Agregar Estudiante</h3>
      <input
        type="text"
        className="docentes-modal-input"
        placeholder="Código Universitario (10 dígitos)"
        value={codigoUniversitario}
        maxLength={10}
        onChange={(e) => {
          const value = e.target.value;
          if (/^\d{0,10}$/.test(value)) {
            setCodigoUniversitario(value);
          }
        }}
      />
      <input
        type="text"
        className="docentes-modal-input"
        placeholder="WhatsApp del estudiante (9 dígitos)"
        value={nuevoDocenteWhatsapp}
        maxLength={9}
        onChange={(e) => {
          const value = e.target.value;
          if (/^\d{0,9}$/.test(value)) {
            setNuevoDocenteWhatsapp(value);
          }
        }}
      />

      <div className="docentes-modal-actions">
        <button
          className="docentes-btn cancelar"
          onClick={() => {
            setModalEstudianteVisible(false);
            setCodigoUniversitario('');
            setNuevoDocenteWhatsapp('');
          }}
        >
          Cancelar
        </button>
        <button
          className="docentes-btn guardar"
          onClick={async () => {
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
                  whatsapp: nuevoDocenteWhatsapp 
                },
                { headers: { Authorization: `Bearer ${token}` } }
              );

              Swal.fire({
                icon: "success",
                title: "Éxito",
                text: res.data.message,
              });

              // refrescar lista
              await fetchEstudiantes();
              setModalEstudianteVisible(false);
              setCodigoUniversitario('');
              setNuevoDocenteWhatsapp('');
            } catch (error) {
              console.error("❌ Error registrando estudiante:", error);

              Swal.fire({
                icon: "error",
                title: "Error",
                text: error.response?.data?.message || "No se pudo registrar el estudiante",
              });
            }
          }}
        >
          Guardar
        </button>
      </div>
    </div>
  </div>
)}





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
                <td>
  <button
    onClick={() => {
      setEditandoDocenteId(doc.id_docente);
      setNombreDocenteEditado(doc.nombre_docente);
      setEmailDocenteEditado(doc.email || '');
      setProgramaDocenteEditado(doc.programa_academico_id);
      setFacultadDocenteEditada(doc.facultad_id);
      setModalEditarDocenteVisible(true);
    }}
    className="docentes-btn editar"
  >
    <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" width="16" height="16">
      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1.003 1.003 0 0 0 0-1.42l-2.34-2.34a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z"/>
    </svg>
  </button>
  <button
    onClick={() => eliminarDocente(doc.id_docente)}
    className="docentes-btn eliminar"
  >
    <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" width="16" height="16">
      <path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-4.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z"/>
    </svg>
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

{modalEditarDocenteVisible && (
  <div className="docentes-modal show">
    <div className="docentes-modal-content">
      <h3>Editar Docente</h3>

      <input
        type="text"
        className="docentes-modal-input"
        placeholder="Nombre del docente"
        value={nombreDocenteEditado}
        onChange={(e) => setNombreDocenteEditado(e.target.value)}
        autoFocus
      />
         <input
        type="email"
        className="docentes-modal-input"
        placeholder="Correo del docente"
        value={emailDocenteEditado}
        onChange={(e) => setEmailDocenteEditado(e.target.value)}
      />
      <select
        className="docentes-modal-select"
        value={facultadDocenteEditada}
        onChange={(e) => setFacultadDocenteEditada(e.target.value)}
      >
        <option value="">Selecciona una facultad</option>
        {facultades.map((fac) => (
          <option key={fac.id_facultad} value={fac.id_facultad}>
            {fac.nombre_facultad}
          </option>
        ))}
      </select>

      <select
        className="docentes-modal-select"
        value={programaDocenteEditado}
        onChange={(e) => setProgramaDocenteEditado(e.target.value)}
      >
        <option value="">Selecciona un programa</option>
        {programas.map((prog) => (
          <option key={prog.id_programa} value={prog.id_programa}>
            {prog.nombre_programa}
          </option>
        ))}
      </select>

      <div className="docentes-modal-actions">
        <button
          className="docentes-btn cancelar"
          onClick={() => {
            setModalEditarDocenteVisible(false);
            setEditandoDocenteId(null);
            setNombreDocenteEditado('');
            setFacultadDocenteEditada('');
            setProgramaDocenteEditado('');
          }}
        >
          Cancelar
        </button>
        <button
          className="docentes-btn guardar"
          onClick={() => {
            guardarEdicionDocente(editandoDocenteId);
            setModalEditarDocenteVisible(false);
          }}
        >
          Guardar
        </button>
      </div>
    </div>
  </div>
)}

{modalDocenteVisible && (
  <div className="docentes-modal show">
    <div className="docentes-modal-content">
      <h3>Registrar Docente</h3>

      <input
        type="email"
        className="docentes-modal-input"
        placeholder="Email del docente"
        value={nuevoDocenteEmail}
        onChange={(e) => setNuevoDocenteEmail(e.target.value)}
      />
      <input
        type="text"
        className="docentes-modal-input"
        placeholder="WhatsApp del docente"
        value={nuevoDocenteWhatsapp}
        onChange={(e) => {
          const value = e.target.value;
          // Solo números y máximo 9 dígitos
          if (/^\d{0,9}$/.test(value)) {
            setNuevoDocenteWhatsapp(value);
          }
        }}
      />

    <select
      className="docentes-modal-select"
      value={nuevaFacultadDocente}
      onChange={(e) => {
        setNuevaFacultadDocente(e.target.value);
        setNuevoProgramaDocente(''); 
      }}
    >
      <option value="">Selecciona una facultad</option>
      {facultades.map((fac) => (
        <option key={fac.id_facultad} value={fac.id_facultad}>
          {fac.nombre_facultad}
        </option>
      ))}
    </select>
    <select
      className="docentes-modal-select"
      value={nuevoProgramaDocente}
      onChange={(e) => setNuevoProgramaDocente(e.target.value)}
    >
      <option value="">Selecciona un programa académico</option>
      {programas
        .filter((prog) => prog.id_facultad === parseInt(nuevaFacultadDocente)) 
        .map((prog) => (
          <option key={prog.id_programa} value={prog.id_programa}>
            {prog.nombre_programa}
          </option>
        ))}
    </select>


      <div className="docentes-modal-actions">
        <button
          className="docentes-btn cancelar"
          onClick={() => {
            setModalDocenteVisible(false);
            setNuevoDocenteEmail('');
            setNuevoDocenteDni('');
            setNuevoDocenteWhatsapp('');
            setNuevaFacultadDocente('');
            setNuevoProgramaDocente('');
          }}
        >
          Cancelar
        </button>
       <button
          className="docentes-btn guardar"
          onClick={() => {
            if (nuevoDocenteWhatsapp.length !== 9) {
              Swal.fire({
                icon: 'error',
                title: 'Número inválido',
                text: 'El número de WhatsApp debe tener exactamente 9 dígitos.',
                confirmButtonColor: '#d33'
              });
              return;
            }

            crearDocente();
            setModalDocenteVisible(false);
          }}
        >
          Guardar
        </button>
      </div>
    </div>
  </div>
)}
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
    <button className="labores-btn-agregar" onClick={() => setModalLaborVisible(true)}>
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
                className="labores-btn editar"
                onClick={() => {
                  setIdLaborEditando(labor.id_labores);
                  setNombreLaborEditado(labor.nombre_labores);
                  setLineaLabor(labor.linea_accion_id);
                  setModalEditarLaborVisible(true);
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" width="16" height="16">
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1.003 1.003 0 0 0 0-1.42l-2.34-2.34a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z"/>
                </svg>
                &nbsp;
              </button>
              <button
                className="labores-btn eliminar"
                onClick={() => eliminarLabor(labor.id_labores)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" width="16" height="16">
                  <path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-4.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z"/>
                </svg>
                &nbsp;
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
                    <button
                        className="btn-ver-pdf"
                        onClick={() => verSeguimiento(est.id_estudiante)}
                        title="Ver detalle"
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




{activeSection === 'lineas' && (
  <div className="labores-container">
    <div className="labores-card">
      <div className="labores-header">
        <div className="labores-header-title">
          <h2>Líneas de Acción</h2>
          <button className="labores-btn-agregar" onClick={() => setModalLineaVisible(true)}>Agregar</button>
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
                  <td>
                    <button
                      className="labores-btn editar"
                      onClick={() => {
                        setIdEditandoLinea(l.id_linea);
                        setNombreLineaEditado(l.nombre_linea);
                        setModalEditarLineaVisible(true);
                      }}
                    >
                      Editar
                    </button>
                    <button
                      className="labores-btn eliminar"
                      onClick={() => eliminarLinea(l.id_linea)}
                    >
                      Eliminar
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



{modalSeguimientoVisible && seguimiento && (
  <div className="seguimiento-overlay">
    <div className="seguimiento-modal-box">
      <h3 className="seguimiento-title">Seguimiento de {seguimiento.estudiante}</h3>
      
      <div className="seguimiento-info">
        <p><span>Email:</span> {seguimiento.email}</p>
        <p><span>Programa:</span> {seguimiento.programa}</p>
      </div>
      <ul className="seguimiento-timeline-horizontal">
      {seguimiento.pasos.map((p, i) => (
        <li key={i} className={`timeline-h-item timeline-${p.estado}`}>
          <div className="timeline-h-marker"></div>
          <div className="timeline-h-content">
            <span className="timeline-h-title">
              {p.paso}
              <div className="tooltip-container">
                <svg xmlns="http://www.w3.org/2000/svg" 
                  className="icono-info" 
                  viewBox="0 0 24 24" 
                  width="16" height="16" 
                  fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                <div className="tooltip-box">
                  {p.tooltip}
                </div>
              </div>
            </span>
            <span className="timeline-h-status">{p.estado.toUpperCase()}</span>
          </div>
        </li>
      ))}
    </ul>

      <div className="seguimiento-actions">
        <button 
          className="seguimiento-btn-cerrar" 
          onClick={() => setModalSeguimientoVisible(false)}
        >
          Cerrar
        </button>
      </div>
    </div>
  </div>
)}



{modalLineaVisible && (
  <div className="labores-modal show">
    <div className="labores-modal-content">
      <h3>Registrar Línea de Acción</h3>
      <input
        type="text"
        className="labores-modal-input"
        placeholder="Nombre de la línea"
        value={nuevaLinea}
        onChange={(e) => setNuevaLinea(e.target.value)}
      />
      <div className="labores-modal-actions">
        <button
          className="labores-btn cancelar"
          onClick={() => {
            setModalLineaVisible(false);
            setNuevaLinea('');
          }}
        >
          Cancelar
        </button>
        <button
          className="labores-btn guardar"
          onClick={() => {
            crearLinea();
            setModalLineaVisible(false);
          }}
        >
          Guardar
        </button>
      </div>
    </div>
  </div>
)}


{modalEditarLineaVisible && (
  <div className="labores-modal show">
    <div className="labores-modal-content">
      <h3>Editar Línea de Acción</h3>
      <input
        type="text"
        className="labores-modal-input"
        placeholder="Nombre de la línea"
        value={nombreLineaEditado}
        onChange={(e) => setNombreLineaEditado(e.target.value)}
      />
      <div className="labores-modal-actions">
        <button
          className="labores-btn cancelar"
          onClick={() => {
            setModalEditarLineaVisible(false);
            setIdEditandoLinea(null);
          }}
        >
          Cancelar
        </button>
        <button
          className="labores-btn guardar"
          onClick={() => {
            guardarEdicionLinea(idEditandoLinea);
            setModalEditarLineaVisible(false);
          }}
        >
          Guardar
        </button>
      </div>
    </div>
  </div>
)}



{modalEditarLaborVisible && (
  <div className="labores-modal show">
    <div className="labores-modal-content">
      <h3>Editar Labor Social</h3>

      <input
        type="text"
        className="labores-modal-input"
        placeholder="Nombre de la labor"
        value={nombreLaborEditado}
        onChange={(e) => setNombreLaborEditado(e.target.value)}
      />

      <select
      className="labores-modal-select"
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


      <div className="labores-modal-actions">
        <button
          className="labores-btn cancelar"
          onClick={() => {
            setModalEditarLaborVisible(false);
            setIdLaborEditando(null);
            setNombreLaborEditado('');
            setLineaLabor('');
          }}
        >
          Cancelar
        </button>
        <button
          className="labores-btn guardar"
          onClick={async () => {
            await guardarEdicionLabor(idLaborEditando);
            setModalEditarLaborVisible(false);
          }}
        >
          Guardar
        </button>
      </div>
    </div>
  </div>
)}

{modalLaborVisible && (
  <div className="labores-modal show">
    <div className="labores-modal-content">
      <h3>Registrar Servicio Social</h3>

      <input
        type="text"
        className="labores-modal-input"
        placeholder="Nombre del servicio social"
        value={nuevaLabor}
        onChange={(e) => setNuevaLabor(e.target.value)}
      />

      <select
      className="labores-modal-select"
      value={lineaLabor}
      onChange={(e) => setLineaLabor(e.target.value)}
    >
      <option value="">-- Línea de Acción --</option>
      {lineas.map((linea) => (
        <option key={linea.id_linea} value={linea.id_linea}>
          {linea.nombre_linea}
        </option>
      ))}
    </select>


      <div className="labores-modal-actions">
        <button
          className="labores-btn cancelar"
          onClick={() => {
            setModalLaborVisible(false);
            setNuevaLabor('');
            setLineaLabor('');
          }}
        >
          Cancelar
        </button>
        <button
          className="labores-btn guardar"
          onClick={() => {
            crearLabor();
            setModalLaborVisible(false);
          }}
        >
          Guardar
        </button>
      </div>
    </div>
  </div>
)}   
      </div>
      </div>
  );
  
}

export default DashboardGestor;

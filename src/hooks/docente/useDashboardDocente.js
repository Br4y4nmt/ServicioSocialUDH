import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../../UserContext';
import { useWelcomeToast, showTopWarningToast } from '../alerts/useWelcomeToast';
import {
  alertSuccess,
  mostrarAlertaCompletarPerfilPrimeraVez,
  alertquestion,
  alertWarning,
  alertError,
  
} from '../alerts/alertas';
import { procesarAceptacionTrabajo } from '../../services/cartaAceptacionService';


const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};


export function useDashboardDocente() {
  const { user } = useUser();
  const token = user?.token;
  const navigate = useNavigate();
  useWelcomeToast();

  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 768);
  const [collapsed, setCollapsed] = useState(() => window.innerWidth <= 768);
  const [activeSection, setActiveSection] = useState('revision');
  const [loading, setLoading] = useState(true);
  const [trabajosSociales, setTrabajosSociales] = useState([]);
  const [firmaDocente, setFirmaDocente] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalGrupoVisible, setModalGrupoVisible] = useState(false);
  const [modalDeclinarVisible, setModalDeclinarVisible] = useState(false);
  const [selectedTrabajo, setSelectedTrabajo] = useState(null);
  const [nuevoEstado, setNuevoEstado] = useState('');
  const [integrantesGrupo, setIntegrantesGrupo] = useState([]);
  const [trabajoEnProcesoId, setTrabajoEnProcesoId] = useState(null);
  const [observacionDeclinar, setObservacionDeclinar] = useState('');


  useEffect(() => {
    const handleResize = debounce(() => {
      setIsMobile(window.innerWidth <= 768);
    }, 150);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  useEffect(() => {
    const usuarioId = localStorage.getItem('id_usuario');

    if (!usuarioId || !token) {
      console.error('Faltan el ID del usuario o el token.');
      setLoading(false);
      return;
    }

    axios.get(`/api/usuarios/${usuarioId}/primera-vez`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(async res => {
        if (res.data.primera_vez) {
          const result = await mostrarAlertaCompletarPerfilPrimeraVez();
          if (result.isConfirmed) navigate('/perfil-docente');
          setLoading(false);
          return;
        }

        axios.get(`/api/docentes/usuario/${usuarioId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
          .then(response => {
            const docenteId = response.data.id_docente;
            setFirmaDocente(response.data.firma);

            axios.get(`/api/trabajo-social/docente/${docenteId}`, {
              headers: { Authorization: `Bearer ${token}` }
            })
              .then(res => {
                setTrabajosSociales(res.data);
                setLoading(false);
              })
              .catch(err => {
                console.error('Error al obtener trabajos sociales:', err);
                const mensaje = err.response?.data?.message;
                alertError('Error al obtener trabajos', mensaje || 'Inténtalo más tarde.');
                setLoading(false);
              });
          })
          .catch(async error => {
            console.error('Error al obtener datos del docente:', error);
            const mensaje = error.response?.data?.message;
            await alertError('Error al obtener datos del docente', mensaje || 'Inténtalo más tarde.');
            setLoading(false);
          });
      })
      .catch(err => {
        console.error('Error al verificar primera vez del docente:', err);
        setLoading(false);
      });

  }, [token, navigate]);


  const toggleSidebar = useCallback(() => {
    setCollapsed(prev => !prev);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalVisible(false);
  }, []);

  const handleVerGrupo = useCallback(async (trabajoId) => {
    try {
      const { data: integrantes } = await axios.get(`/api/integrantes/${trabajoId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const correos = integrantes.map(item => item.correo_institucional);
      const { data: nombresYCorreos } = await axios.post(
        '/api/estudiantes/grupo-nombres',
        { correos },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIntegrantesGrupo(nombresYCorreos);
      setModalGrupoVisible(true);

    } catch (error) {
      console.error('Error al obtener integrantes del grupo:', error);
      alert('No se pudieron cargar los integrantes del grupo');
    }
  }, [token]);

  const cerrarModalGrupo = useCallback(() => {
    setModalGrupoVisible(false);
    setIntegrantesGrupo([]);
  }, []);

  const handleSave = useCallback(async () => {
    if (!selectedTrabajo) return;

    try {
      await axios.put(
        `/api/trabajo-social/${selectedTrabajo.id}`,
        { estado_plan_labor_social: nuevoEstado },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (nuevoEstado === 'aceptado') {
        await procesarAceptacionTrabajo({
          trabajo: selectedTrabajo,
          firmaDocente,
          token
        });
          await alertSuccess('Trabajo aceptado', 'Has aceptado el plan de servicio social.');
      }

      setTrabajosSociales(prev =>
        prev.map(trabajo =>
          trabajo.id === selectedTrabajo.id
            ? { ...trabajo, estado_plan_labor_social: nuevoEstado }
            : trabajo
        )
      );

      setModalVisible(false);

    } catch (error) {
      console.error('Error al guardar cambios:', error);
      if (error.message === 'SIN_DATOS_GRUPO') {
        await alertWarning('Faltan datos del grupo', 'El grupo no tiene suficientes integrantes registrados.');
      } else {
        const mensajeBackend = error.response?.data?.message;
          await alertError('No se pudo guardar los cambios', mensajeBackend || 'Inténtalo más tarde.');
      }
    }
  }, [selectedTrabajo, nuevoEstado, token, firmaDocente]);

  const handleCambiarEstado = useCallback(async (trabajo, nuevoEstadoParam) => {
    if (trabajoEnProcesoId !== null) return;
    setTrabajoEnProcesoId(trabajo.id);

    if (nuevoEstadoParam === 'aceptado') {
      const result = await alertquestion();
      if (!result.isConfirmed) {
        setTrabajoEnProcesoId(null);
        return;
      }
    }

    try {
      await axios.put(
        `/api/trabajo-social/${trabajo.id}`,
        { estado_plan_labor_social: nuevoEstadoParam },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (nuevoEstadoParam === 'aceptado') {
        try {
          await procesarAceptacionTrabajo({
            trabajo,
            firmaDocente,
            token
          });
          } catch (err) {
          if (err.message === 'SIN_DATOS_GRUPO') {
            await alertWarning('Faltan datos del grupo', 'El grupo no tiene suficientes integrantes registrados.');
            return;
          }
          console.error('Error al procesar aceptación:', err);
          await alertError('Servidor UDH inalcanzable', 'La conexión con el servidor de la UDH falló. Intenta nuevamente más tarde.');
          return;
        }
      }

      setTrabajosSociales(prev =>
        prev.map(t =>
          t.id === trabajo.id ? { ...t, estado_plan_labor_social: nuevoEstadoParam } : t
        )
      );

      await alertSuccess(
        `Trabajo ${nuevoEstadoParam === 'aceptado' ? 'aceptado' : 'rechazado'}`,
        `Has marcado este trabajo como ${nuevoEstadoParam}.`
      );

    } catch (error) {
      console.error(`Error al cambiar estado a ${nuevoEstadoParam}:`, error);
      const backendMessage = error.response?.data?.message;
      await alertError('No se pudo cambiar el estado', backendMessage || 'Inténtalo más tarde.');
    } finally {
      setTrabajoEnProcesoId(null);
    }
  }, [trabajoEnProcesoId, token, firmaDocente]);

  const handleDeclinar = useCallback(async () => {
    if (!observacionDeclinar.trim()) {
      showTopWarningToast('Observación requerida', 'Por favor, escriba una observación antes de enviar.');
      return;
    }

    if (!selectedTrabajo) {
      await alertError('Error', 'No se ha seleccionado ningún trabajo.');
      return;
    }

    const nuevoEstadoFinal =
      selectedTrabajo.estado_plan_labor_social === 'aceptado'
        ? 'rechazado'
        : 'aceptado';

    try {
      await axios.post(
        `/api/trabajo-social/declinar`,
        {
          trabajo_id: selectedTrabajo.id,
          observacion: observacionDeclinar,
          nuevo_estado: nuevoEstadoFinal
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTrabajosSociales(prev =>
        prev.map(t =>
          t.id === selectedTrabajo.id
            ? { ...t, estado_plan_labor_social: nuevoEstadoFinal }
            : t
        )
      );

      await alertSuccess(
        nuevoEstadoFinal === 'rechazado' ? 'Trabajo rechazado' : 'Trabajo aceptado',
        'El motivo ha sido registrado correctamente.'
      );

      setModalDeclinarVisible(false);
      setObservacionDeclinar('');

    } catch (err) {
      console.error(err);
      const backendMessage = err.response?.data?.message;

      await alertError('No se puede declinar', backendMessage || 'No se pudo guardar la observación.');
    }
  }, [observacionDeclinar, selectedTrabajo, token]);

  const abrirModalDeclinar = useCallback((trabajo) => {
    setSelectedTrabajo(trabajo);
    setModalDeclinarVisible(true);
  }, []);

  const cerrarModalDeclinar = useCallback(() => {
    setModalDeclinarVisible(false);
    setObservacionDeclinar('');
  }, []);

  return {
    // Estados reactivos
    isMobile,
    collapsed,
    activeSection,
    setActiveSection,
    loading,
    
    // Datos
    trabajosSociales,
    firmaDocente,
    
    // Estados de modales
    modalVisible,
    modalGrupoVisible,
    modalDeclinarVisible,
    
    // Estados de trabajo
    selectedTrabajo,
    nuevoEstado,
    setNuevoEstado,
    integrantesGrupo,
    trabajoEnProcesoId,
    observacionDeclinar,
    setObservacionDeclinar,
    
    // Handlers
    toggleSidebar,
    handleCloseModal,
    handleVerGrupo,
    cerrarModalGrupo,
    handleSave,
    handleCambiarEstado,
    handleDeclinar,
    abrirModalDeclinar,
    cerrarModalDeclinar,
    
    // Navegación
    navigate
  };
}

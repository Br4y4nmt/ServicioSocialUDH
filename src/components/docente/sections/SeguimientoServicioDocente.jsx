import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import Header from '../../layout/Header/Header';
import SidebarDocente from 'components/layout/Sidebar/SidebarDocente';
import axios from 'axios';
import Swal from 'sweetalert2';
import './RevisionPlanSocial.css';
import '../DashboardDocente.css';
import VerBoton from "../../../hooks/componentes/VerBoton";
import SearchInput from '../../gestor/SearchInput';
import PageSkeleton from '../../loaders/PageSkeleton';
import GrupoDocenteModal from '../../modals/GrupoDocenteModal';
import EvidenciaModal from '../../modals/EvidenciaModal';
import CronogramaActividadesDocenteModal from '../../modals/CronogramaActividadesDocenteModal';
import MotivoRechazoModal from '../../modals/MotivoRechazoModal';
import { showTopSuccessToast } from '../../../hooks/alerts/useWelcomeToast';
import { useUser } from '../../../UserContext';
import {
  procesarAprobacionCartasTermino,
  obtenerFirmaDocenteBase64
} from '../../../services/cartaTerminoService';
import {
  alertconfirmacion,
  alertError,
  alertSuccess,
} from "../../../hooks/alerts/alertas";
import FullScreenSpinner from 'components/ui/FullScreenSpinner';
import TablePagination from '../../ui/TablePagination';

function SeguimientoServicioDocente() {
  const [collapsed, setCollapsed] = useState(false);
  const [trabajosSociales, setTrabajosSociales] = useState([]);
  const [activeSection, setActiveSection] = useState('seguimiento');
  const [modalVisible, setModalVisible] = useState(false);
  const [cronogramaSeleccionado, setCronogramaSeleccionado] = useState([]);
  const [modalEvidenciaVisible, setModalEvidenciaVisible] = useState(false);
  const [imagenEvidencia, setImagenEvidencia] = useState('');
  const [observacion, setObservacion] = useState('');
  const observacionRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [actividadSeleccionadaId, setActividadSeleccionadaId] = useState(null);
  const [modalObservacionVisible, setModalObservacionVisible] = useState(false);
  const { user } = useUser();
  const token = user?.token;
  const [firmaDocente, setFirmaDocente] = useState('');
  const [modalGrupoVisible, setModalGrupoVisible] = useState(false);
  const [integrantesGrupo, setIntegrantesGrupo] = useState([]);
  const [isAprobando, setIsAprobando] = useState(false);
  const [progresoAprobacion, setProgresoAprobacion] = useState({ actual: 0, total: 0, mensaje: '' });
  const [searchTerm, setSearchTerm] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const trabajosFiltrados = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    const base = term
      ? trabajosSociales.filter((plan) => {
          const estudiante = plan.Estudiante?.nombre_estudiante || '';
          const programa = plan.ProgramasAcademico?.nombre_programa || '';
          const servicio = plan.LaboresSociale?.nombre_labores || '';
          const tipo = plan.tipo_servicio_social || '';

          return [estudiante, programa, servicio, tipo]
            .some((valor) => String(valor).toLowerCase().includes(term));
        })
      : trabajosSociales;

    return [...base].sort((a, b) => {
      const aSolicitada = a.solicitud_termino === 'solicitada';
      const bSolicitada = b.solicitud_termino === 'solicitada';
      if (aSolicitada === bSolicitada) return 0;
      return aSolicitada ? -1 : 1;
    });
  }, [trabajosSociales, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(trabajosFiltrados.length / ITEMS_PER_PAGE));
  const inicio = (currentPage - 1) * ITEMS_PER_PAGE;
  const trabajosSocialesPagina = trabajosFiltrados.slice(inicio, inicio + ITEMS_PER_PAGE);

  const handleVerGrupo = async (trabajoId) => {
    try {
      const response = await axios.get(`/api/integrantes/${trabajoId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const integrantes = Array.isArray(response.data)
        ? response.data.map((item) => ({
            correo: item.correo || item.correo_institucional || 'CORREO NO DISPONIBLE',
            nombre: item.nombre || item.nombre_completo || 'NOMBRE NO DISPONIBLE'
          }))
        : [];

      setIntegrantesGrupo(integrantes);
      setModalGrupoVisible(true);

    } catch (error) {
      console.error('Error al obtener integrantes del grupo:', error);
      alert('No se pudieron cargar los integrantes del grupo');
    }
  };

  const cerrarModalGrupo = useCallback(() => {
    setModalGrupoVisible(false);
    setIntegrantesGrupo([]);
  }, []);

  const toggleSidebar = useCallback(() => {
    setCollapsed(prev => !prev);
  }, []);

  const actualizarSolicitud = useCallback(async (trabajoId, nuevoEstado, plan) => {
    if (isAprobando) return;

    try {
      if (nuevoEstado === "rechazada") {
        const result = await alertconfirmacion({
          title: 'Rechazar solicitud',
          text: '¿Deseas rechazar esta solicitud de término? Esta acción no se puede deshacer.',
          icon: 'warning',
          confirmButtonText: 'Sí, rechazar',
          cancelButtonText: 'Cancelar'
        });
        if (!result.isConfirmed) return;
      }

      if (nuevoEstado === "aprobada") {
        setIsAprobando(true);
        setProgresoAprobacion({ actual: 0, total: 0, mensaje: "Iniciando aprobación..." });
        await new Promise((r) => setTimeout(r, 50));
      }

      await axios.patch(
        `/api/trabajo-social/${trabajoId}/respuesta-carta-termino`,
        { solicitud_termino: nuevoEstado },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTrabajosSociales((prev) =>
        prev.map((t) => (t.id === trabajoId ? { ...t, solicitud_termino: nuevoEstado } : t))
      );

      if (nuevoEstado === "aprobada") {
        try {
          await procesarAprobacionCartasTermino({
            plan,
            firmaBase64: firmaDocente,
            token,
            onProgreso: setProgresoAprobacion
          });
        } catch (err) {
          if (err.message === 'SIN_DATOS_INTEGRANTES') {
            await Swal.fire({
              icon: "warning",
              title: "Sin integrantes del grupo",
              text: "No se encontraron integrantes para generar cartas de término.",
            });
            return;
          }
          throw err;
        }

        setIsAprobando(false);
        setProgresoAprobacion({ actual: 0, total: 0, mensaje: "" });
        await new Promise((r) => setTimeout(r, 50));
      }

      await Swal.fire({
        icon: "success",
        title: "Solicitud actualizada",
        text: `La solicitud fue ${nuevoEstado === "aprobada" ? "aprobada" : "rechazada"} correctamente.`,
        timer: 2500,
        timerProgressBar: true,
        showConfirmButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
      });

    } catch (error) {
      console.error("Error al actualizar solicitud:", error);
      setIsAprobando(false);
      setProgresoAprobacion({ actual: 0, total: 0, mensaje: "" });

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo actualizar la solicitud de término.",
      });
    }
  }, [isAprobando, token, firmaDocente]);

  useEffect(() => {
    const cargarDatos = async () => {
      const usuarioId = localStorage.getItem('id_usuario');

      if (!usuarioId || !token) {
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const { data: docente } = await axios.get(`/api/docentes/usuario/${usuarioId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const firmaBase64 = await obtenerFirmaDocenteBase64(docente.firma, token);
        setFirmaDocente(firmaBase64);

        const { data: trabajos } = await axios.get(`/api/trabajo-social/docente/${docente.id_docente}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setTrabajosSociales(trabajos);
      } catch (err) {
        console.error('Error cargando datos:', err);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [token]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleVerSeguimiento = (trabajoId) => {
    axios.get(`/api/cronograma/trabajo/${trabajoId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setCronogramaSeleccionado(res.data);
        setModalVisible(true);
      })
      .catch(err => console.error('Error al obtener cronograma:', err));
  };

  const handleVerEvidencia = (nombreArchivo) => {
    setImagenEvidencia(`${process.env.REACT_APP_API_URL}/uploads/evidencias/${nombreArchivo}`);
    setModalEvidenciaVisible(true);
  };

  const handleCerrarModalEvidencia = () => {
    setModalEvidenciaVisible(false);
    setImagenEvidencia('');
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setCronogramaSeleccionado([]);
  };

  const handleAprobar = async (actividadId) => {
    const result = await alertconfirmacion({
      title: 'Aprobar actividad',
      text: '¿Estás seguro de aprobar esta actividad? Se marcará como aprobada.',
      icon: 'question',
      confirmButtonText: 'Sí, aprobar',
      cancelButtonText: 'Cancelar'
    });

    if (!result.isConfirmed) return;

    try {
      await axios.patch(
        `/api/cronograma/${actividadId}/estado`,
        { estado: "aprobado" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCronogramaSeleccionado((prev) =>
        prev.map((act) =>
          act.id === actividadId ? { ...act, estado: "aprobado" } : act
        )
      );

      showTopSuccessToast(
        "¡Aprobado!",
        "La actividad fue aprobada correctamente."
      );
    } catch (err) {
      console.error("Error al aprobar:", err);
      await alertError('Error al aprobar', 'No se pudo aprobar la actividad.');
    }
  };

  const handleAbrirObservacion = (actividadId) => {
    setActividadSeleccionadaId(actividadId);
    setModalObservacionVisible(true);
  };

  const handleEnviarObservacion = () => {
    if (!observacion.trim()) {
      if (observacionRef && observacionRef.current) {
        observacionRef.current.setCustomValidity('Debes ingresar una observación antes de enviar.');
        observacionRef.current.reportValidity();
        observacionRef.current.setCustomValidity('');
      }
      return;
    }

    axios.patch(
      `/api/cronograma/${actividadSeleccionadaId}/observacion`,
      { observacion },
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then(async () => {
        setCronogramaSeleccionado(prev =>
          prev.map(act =>
            act.id === actividadSeleccionadaId
              ? { ...act, estado: 'observado', observacion }
              : act
          )
        );

        await alertSuccess('Observación registrada', 'La observación se registró correctamente.');
        setModalObservacionVisible(false);
        setObservacion('');
      })
      .catch(err => {
        console.error('Error al guardar observación:', err);
        alertError('Error al guardar observación', 'No se pudo guardar la observación. Intenta nuevamente.');
      });
  };

  return (
    <>
      <Header onToggleSidebar={toggleSidebar} />
      <SidebarDocente
        collapsed={collapsed}
        nombre={localStorage.getItem('nombre_usuario') || 'Docente'}
        onToggleSidebar={toggleSidebar}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      {window.innerWidth <= 768 && !collapsed && (
        <div
          className="sidebar-overlay"
          onClick={() => toggleSidebar()}
        ></div>
      )}

      <main className={`main-content${window.innerWidth <= 768 && !collapsed ? ' sidebar-open' : collapsed ? ' collapsed' : ''}`}>
        <div className="revision-container-d">
          <div className="revision-card">
            <div
              style={{
                marginBottom: '12px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '12px',
                flexWrap: 'wrap',
              }}
            >
              <h1 className="revision-title" style={{ margin: 0 }}>
                Seguimiento del Servicio Social
              </h1>

              <SearchInput
                value={searchTerm}
                onChange={(value) => {
                  setSearchTerm(value);
                  setCurrentPage(1);
                }}
                placeholder="Buscar por estudiante"
                label="Buscar:"
                className="docentes-search-label"
              />
            </div>

            <div className="revision-table-wrapper">
              {loading ? (
                <PageSkeleton topBlocks={["sm", "md"]} xlRows={3} showChip lastXL />
              ) : trabajosFiltrados.length > 0 ? (
                <>
                  <table className="revision-table">
                    <thead className="revision-table-thead">
                      <tr>
                        <th>N°</th>
                        <th>Estudiante</th>
                        <th>Programa Académico</th>
                        <th>Servicio Social</th>
                        <th>Tipo Servicio Social</th>
                        <th>Seguimiento</th>
                        <th>Solicitud de Término</th>
                      </tr>
                    </thead>
                    <tbody>
                      {trabajosSocialesPagina.map((plan, index) => (
                        <tr key={plan.id}>
                          <td>{inicio + index + 1}</td>
                          <td>{plan.Estudiante?.nombre_estudiante || 'No disponible'}</td>
                          <td>{plan.ProgramasAcademico?.nombre_programa || 'No definido'}</td>
                          <td>{plan.LaboresSociale?.nombre_labores || 'No definido'}</td>
                          <td>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                              <span>{plan.tipo_servicio_social}</span>
                              {plan.tipo_servicio_social === 'grupal' && (
                                <VerBoton
                                  onClick={() => handleVerGrupo(plan.id)}
                                  label="Ver"
                                />
                              )}
                            </div>
                          </td>
                          <td>
                            <VerBoton onClick={() => handleVerSeguimiento(plan.id)} />
                          </td>
                          <td>
                            {plan.solicitud_termino === 'solicitada' ? (
                              <div className="contenedor-botones-termino">
                                <button
                                  className="btn-accion aceptar"
                                  disabled={isAprobando}
                                  onClick={async () => {
                                    const result = await alertconfirmacion({
                                      title: 'Aceptar solicitud',
                                      text: '¿Deseas aceptar esta solicitud de término?',
                                      icon: 'question',
                                      confirmButtonText: 'Sí, aceptar',
                                      cancelButtonText: 'Cancelar'
                                    });
                                    if (result.isConfirmed) {
                                      actualizarSolicitud(plan.id, "aprobada", plan);
                                    }
                                  }}
                                >
                                  {isAprobando ? 'Procesando...' : 'Aceptar'}
                                </button>

                                <button
                                  className="btn-accion rechazar"
                                  disabled={isAprobando}
                                  onClick={() => actualizarSolicitud(plan.id, 'rechazada')}
                                >
                                  Rechazar
                                </button>
                              </div>
                            ) : (
                              <span>
                                <span className={`badge-estado ${plan.solicitud_termino === 'aprobada' ? 'aprobado' : plan.solicitud_termino === 'rechazada' ? 'rechazado' : 'no-solicitada'}`}>
                                  {(plan.solicitud_termino === 'aprobada' && 'APROBADO') ||
                                    (plan.solicitud_termino === 'rechazada' && 'RECHAZADO') ||
                                    'NO SOLICITADA'}
                                </span>
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <TablePagination
                    totalItems={trabajosFiltrados.length}
                    itemsPerPage={ITEMS_PER_PAGE}
                    currentPage={currentPage}
                    onPageChange={(page) => {
                      if (page >= 1 && page <= totalPages) {
                        setCurrentPage(page);
                      }
                    }}
                  />
                </>
              ) : (
                <p className="revision-no-data">No hay trabajos sociales disponibles aún.</p>
              )}
            </div>
          </div>
        </div>
      </main>

      <GrupoDocenteModal
        visible={modalGrupoVisible}
        integrantesGrupo={integrantesGrupo}
        onClose={cerrarModalGrupo}
      />

      <CronogramaActividadesDocenteModal
        visible={modalVisible}
        cronogramaSeleccionado={cronogramaSeleccionado}
        isAprobando={isAprobando}
        onClose={handleCloseModal}
        onAprobar={handleAprobar}
        onObservar={handleAbrirObservacion}
        onVerEvidencia={handleVerEvidencia}
      />

      <EvidenciaModal
        visible={modalEvidenciaVisible}
        imagen={imagenEvidencia}
        onClose={handleCerrarModalEvidencia}
      />
      <MotivoRechazoModal
        visible={modalObservacionVisible}
        title="Motivo de Observación"
        motivo={observacion}
        onChange={(e) => setObservacion(e.target.value)}
        onClose={() => setModalObservacionVisible(false)}
        readOnly={false}
        textareaRef={observacionRef}
        placeholder="Escribe tu observación aquí..."
        primaryActionLabel="Enviar"
        onPrimaryAction={handleEnviarObservacion}
        primaryActionDisabled={!observacion.trim()}
        secondaryActionLabel="Cancelar"
      />

      {isAprobando && (
        <FullScreenSpinner text={progresoAprobacion.mensaje || 'Generando documentos...'} />
      )}
    </>
  );
}

export default SeguimientoServicioDocente;
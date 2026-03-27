import React, { useEffect, useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import SearchInput from '../../gestor/SearchInput';
import { buscarSinTildes } from '../../../utils/textUtils';
import VerBoton from '../../../hooks/componentes/VerBoton';
import GrupoDocenteModal from '../../modals/GrupoDocenteModal';
import ModalObservacionConformidad from '../../modals/ModalObservacionConformidad';
import { alertconfirmacion } from '../../../hooks/alerts/alertas';
import { showTopSuccessToast, showTopErrorToast, showTopWarningToast } from '../../../hooks/alerts/useWelcomeToast';
import { useUser } from '../../../UserContext';
import Header from '../../layout/Header/Header';
import SidebarDocente from 'components/layout/Sidebar/SidebarDocente';
import PageSkeleton from '../../loaders/PageSkeleton';
import Spinner from 'components/ui/Spinner';
import TablePagination from '../../ui/TablePagination';
import '../DashboardDocente.css';

export default function SolicitudesInformesFinales() {
  const { user } = useUser();
  const token = user?.token;
  const [collapsed, setCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState('informes');
  const [informesFinales, setInformesFinales] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [procesandoId, setProcesandoId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalGrupoVisible, setModalGrupoVisible] = useState(false);
  const [integrantesGrupo, setIntegrantesGrupo] = useState([]);
  const [modalRechazoVisible, setModalRechazoVisible] = useState(false);
  const [motivoRechazo, setMotivoRechazo] = useState('');
  const [informeARechazar, setInformeARechazar] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const toggleSidebar = useCallback(() => {
    setCollapsed((c) => !c);
  }, []);

  const fetchData = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.get('/api/trabajo-social/informes-finales', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const lista = Array.isArray(data) ? data : [];
      setInformesFinales(lista);
    } catch (error) {
      console.error('Error cargando informes finales:', error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const informesFiltrados = useMemo(() => {
    return informesFinales.filter((inf) =>
      buscarSinTildes(inf.Estudiante?.nombre_estudiante || '', busqueda)
    );
  }, [informesFinales, busqueda]);

  const totalPages = Math.max(1, Math.ceil(informesFiltrados.length / ITEMS_PER_PAGE));
  const inicio = (currentPage - 1) * ITEMS_PER_PAGE;
  const informesPagina = informesFiltrados.slice(inicio, inicio + ITEMS_PER_PAGE);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    setCurrentPage(1);
  }, [busqueda]);

  const cambiarEstado = useCallback(
    async (id, nuevoEstado, observacion = null) => {
      if (!token) return false;

      try {
        setProcesandoId(id);

        const body = { nuevo_estado: nuevoEstado };
        if (observacion) {
          body.observacion = observacion;
        }

        await axios.patch(
          `/api/trabajo-social/estado/${id}`,
          body,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setInformesFinales((prev) =>
          prev.map((inf) =>
            inf.id === id
              ? { ...inf, estado_informe_final: nuevoEstado }
              : inf
          )
        );

        return true;
      } catch (error) {
        console.error(`Error al cambiar estado a ${nuevoEstado}:`, error);
        return false;
      } finally {
        setProcesandoId(null);
      }
    },
    [token]
  );

  const handleAprobar = async (id) => {
    if (!token) return;

    const confirm = await alertconfirmacion({
      title: '¿Estás seguro de aprobar este informe?',
      text: 'Esta acción marcará el informe como aprobado.',
      icon: 'warning',
      confirmButtonColor: '#39B49E',
      cancelButtonColor: '#003366',
      confirmButtonText: 'Sí, aprobar',
      cancelButtonText: 'Cancelar'
    });

    if (!confirm.isConfirmed) return;

    const ok = await cambiarEstado(id, 'aprobado');
    if (ok) {
      showTopSuccessToast('Informe aprobado', 'El informe final fue aprobado correctamente.');
    } else {
      showTopErrorToast('Error', 'No se pudo aprobar el informe.');
    }
  };

  const handleRechazar = (informe) => {
    setInformeARechazar(informe);
    setMotivoRechazo('');
    setModalRechazoVisible(true);
  };

  const handleEnviarRechazo = async () => {
    if (!motivoRechazo.trim()) {
      showTopWarningToast('Motivo requerido', 'Por favor, escriba el motivo del rechazo.');
      return;
    }

    if (!informeARechazar) return;

    const ok = await cambiarEstado(informeARechazar.id, 'rechazado', motivoRechazo.trim());
    if (ok) {
      showTopSuccessToast('Informe rechazado', 'El informe final fue rechazado correctamente.');
    } else {
      showTopErrorToast('Error', 'No se pudo rechazar el informe.');
    }

    setModalRechazoVisible(false);
    setMotivoRechazo('');
    setInformeARechazar(null);
  };

  const handleVerGrupo = async (trabajoId) => {
    if (!token) return;
    try {
      const { data: integrantes } = await axios.get(`/api/integrantes/${trabajoId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const integrantesNormalizados = Array.isArray(integrantes)
        ? integrantes.map((item) => ({
            correo: item.correo || item.correo_institucional || 'CORREO NO DISPONIBLE',
            nombre: item.nombre || item.nombre_completo || 'NOMBRE NO DISPONIBLE'
          }))
        : [];

      setIntegrantesGrupo(integrantesNormalizados);
      setModalGrupoVisible(true);
    } catch (error) {
      console.error('Error al obtener integrantes del grupo:', error);
      alert('No se pudieron cargar los integrantes del grupo');
    }
  };

  return (
    <>
      <Header onToggleSidebar={toggleSidebar} />
      <SidebarDocente
        collapsed={collapsed}
        nombre={localStorage.getItem('nombre_usuario')}
        onToggleSidebar={toggleSidebar}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      <main className={`main-content${collapsed ? ' collapsed' : ''}`}>
        <div className="revision-container-d">
          <div className="revision-card">
            <div className="docentes-header">
              <div className="docentes-header-left">
                <h2 className="revision-title">Informes Finales</h2>
              </div>

              <div className="docentes-header-right">
                <SearchInput
                  value={busqueda}
                  onChange={setBusqueda}
                  placeholder="Nombre del estudiante"
                  label="Buscar:"
                  className="docentes-search-label"
                />
              </div>
            </div>

            <div className="revision-table-wrapper">
              {loading ? (
                <PageSkeleton topBlocks={["sm", "md"]} xlRows={3} showChip lastXL />
              ) : informesFiltrados.length > 0 ? (
                <>
                  <table className="revision-table">
                    <thead className="revision-table-thead">
                      <tr>
                        <th>Nº</th>
                        <th>Estudiante</th>
                        <th>Programa</th>
                        <th>Plan</th>
                        <th>Fecha de Envío</th>
                        <th>Informe final</th>
                        <th>Tipo</th>
                        <th>Estado</th>
                      </tr>
                    </thead>

                    <tbody>
                      {informesPagina.map((inf, index) => (
                        <tr key={inf.id}>
                          <td>{inicio + index + 1}</td>

                          <td>
                            {(inf.Estudiante?.nombre_estudiante || 'SIN NOMBRE').toUpperCase()}
                          </td>

                          <td>
                            {(inf.ProgramasAcademico?.nombre_programa || 'SIN PROGRAMA').toUpperCase()}
                          </td>

                          <td>
                            {inf.archivo_plan_social ? (
                              <VerBoton
                                label="Ver"
                                onClick={() =>
                                  window.open(
                                    `${process.env.REACT_APP_API_URL}/uploads/planes_labor_social/${inf.archivo_plan_social}`,
                                    '_blank',
                                    'noopener,noreferrer'
                                  )
                                }
                              />
                            ) : (
                              <span className="no-generado">NO SUBIDO</span>
                            )}
                          </td>

                          <td>
                            {new Date(inf.createdAt).toLocaleDateString()}
                          </td>

                          <td>
                            {inf.informe_final_pdf ? (
                              <VerBoton
                                label="Ver"
                                onClick={() =>
                                  window.open(
                                    `${process.env.REACT_APP_API_URL}/uploads/informes_finales/${inf.informe_final_pdf}`,
                                    '_blank',
                                    'noopener,noreferrer'
                                  )
                                }
                              />
                            ) : (
                              <span className="no-generado">NO GENERADO</span>
                            )}
                          </td>

                          <td>
                            <div
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '6px'
                              }}
                            >
                              <span>
                                {(
                                  inf.trabajo_social?.tipo_servicio_social ||
                                  inf.tipo_servicio_social ||
                                  'N/D'
                                ).toUpperCase()}
                              </span>

                              {(inf.trabajo_social?.tipo_servicio_social || inf.tipo_servicio_social) === 'grupal' && (
                                <VerBoton
                                  label="Ver"
                                  title="Ver integrantes del grupo"
                                  onClick={() => handleVerGrupo(inf.id)}
                                />
                              )}
                            </div>
                          </td>

                          <td style={{ textAlign: 'center' }}>
                            {inf.estado_informe_final === 'pendiente' ? (
                              <div
                                style={{
                                  display: 'flex',
                                  gap: 8,
                                  justifyContent: 'center',
                                }}
                              >
                                <button
                                  className="btn-accion aceptar"
                                  onClick={() => handleAprobar(inf.id)}
                                  disabled={procesandoId === inf.id}
                                >
                                  {procesandoId === inf.id ? (
                                    <>
                                      <Spinner size={16} />
                                      <span style={{ marginLeft: 8 }}>Procesando...</span>
                                    </>
                                  ) : (
                                    'Aprobar'
                                  )}
                                </button>

                                <button
                                  className="btn-accion rechazar"
                                  onClick={() => handleRechazar(inf)}
                                  disabled={procesandoId === inf.id}
                                >
                                  Rechazar
                                </button>
                              </div>
                            ) : (
                              <span
                                className={`badge-estado ${
                                  inf.estado_informe_final === 'aprobado'
                                    ? 'aprobado'
                                    : 'rechazado'
                                }`}
                              >
                                {(inf.estado_informe_final || '').toUpperCase()}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <TablePagination
                    totalItems={informesFiltrados.length}
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
                <p className="revision-no-data">No se encontraron informes finales.</p>
              )}
            </div>
          </div>
        </div>
      </main>

      <GrupoDocenteModal
        visible={modalGrupoVisible}
        integrantesGrupo={integrantesGrupo}
        onClose={() => setModalGrupoVisible(false)}
      />

      <ModalObservacionConformidad
        visible={modalRechazoVisible}
        observacion={motivoRechazo}
        onObservacionChange={setMotivoRechazo}
        onCancelar={() => {
          setModalRechazoVisible(false);
          setMotivoRechazo('');
          setInformeARechazar(null);
        }}
        onEnviar={handleEnviarRechazo}
      />
    </>
  );
}
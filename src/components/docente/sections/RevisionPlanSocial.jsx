import React, { useState, useEffect, useMemo } from 'react';
import Header from '../../layout/Header/Header';
import './RevisionPlanSocial.css';
import '../DashboardDocente.css';
import { useNavigate } from 'react-router-dom';
import SidebarDocente from 'components/layout/Sidebar/SidebarDocente';
import { useUser } from '../../../UserContext'; 
import axios from 'axios';
import VerBoton from "../../../hooks/componentes/VerBoton";
import Swal from 'sweetalert2';
import PageSkeleton from '../../loaders/PageSkeleton';
import ModalObservacionConformidad from '../../modals/ModalObservacionConformidad';
import GrupoDocenteModal from '../../modals/GrupoDocenteModal';
import { showTopWarningToast } from '../../../hooks/alerts/useWelcomeToast';
import { alertSuccess, alertconfirmacion, alertError } from '../../../hooks/alerts/alertas';
import FullScreenSpinner from 'components/ui/FullScreenSpinner';
import TablePagination from '../../ui/TablePagination';
import SearchInput from '../../gestor/SearchInput';

function RevisionPlanSocial() {
  const [collapsed, setCollapsed] = useState(false);
  const [trabajosSociales, setTrabajosSociales] = useState([]);
  const [activeSection, setActiveSection] = useState('conformidad');
  const { user } = useUser(); 
  const token = user?.token;   
  const [modalObservacionVisible, setModalObservacionVisible] = useState(false);
  const [observacionTexto, setObservacionTexto] = useState('');
  const [loading, setLoading] = useState(true);
  const [trabajoADeclinar, setTrabajoADeclinar] = useState(null);
  const [modalGrupoVisible, setModalGrupoVisible] = useState(false);
  const [integrantesGrupo, setIntegrantesGrupo] = useState([]);
  const [cargandoCambioId, setCargandoCambioId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const navigate = useNavigate();

  const toggleSidebar = () => {
    setCollapsed(prev => !prev);
  };

  useEffect(() => {
    if (!token) {
      console.error('Falta el token');
      setLoading(false);
      return;
    }

    const usuarioId = localStorage.getItem('id_usuario');
    if (!usuarioId) {
      console.error('Falta el ID del usuario');
      setLoading(false);
      return;
    }

    setLoading(true);

    axios.get(`/api/docentes/usuario/${usuarioId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        const docenteId = response.data.id_docente;

        axios.get(`/api/trabajo-social/docente/${docenteId}/nuevo`, {
          headers: { Authorization: `Bearer ${token}` }
        })
          .then(res => {
            setTrabajosSociales(res.data);
          })
          .catch(error => {
            console.error('Error al obtener los trabajos sociales:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error al obtener trabajos sociales',
              text: 'No se pudieron cargar los trabajos sociales del docente.',
            });
          })
          .finally(() => {
            setLoading(false);
          });
      })
      .catch(error => {
        console.error('Error al obtener los datos del docente:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error al obtener datos del docente',
          text: 'No se pudo obtener la información del docente.',
        });
        setLoading(false);
      });
  }, [token]);

  const trabajosFiltrados = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return trabajosSociales;

    return trabajosSociales.filter((plan) => {
      const estudiante = plan.Estudiante?.nombre_estudiante || '';
      const programa = plan.ProgramasAcademico?.nombre_programa || '';
      const servicio = plan.LaboresSociale?.nombre_labores || '';
      const tipo = plan.tipo_servicio_social || '';

      return [estudiante, programa, servicio, tipo]
        .some((valor) => String(valor).toLowerCase().includes(term));
    });
  }, [trabajosSociales, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(trabajosFiltrados.length / ITEMS_PER_PAGE));
  const inicio = (currentPage - 1) * ITEMS_PER_PAGE;
  const trabajosSocialesPagina = trabajosFiltrados.slice(inicio, inicio + ITEMS_PER_PAGE);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

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

  const cambiarConformidad = async (idTrabajo, nuevoEstado) => {
    const accion = nuevoEstado === 'aceptado' ? 'aceptar' : 'rechazar';
    const confirmacion = await alertconfirmacion({
      title: `¿Estás seguro de ${accion} este trabajo?`,
      text: `Esta acción marcará el trabajo como ${nuevoEstado}.`,
      icon: 'warning',
      confirmButtonText: `Sí, ${accion}`,
      cancelButtonText: 'Cancelar'
    });

    if (confirmacion.isConfirmed) {
      setCargandoCambioId(idTrabajo);
      try {
        await axios.put(`/api/trabajo-social/${idTrabajo}`, {
          conformidad_plan_social: nuevoEstado
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setTrabajosSociales(prev =>
          prev.map(trabajo =>
            trabajo.id === idTrabajo ? { ...trabajo, conformidad_plan_social: nuevoEstado } : trabajo
          )
        );

        if (nuevoEstado === 'aceptado') {
          await alertSuccess('Trabajo aceptado', 'Has aceptado el plan de servicio social.');
        } else {
          await alertSuccess('Trabajo rechazado', 'Has rechazado el plan de servicio social.');
        }

      } catch (error) {
        console.error('Error al cambiar estado de conformidad:', error);
        await alertError('Error', 'No se pudo cambiar el estado del trabajo.');
      } finally {
        setCargandoCambioId(null);
      }
    }
  };

  const capitalizarPrimeraLetra = (texto) =>
    texto ? texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase() : '';

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

      {cargandoCambioId && <FullScreenSpinner text="Procesando..." />}

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
                Conformidad Servicio Social
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
                        <th>Estado</th>
                        <th>Documento</th>
                        <th>Tipo Servicio Social</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {trabajosSocialesPagina.map((plan, index) => (
                        <tr key={plan.id}>
                          <td>{inicio + index + 1}</td>
                          <td>{plan.Estudiante ? plan.Estudiante.nombre_estudiante : 'No disponible'}</td>
                          <td>{plan.ProgramasAcademico?.nombre_programa || 'No definido'}</td>
                          <td>{plan.LaboresSociale?.nombre_labores || 'No definido'}</td>
                          <td>
                            <span className={`estado-badge ${plan.conformidad_plan_social} estado-texto-normal`}>
                              {capitalizarPrimeraLetra(plan.conformidad_plan_social) || 'No definido'}
                            </span>
                          </td>

                          <td>
                            {plan.archivo_plan_social ? (
                              <VerBoton
                                label="Ver"
                                onClick={() =>
                                  window.open(
                                    `${process.env.REACT_APP_API_URL}/uploads/planes_labor_social/${plan.archivo_plan_social}`,
                                    "_blank"
                                  )
                                }
                              />
                            ) : (
                              <span className="texto-no-subido">No subido</span>
                            )}
                          </td>

                          <td>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                              <span>{plan.tipo_servicio_social}</span>
                              {plan.tipo_servicio_social === 'grupal' && (
                                <VerBoton
                                  label="Ver"
                                  title="Ver integrantes del grupo"
                                  onClick={() => handleVerGrupo(plan.id)}
                                />
                              )}
                            </div>
                          </td>

                          <td>
                            {plan.conformidad_plan_social === 'pendiente' ? (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <button
                                  className="btn-accion aceptar"
                                  onClick={() => cambiarConformidad(plan.id, 'aceptado')}
                                  disabled={!!cargandoCambioId}
                                >
                                  Aceptar
                                </button>
                                <button
                                  className="btn-accion rechazar"
                                  onClick={() => cambiarConformidad(plan.id, 'rechazado')}
                                  disabled={!!cargandoCambioId}
                                >
                                  Rechazar
                                </button>
                              </div>
                            ) : (
                              <button
                                className="btn-accion declinar"
                                onClick={() => {
                                  setTrabajoADeclinar(plan);
                                  setModalObservacionVisible(true);
                                }}
                                disabled={!!cargandoCambioId}
                              >
                                Declinar
                              </button>
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

          <div className="revision-footer">
            <button className="revision-btn siguiente" onClick={() => navigate('/revision-documento-docente')}>
              Siguiente
            </button>
          </div>
        </div>
      </main>

      <ModalObservacionConformidad
        visible={modalObservacionVisible}
        observacion={observacionTexto}
        onObservacionChange={setObservacionTexto}
        onCancelar={() => setModalObservacionVisible(false)}
        onEnviar={() => {
          if (!observacionTexto || !observacionTexto.trim()) {
            showTopWarningToast('Observación requerida', 'Por favor, escriba una observación antes de enviar.');
            return;
          }
          if (!trabajoADeclinar || !trabajoADeclinar.id) {
            showTopWarningToast('Error', 'No hay trabajo seleccionado.');
            return;
          }
          cambiarConformidad(trabajoADeclinar.id, 'pendiente');
          setModalObservacionVisible(false);
          setObservacionTexto('');
          setTrabajoADeclinar(null);
        }}
      />

      <GrupoDocenteModal
        visible={modalGrupoVisible}
        integrantesGrupo={integrantesGrupo}
        onClose={() => setModalGrupoVisible(false)}
      />
    </>
  );
}

export default RevisionPlanSocial;
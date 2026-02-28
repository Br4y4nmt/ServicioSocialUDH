import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import SearchInput from '../../gestor/SearchInput';
import { buscarSinTildes } from '../../../utils/textUtils';
import VerBoton from '../../../hooks/componentes/VerBoton';
import ModalGrupoIntegrantes from '../../modals/ModalGrupoIntegrantes';
import { alertconfirmacion } from '../../../hooks/alerts/alertas';
import { showTopSuccessToast, showTopErrorToast } from '../../../hooks/alerts/useWelcomeToast';
import { useUser } from '../../../UserContext';
import Header from '../../layout/Header/Header';
import SidebarDocente from 'components/layout/Sidebar/SidebarDocente';

export default function SolicitudesInformesFinales() {
  const { user } = useUser();
  const token = user?.token;
  const [collapsed, setCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState('informes');
  const [informesFinales, setInformesFinales] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [programaSeleccionado, setProgramaSeleccionado] = useState('');
  const [programas, setProgramas] = useState([]);
  const [procesandoId, setProcesandoId] = useState(null);
  const [modalGrupoVisible, setModalGrupoVisible] = useState(false);
  const [integrantesGrupo, setIntegrantesGrupo] = useState([]);
  const [nombresMiembros, setNombresMiembros] = useState([]);

  const toggleSidebar = useCallback(() => {
    setCollapsed((c) => !c);
  }, []);

  const fetchData = useCallback(async () => {
    if (!token) return;
    try {
      const { data } = await axios.get('/api/trabajo-social/informes-finales', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const lista = Array.isArray(data) ? data : [];
      setInformesFinales(lista);

      const uniquePrograms = Array.from(
        new Map(
          lista.map((i) => [
            i.ProgramasAcademico?.nombre_programa,
            i.ProgramasAcademico,
          ])
        ).values()
      ).filter(Boolean);

      setProgramas(
        uniquePrograms.map((p, idx) => ({
          id_programa: idx,
          nombre_programa: p.nombre_programa,
        }))
      );
    } catch (error) {
      console.error('Error cargando informes finales:', error);
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const cambiarEstado = useCallback(
    async (id, nuevoEstado) => {
      if (!token) return false;

      try {
        setProcesandoId(id);

        await axios.patch(
          `/api/trabajo-social/estado/${id}`,
          { nuevo_estado: nuevoEstado },
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

  const handleRechazar = (id) => cambiarEstado(id, 'rechazado');

  const handleVerGrupo = async (trabajoId) => {
    if (!token) return;
    try {
      const { data: integrantes } = await axios.get(`/api/integrantes/${trabajoId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setIntegrantesGrupo(integrantes || []);
      setModalGrupoVisible(true);

      const correos = (integrantes || []).map((i) => i.correo_institucional).filter(Boolean);
      if (correos.length > 0) {
        const { data: nombres } = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/estudiantes/grupo-nombres`,
          { correos }
        );
        setNombresMiembros(nombres || []);
      } else {
        setNombresMiembros([]);
      }
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
        <div className="docentes-container">
          <div className="docentes-card">
            <div className="docentes-header">
              <div className="docentes-header-left">
                <h2>Informes Finales</h2>
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

              <div className="docentes-header-right">
                <label className="docentes-search-label">
                  Buscar por Programa Académico:
                  <select
                    className="select-profesional"
                    value={programaSeleccionado}
                    onChange={(e) =>
                      setProgramaSeleccionado(e.target.value)
                    }
                  >
                    <option value="">Todos</option>
                    {programas.map((prog) => (
                      <option
                        key={prog.id_programa}
                        value={prog.nombre_programa}
                      >
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
                    <th>Plan</th>
                    <th>Fecha de Envío</th>
                    <th>Informe final</th>
                    <th>Tipo</th>
                    <th>Estado</th>
                  </tr>
                </thead>

                <tbody>
                  {informesFinales
                    .filter((inf) =>
                      programaSeleccionado
                        ? inf.ProgramasAcademico?.nombre_programa
                            ?.toLowerCase()
                            .includes(programaSeleccionado.toLowerCase())
                        : true
                    )
                    .filter((inf) =>
                      buscarSinTildes(
                        inf.Estudiante?.nombre_estudiante || '',
                        busqueda
                      )
                    )
                    .map((inf, index) => (
                      <tr key={inf.id}>
                        <td>{index + 1}</td>
                        <td>
                          {(inf.Estudiante?.nombre_estudiante ||
                            'SIN NOMBRE'
                          ).toUpperCase()}
                        </td>
                        <td>
                          {(inf.ProgramasAcademico?.nombre_programa ||
                            'SIN PROGRAMA'
                          ).toUpperCase()}
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
                            <span className="no-generado">
                              NO SUBIDO
                            </span>
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
                            <span className="no-generado">
                              NO GENERADO
                            </span>
                          )}
                        </td>

                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
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
                          {inf.estado_informe_final ===
                          'pendiente' ? (
                            <div
                              style={{
                                display: 'flex',
                                gap: 8,
                                justifyContent: 'center',
                              }}
                            >
                              <button
                                className="btn-accion aceptar"
                                onClick={() =>
                                  handleAprobar(inf.id)
                                }
                                disabled={
                                  procesandoId === inf.id
                                }
                              >
                                {procesandoId === inf.id
                                  ? 'Procesando...'
                                  : 'Aprobar'}
                              </button>

                              <button
                                className="btn-accion rechazar"
                                onClick={() =>
                                  handleRechazar(inf.id)
                                }
                                disabled={
                                  procesandoId === inf.id
                                }
                              >
                                Rechazar
                              </button>
                            </div>
                          ) : (
                            <span
                              className={`badge-estado ${
                                inf.estado_informe_final ===
                                'aprobado'
                                  ? 'aprobado'
                                  : 'rechazado'
                              }`}
                            >
                              {(
                                inf.estado_informe_final || ''
                              ).toUpperCase()}
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
      </main>
      <ModalGrupoIntegrantes
        visible={modalGrupoVisible}
        integrantes={integrantesGrupo}
        nombresMiembros={nombresMiembros}
        onCerrar={() => setModalGrupoVisible(false)}
      />
    </>
  );
}
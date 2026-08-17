import React, { useEffect, useMemo, useState } from 'react';
import SearchInput from '../SearchInput';
import { buscarSinTildes } from '../../../utils/textUtils';
import EditIcon from '../../../hooks/componentes/Icons/EditIcon';
import DeleteIcon from '../../../hooks/componentes/Icons/DeleteIcon';
import VerBoton from '../../../hooks/componentes/VerBoton';
import TablePagination from '../../ui/TablePagination';
import PageSkeleton from '../../loaders/PageSkeleton';
import SupervisorModal from '../../modals/SupervisorModal';
import ProcesoTrabajoSocialModal from '../../modals/ProcesoTrabajoSocialModal';

function TrabajosSocialesSection({
  trabajosSociales,
  cargandoTrabajosSociales,
  busquedaTrabajoSocial,
  setBusquedaTrabajoSocial,

  filtroVencidosActivo,
  alternarFiltroVencidos,

  eliminarTrabajoSocial,
  eliminarIntegrante,

  procesoTrabajoSocial,
  cargandoProcesoTrabajoSocial,
  errorProcesoTrabajoSocial,
  fetchProcesoTrabajoSocial,
  limpiarProcesoTrabajoSocial,
}) {
  const [currentPage, setCurrentPage] = useState(1);

  const [modalTrabajoAbierto, setModalTrabajoAbierto] =
    useState(false);

  const [trabajoSeleccionado, setTrabajoSeleccionado] =
    useState(null);

  const [modalProcesoAbierto, setModalProcesoAbierto] =
    useState(false);

  const ITEMS_PER_PAGE = 30;


  const trabajosSocialesFiltrados = useMemo(
    () =>
      (trabajosSociales || []).filter((trabajo) =>
        buscarSinTildes(
          trabajo.Estudiante?.nombre_estudiante || '',
          busquedaTrabajoSocial || ''
        )
      ),
    [
      trabajosSociales,
      busquedaTrabajoSocial,
    ]
  );


  const totalPages = Math.max(
    1,
    Math.ceil(
      trabajosSocialesFiltrados.length /
        ITEMS_PER_PAGE
    )
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    busquedaTrabajoSocial,
    filtroVencidosActivo,
  ]);

  const inicio =
    (currentPage - 1) * ITEMS_PER_PAGE;

  const trabajosSocialesPagina =
    trabajosSocialesFiltrados.slice(
      inicio,
      inicio + ITEMS_PER_PAGE
    );



  const handleAlternarFiltroVencidos = async () => {
    if (!alternarFiltroVencidos) return;

    setCurrentPage(1);

    await alternarFiltroVencidos();
  };

  const abrirModalTrabajo = (trabajo) => {
    setTrabajoSeleccionado(trabajo);
    setModalTrabajoAbierto(true);
  };

  const cerrarModalTrabajo = () => {
    setModalTrabajoAbierto(false);
    setTrabajoSeleccionado(null);
  };


  const handleEliminarTrabajo = async (trabajo) => {
    if (!eliminarTrabajoSocial) {
      return false;
    }

    return await eliminarTrabajoSocial(trabajo);
  };


  const handleEliminarIntegrante = async (
    integrante,
    trabajo
  ) => {
    if (!eliminarIntegrante) {
      return false;
    }

    return await eliminarIntegrante(
      integrante,
      trabajo
    );
  };


  const handleVerProceso = async (trabajo) => {
    if (!trabajo?.id) return;

    setModalProcesoAbierto(true);

    if (fetchProcesoTrabajoSocial) {
      await fetchProcesoTrabajoSocial(
        trabajo.id
      );
    }
  };

  const cerrarModalProceso = () => {
    setModalProcesoAbierto(false);

    limpiarProcesoTrabajoSocial?.();
  };


  return (
    <>
      <div className="docentes-container">
        <div className="docentes-card">

          {/* ENCABEZADO */}
          <div className="docentes-header">

            <div className="docentes-header-left">
              <h2>
                Gestión de Trabajos Sociales
              </h2>
            </div>

            <div className="trabajos-sociales-herramientas">

              <button
                type="button"
                className={`trabajos-filtro-vencidos ${
                  filtroVencidosActivo
                    ? 'activo'
                    : ''
                }`}
                onClick={
                  handleAlternarFiltroVencidos
                }
                disabled={
                  cargandoTrabajosSociales
                }
                title={
                  filtroVencidosActivo
                    ? 'Volver a mostrar todos los trabajos sociales'
                    : 'Mostrar trabajos con actividades vencidas sin evidencia'
                }
              >
                <span className="trabajos-filtro-indicador" />

                {filtroVencidosActivo
                  ? 'Mostrar todos'
                  : 'Vencidos sin evidencia'}
              </button>

              <SearchInput
                value={busquedaTrabajoSocial}
                onChange={
                  setBusquedaTrabajoSocial
                }
                placeholder="Nombre del estudiante"
                label="Buscar:"
                className="docentes-search-label"
              />

            </div>

          </div>

          {filtroVencidosActivo && (
            <div className="trabajos-filtro-activo-info">
              <span>
                Mostrando únicamente trabajos sociales
                con actividades vencidas y sin evidencia.
              </span>
            </div>
          )}

          <div className="docentes-table-wrapper">

            {cargandoTrabajosSociales ? (
              <PageSkeleton
                topBlocks={['sm', 'md']}
                xlRows={3}
                showChip
                lastXL
              />
            ) : (
              <>
                <table className="docentes-table">

                  <thead className="docentes-table-thead">
                    <tr>
                      <th>Nº</th>

                      <th>
                        Nombre del estudiante
                      </th>

                      <th>
                        Programa Académico
                      </th>

                      <th>
                        Tipo
                      </th>

                      <th>
                        Supervisor
                      </th>

                      <th>
                        Proceso
                      </th>

                      <th>
                        Acciones
                      </th>
                    </tr>
                  </thead>

                  <tbody>

                    {trabajosSocialesPagina.length > 0 ? (
                      trabajosSocialesPagina.map(
                        (
                          trabajo,
                          index
                        ) => {
                          const nombre = (
                            trabajo
                              .Estudiante
                              ?.nombre_estudiante ||
                            'SIN NOMBRE'
                          ).toUpperCase();

                          const programa = (
                            trabajo
                              .ProgramasAcademico
                              ?.nombre_programa ||
                            'SIN PROGRAMA'
                          ).toUpperCase();

                          const tipo = (
                            trabajo
                              .tipo_servicio_social ||
                            'SIN TIPO'
                          ).toUpperCase();

                          const supervisor = (
                            trabajo.Docente
                              ?.nombre_docente ||
                            'SIN SUPERVISOR'
                          ).toUpperCase();

                          return (
                            <tr
                              key={
                                trabajo.id ||
                                index
                              }
                            >
                              <td>
                                {inicio +
                                  index +
                                  1}
                              </td>

                              <td>
                                {nombre}
                              </td>

                              <td>
                                {programa}
                              </td>

                              <td>
                                {tipo}
                              </td>

                              <td>
                                {supervisor}
                              </td>

                              <td>
                                <VerBoton
                                  label="Ver"
                                  onClick={() =>
                                    handleVerProceso(
                                      trabajo
                                    )
                                  }
                                />
                              </td>

                              <td>
                                <div
                                  style={{
                                    display:
                                      'flex',
                                    alignItems:
                                      'center',
                                    justifyContent:
                                      'center',
                                    gap: '8px',
                                  }}
                                >

                                  <button
                                    type="button"
                                    onClick={() =>
                                      abrirModalTrabajo(
                                        trabajo
                                      )
                                    }
                                    className="facultades-btn editar"
                                    title="Ver detalle del trabajo social"
                                    aria-label={`Ver detalle del trabajo social de ${nombre}`}
                                  >
                                    <EditIcon />
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleEliminarTrabajo(
                                        trabajo
                                      )
                                    }
                                    className="facultades-btn eliminar"
                                    title="Eliminar trabajo social"
                                    aria-label={`Eliminar trabajo social de ${nombre}`}
                                  >
                                    <DeleteIcon />
                                  </button>

                                </div>
                              </td>

                            </tr>
                          );
                        }
                      )
                    ) : (
                      <tr>
                        <td
                          colSpan="7"
                          style={{
                            textAlign:
                              'center',
                            padding:
                              '1.25rem',
                          }}
                        >
                          {filtroVencidosActivo
                            ? 'No hay trabajos sociales con actividades vencidas sin evidencia.'
                            : 'No se encontraron trabajos sociales.'}
                        </td>
                      </tr>
                    )}

                  </tbody>

                </table>

                {/* PAGINACIÓN */}
                <TablePagination
                  totalItems={
                    trabajosSocialesFiltrados.length
                  }
                  itemsPerPage={
                    ITEMS_PER_PAGE
                  }
                  currentPage={
                    currentPage
                  }
                  onPageChange={(page) => {
                    if (
                      page >= 1 &&
                      page <= totalPages
                    ) {
                      setCurrentPage(page);
                    }
                  }}
                />
              </>
            )}

          </div>
        </div>
      </div>

      <SupervisorModal
        isOpen={modalTrabajoAbierto}
        onClose={cerrarModalTrabajo}
        trabajo={trabajoSeleccionado}
        onEliminarIntegrante={
          handleEliminarIntegrante
        }
      />

      <ProcesoTrabajoSocialModal
        isOpen={modalProcesoAbierto}
        onClose={cerrarModalProceso}
        proceso={
          procesoTrabajoSocial
        }
        cargando={
          cargandoProcesoTrabajoSocial
        }
        error={
          errorProcesoTrabajoSocial
        }
      />
    </>
  );
}

export default React.memo(
  TrabajosSocialesSection
);
import React, { useEffect, useMemo, useState } from 'react';
import SearchInput from '../SearchInput';
import { buscarSinTildes } from '../../../utils/textUtils';
import DeleteIcon from "../../../hooks/componentes/Icons/DeleteIcon";
import VerBoton from "../../../hooks/componentes/VerBoton";
import TablePagination from '../../ui/TablePagination';
import PageSkeleton from '../../loaders/PageSkeleton';

function SupervisorSection({
  supervisores,
  cargandoSupervisores,
  busquedaSupervisor,
  setBusquedaSupervisor,
  programaSupervisor,
  setProgramaSupervisor,
  programas,
  eliminarSupervisor
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 30;

  const supervisoresFiltrados = useMemo(
    () =>
      (supervisores || [])
        .filter((sup) =>
          buscarSinTildes(sup.estudiante?.nombre_estudiante || '', busquedaSupervisor || '')
        )
        .filter((sup) => {
          if (!programaSupervisor) return true;
          const nombreProg =
            sup.programa?.nombre_programa ||
            sup.ProgramasAcademico?.nombre_programa ||
            '';
          return nombreProg.toLowerCase() === programaSupervisor.toLowerCase();
        }),
    [supervisores, busquedaSupervisor, programaSupervisor]
  );

  const totalPages = Math.max(1, Math.ceil(supervisoresFiltrados.length / ITEMS_PER_PAGE));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    setCurrentPage(1);
  }, [busquedaSupervisor, programaSupervisor]);

  const inicio = (currentPage - 1) * ITEMS_PER_PAGE;
  const supervisoresPagina = supervisoresFiltrados.slice(inicio, inicio + ITEMS_PER_PAGE);

  return (
    <div className="docentes-container">
      <div className="docentes-card">
        <div className="docentes-header">
          <div className="docentes-header-left">
            <h2>Desig. Docente Supervisor</h2>
          </div>

          <div className="docentes-header-right">
            <SearchInput
              value={busquedaSupervisor}
              onChange={setBusquedaSupervisor}
              placeholder="Nombre del estudiante"
              label="Buscar:"
              className="docentes-search-label"
            />
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
          {cargandoSupervisores ? (
            <PageSkeleton topBlocks={["sm", "md"]} xlRows={3} showChip lastXL />
          ) : (
            <>
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
                  {supervisoresPagina.length > 0 ? (
                    supervisoresPagina.map((sup, index) => {
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
                          <td>{inicio + index + 1}</td>
                          <td>{nombre}</td>
                          <td>{programa}</td>
                          <td>
                            {(() => {
                              const raw = (
                                sup.estado ||
                                sup.estado_plan_labor_social ||
                                'pendiente'
                              ).toLowerCase();

                              let estado = raw === 'aceptado' ? 'aprobado' : raw;
                              estado = ['aprobado', 'rechazado', 'pendiente'].includes(estado)
                                ? estado
                                : 'pendiente';

                              const label = {
                                aprobado: 'Aceptado',
                                rechazado: 'Rechazado',
                                pendiente: 'Pendiente',
                              }[estado];

                              return <span className={`badge-estado ${estado}`}>{label}</span>;
                            })()}
                          </td>
                          <td>
                            {cartaPdf ? (
                              <VerBoton
                                label="Ver"
                                onClick={() =>
                                  window.open(
                                    `${process.env.REACT_APP_API_URL}/uploads/planes_labor_social/${cartaPdf}`,
                                    "_blank",
                                    "noopener,noreferrer"
                                  )
                                }
                              />
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
                    })
                  ) : (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', padding: '1rem' }}>
                        No se encontraron designaciones.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              <TablePagination
                totalItems={supervisoresFiltrados.length}
                itemsPerPage={ITEMS_PER_PAGE}
                currentPage={currentPage}
                onPageChange={(page) => {
                  if (page >= 1 && page <= totalPages) {
                    setCurrentPage(page);
                  }
                }}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default React.memo(SupervisorSection);
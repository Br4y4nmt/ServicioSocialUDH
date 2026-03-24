import React, { useEffect, useMemo, useState } from 'react';
import SearchInput from '../SearchInput';
import { buscarSinTildes } from '../../../utils/textUtils';
import TablePagination from '../../ui/TablePagination';
import PageSkeleton from '../../loaders/PageSkeleton';

function EstudiantesSection({
  estudiantes,
  cargandoEstudiantes,
  filtroEstudiantes,
  setFiltroEstudiantes,
  programaSeleccionado,
  setProgramaSeleccionado,
  programas,
  setModalEstudianteVisible
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 30;

  const estudiantesFiltrados = useMemo(
    () =>
      estudiantes.filter((est) => {
        const coincideTexto =
          buscarSinTildes(est.nombre_estudiante || '', filtroEstudiantes) ||
          est.dni?.includes(filtroEstudiantes);

        const coincidePrograma =
          programaSeleccionado === '' ||
          est.programa?.nombre_programa === programaSeleccionado;

        return coincideTexto && coincidePrograma;
      }),
    [estudiantes, filtroEstudiantes, programaSeleccionado]
  );

  const totalPages = Math.max(1, Math.ceil(estudiantesFiltrados.length / ITEMS_PER_PAGE));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filtroEstudiantes, programaSeleccionado]);

  const inicio = (currentPage - 1) * ITEMS_PER_PAGE;
  const estudiantesPagina = estudiantesFiltrados.slice(inicio, inicio + ITEMS_PER_PAGE);

  return (
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
            <SearchInput
              value={filtroEstudiantes}
              onChange={setFiltroEstudiantes}
              placeholder="Nombre del estudiante o DNI"
              label="Buscar:"
              className="docentes-search-label"
            />
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
          {cargandoEstudiantes ? (
            <PageSkeleton topBlocks={["sm", "md"]} xlRows={3} showChip lastXL />
          ) : (
          <>
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
              {estudiantesPagina.length > 0 ? (
                estudiantesPagina.map((est, index) => (
                  <tr key={est.id_estudiante}>
                    <td>{inicio + index + 1}</td>
                    <td>{est.nombre_estudiante || 'SIN NOMBRE'}</td>
                    <td>{est.dni || '—'}</td>
                    <td>{est.email || 'SIN CORREO'}</td>
                    <td>{est.celular || '—'}</td>
                    <td>{est.programa?.nombre_programa?.toUpperCase() || 'SIN PROGRAMA'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '1rem' }}>
                    No se encontraron estudiantes.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <TablePagination
            totalItems={estudiantesFiltrados.length}
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

export default React.memo(EstudiantesSection);

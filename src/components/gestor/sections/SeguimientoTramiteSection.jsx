import React, { useEffect, useMemo, useState } from 'react';
import SearchInput from '../SearchInput';
import { buscarSinTildes } from '../../../utils/textUtils';
import VerBoton from "../../../hooks/componentes/VerBoton";
import TablePagination from '../../ui/TablePagination';
import PageSkeleton from '../../loaders/PageSkeleton';

function SeguimientoTramiteSection({
  estudiantes,
  cargandoEstudiantes,
  filtroEstudiantes,
  setFiltroEstudiantes,
  verSeguimiento
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 30;

  const estudiantesFiltrados = useMemo(
    () =>
      estudiantes.filter((est) =>
        buscarSinTildes(est.nombre_estudiante || '', filtroEstudiantes)
      ),
    [estudiantes, filtroEstudiantes]
  );

  const totalPages = Math.max(1, Math.ceil(estudiantesFiltrados.length / ITEMS_PER_PAGE));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filtroEstudiantes]);

  const inicio = (currentPage - 1) * ITEMS_PER_PAGE;
  const estudiantesPagina = estudiantesFiltrados.slice(inicio, inicio + ITEMS_PER_PAGE);

  return (
    <div className="docentes-container">
      <div className="docentes-card">
        <div className="docentes-header">
          <div className="docentes-header-left">
            <h2>Seguimiento de Trámite</h2>
          </div>

          <div className="docentes-header-right">
            <SearchInput
              value={filtroEstudiantes}
              onChange={setFiltroEstudiantes}
              placeholder="Nombre del estudiante"
              label="Buscar:"
              className="docentes-search-label"
            />
          </div>
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
                    <th>Correo</th>
                    <th>Programa Académico</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {estudiantesPagina.length > 0 ? (
                    estudiantesPagina.map((est, index) => (
                      <tr key={est.id_estudiante}>
                        <td>{inicio + index + 1}</td>
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
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '1rem' }}>
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

export default React.memo(SeguimientoTramiteSection);
import React, { useEffect, useMemo, useState } from 'react';
import SearchInput from '../SearchInput';
import { buscarSinTildes } from '../../../utils/textUtils';
import EditIcon from "../../../hooks/componentes/Icons/EditIcon";
import DeleteIcon from "../../../hooks/componentes/Icons/DeleteIcon";
import LineaEditarModal from "../../modals/LineaEditarModal";
import LineaNuevoModal from "../../modals/LineaNuevoModal";
import TablePagination from '../../ui/TablePagination';
import PageSkeleton from '../../loaders/PageSkeleton';

function LineasSection({
  lineas,
  cargandoLineas,
  busquedaLinea,
  setBusquedaLinea,
  modalLineaVisible,
  setModalLineaVisible,
  modalEditarLineaVisible,
  setModalEditarLineaVisible,
  idEditandoLinea,
  setIdEditandoLinea,
  nombreLineaEditado,
  setNombreLineaEditado,
  nuevaLinea,
  setNuevaLinea,
  eliminarLinea,
  guardarEdicionLinea,
  crearLinea
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 30;

  const lineasFiltradas = useMemo(
    () =>
      lineas.filter((l) => buscarSinTildes(l.nombre_linea || '', busquedaLinea)),
    [lineas, busquedaLinea]
  );

  const totalPages = Math.max(1, Math.ceil(lineasFiltradas.length / ITEMS_PER_PAGE));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    setCurrentPage(1);
  }, [busquedaLinea]);

  const inicio = (currentPage - 1) * ITEMS_PER_PAGE;
  const lineasPagina = lineasFiltradas.slice(inicio, inicio + ITEMS_PER_PAGE);

  return (
    <>
      <div className="docentes-container">
        <div className="docentes-card">
          <div className="docentes-header">
            <div className="docentes-header-left">
              <h2>Líneas de Acción</h2>
              <button className="docentes-btn-agregar" onClick={() => setModalLineaVisible(true)}>Agregar</button>
            </div>
            <div className="docentes-header-right">
              <SearchInput
                value={busquedaLinea}
                onChange={setBusquedaLinea}
                placeholder="Nombre de la línea"
                label="Buscar:"
                className="docentes-search-label"
              />
            </div>
          </div>
          <div className="docentes-table-wrapper">
            {cargandoLineas ? (
              <PageSkeleton topBlocks={["sm"]} xlRows={3} showChip lastXL />
            ) : (
            <>
            <table className="docentes-table">
              <thead className="docentes-table-thead">
                <tr>
                  <th>Nº</th>
                  <th>Nombre</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {lineasPagina.length > 0 ? (
                  lineasPagina.map((l, index) => (
                    <tr key={l.id_linea}>
                      <td>{inicio + index + 1}</td>
                      <td>{(l.nombre_linea || 'SIN NOMBRE').toUpperCase()}</td>
                      <td>
                        <button
                          className="facultades-btn editar"
                          onClick={() => {
                            setIdEditandoLinea(l.id_linea);
                            setNombreLineaEditado(l.nombre_linea);
                            setModalEditarLineaVisible(true);
                          }}
                        >
                          <EditIcon />
                        </button>

                        <button
                          className="facultades-btn eliminar"
                          onClick={() => eliminarLinea(l.id_linea)}
                        >
                          <DeleteIcon />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" style={{ textAlign: 'center', padding: '1rem' }}>
                      No se encontraron lineas.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <TablePagination
              totalItems={lineasFiltradas.length}
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

      <LineaNuevoModal
        isOpen={modalLineaVisible}
        nombreLinea={nuevaLinea}
        onChangeNombreLinea={setNuevaLinea}
        onClose={() => {
          setModalLineaVisible(false);
          setNuevaLinea('');
        }}
        onGuardar={() => {
          crearLinea();
          setModalLineaVisible(false);
        }}
      />

      <LineaEditarModal
        isOpen={modalEditarLineaVisible}
        nombreLinea={nombreLineaEditado}
        onChangeNombreLinea={setNombreLineaEditado}
        onClose={() => {
          setModalEditarLineaVisible(false);
          setIdEditandoLinea(null);
        }}
        onGuardar={() => {
          guardarEdicionLinea(idEditandoLinea);
          setModalEditarLineaVisible(false);
        }}
      />
    </>
  );
}

export default React.memo(LineasSection);

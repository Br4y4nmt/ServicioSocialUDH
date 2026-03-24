import React, { useEffect, useMemo, useState } from 'react';
import SearchInput from '../SearchInput';
import { buscarSinTildes } from '../../../utils/textUtils';
import EditIcon from "../../../hooks/componentes/Icons/EditIcon";
import DeleteIcon from "../../../hooks/componentes/Icons/DeleteIcon";
import LaborEditarModal from "../../modals/LaborEditarModal";
import LaborNuevoModal from "../../modals/LaborNuevoModal";
import TablePagination from '../../ui/TablePagination';
import PageSkeleton from '../../loaders/PageSkeleton';

function LaboresSection({
  labores,
  cargandoLabores,
  busquedaLabor,
  setBusquedaLabor,
  modalLaborVisible,
  setModalLaborVisible,
  modalEditarLaborVisible,
  setModalEditarLaborVisible,
  editandoLaborId,
  setEditandoLaborId,
  idLaborEditando,
  setIdLaborEditando,
  nombreLaborEditado,
  setNombreLaborEditado,
  nuevaLabor,
  setNuevaLabor,
  lineaLabor,
  setLineaLabor,
  lineas,
  eliminarLabor,
  guardarEdicionLabor,
  crearLabor
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 30;

  const laboresFiltradas = useMemo(
    () =>
      labores.filter((labor) =>
        buscarSinTildes(labor.nombre_labores || '', busquedaLabor)
      ),
    [labores, busquedaLabor]
  );

  const totalPages = Math.max(1, Math.ceil(laboresFiltradas.length / ITEMS_PER_PAGE));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    setCurrentPage(1);
  }, [busquedaLabor]);

  const inicio = (currentPage - 1) * ITEMS_PER_PAGE;
  const laboresPagina = laboresFiltradas.slice(inicio, inicio + ITEMS_PER_PAGE);

  return (
    <>
      <div className="docentes-container">
        <div className="docentes-card">
          <div className="docentes-header">
            <div className="docentes-header-left">
              <h2>Servicios Sociales</h2>
              <button className="docentes-btn-agregar" onClick={() => setModalLaborVisible(true)}>
                Agregar
              </button>
            </div>
            <div className="docentes-header-right">
              <SearchInput
                value={busquedaLabor}
                onChange={setBusquedaLabor}
                placeholder="Nombre de la labor"
                label="Buscar:"
                className="docentes-search-label"
              />
            </div>
          </div>
          <div className="docentes-table-wrapper">
            {cargandoLabores ? (
              <PageSkeleton topBlocks={["sm"]} xlRows={3} showChip lastXL />
            ) : (
            <>
            <table className="docentes-table">
              <thead className="docentes-table-thead">
                <tr>
                  <th>Nº</th>
                  <th>Nombre</th>
                  <th>Linea de Accion</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {laboresPagina.length > 0 ? (
                  laboresPagina.map((labor, index) => (
                    <tr key={labor.id_labores}>
                      <td>{inicio + index + 1}</td>
                      <td>
                        {editandoLaborId === labor.id_labores ? (
                          <input
                            type="text"
                            className="docentes-input-edit"
                            value={nombreLaborEditado}
                            onChange={(e) => setNombreLaborEditado(e.target.value)}
                          />
                        ) : (
                          labor.nombre_labores.toUpperCase()
                        )}
                      </td>
                      <td>
                        {editandoLaborId === labor.id_labores ? (
                          <select
                            className="docentes-select-edit"
                            value={lineaLabor}
                            onChange={(e) => setLineaLabor(e.target.value)}
                          >
                            <option value="">-- Línea de Acción --</option>
                            {lineas.map((l) => (
                              <option key={l.id_linea} value={l.id_linea}>
                                {l.nombre_linea}
                              </option>
                            ))}
                          </select>
                        ) : (
                          labor.LineaAccion?.nombre_linea?.toUpperCase() || 'SIN LÍNEA'
                        )}
                      </td>
                      <td>
                        <button
                          className="facultades-btn editar"
                          onClick={() => {
                            setIdLaborEditando(labor.id_labores);
                            setNombreLaborEditado(labor.nombre_labores);
                            setLineaLabor(labor.linea_accion_id);
                            setModalEditarLaborVisible(true);
                          }}
                        >
                          <EditIcon />
                        </button>

                        <button
                          className="facultades-btn eliminar"
                          onClick={() => eliminarLabor(labor.id_labores)}
                        >
                          <DeleteIcon />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '1rem' }}>
                      No se encontraron servicios sociales.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <TablePagination
              totalItems={laboresFiltradas.length}
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

      <LaborEditarModal
        isOpen={modalEditarLaborVisible}
        nombreLabor={nombreLaborEditado}
        onChangeNombreLabor={setNombreLaborEditado}
        lineaLabor={lineaLabor}
        onChangeLineaLabor={setLineaLabor}
        lineas={lineas}
        onClose={() => {
          setModalEditarLaborVisible(false);
          setIdLaborEditando(null);
          setNombreLaborEditado("");
          setLineaLabor("");
        }}
        onGuardar={async () => {
          const ok = await guardarEdicionLabor(idLaborEditando);
          if (ok) {
            setModalEditarLaborVisible(false);
            setIdLaborEditando(null);
            setNombreLaborEditado("");
            setLineaLabor("");
          }
        }}
      />

      <LaborNuevoModal
        isOpen={modalLaborVisible}
        nombreLabor={nuevaLabor}
        onChangeNombreLabor={setNuevaLabor}
        lineaLabor={lineaLabor}
        onChangeLineaLabor={setLineaLabor}
        lineas={lineas}
        onClose={() => {
          setModalLaborVisible(false);
          setNuevaLabor("");
          setLineaLabor("");
        }}
        onGuardar={async () => {
          const ok = await crearLabor();
          if (ok) {
            setModalLaborVisible(false);
            setNuevaLabor("");
            setLineaLabor("");
          }
        }}
      />
    </>
  );
}

export default React.memo(LaboresSection);

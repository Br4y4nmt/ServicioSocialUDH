import React, { useEffect, useState } from 'react';
import EditIcon from "../../../hooks/componentes/Icons/EditIcon";
import DeleteIcon from "../../../hooks/componentes/Icons/DeleteIcon";
import FacultadEditarModal from "../../modals/FacultadEditarModal";
import FacultadNuevoModal from "../../modals/FacultadNuevoModal";
import TablePagination from '../../ui/TablePagination';
import PageSkeleton from '../../loaders/PageSkeleton';

function FacultadesSection({
  facultades,
  cargandoFacultades,
  modalNuevaFacultadVisible,
  setModalNuevaFacultadVisible,
  modalEditarVisible,
  setModalEditarVisible,
  editandoId,
  setEditandoId,
  nombreEditado,
  setNombreEditado,
  nuevaFacultad,
  setNuevaFacultad,
  eliminarFacultad,
  cancelarEdicion,
  guardarEdicionFacultad,
  crearFacultad
}) {
  const [nombreOriginal, setNombreOriginal] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 30;

  const totalPages = Math.max(1, Math.ceil(facultades.length / ITEMS_PER_PAGE));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const inicio = (currentPage - 1) * ITEMS_PER_PAGE;
  const facultadesPagina = facultades.slice(inicio, inicio + ITEMS_PER_PAGE);

  return (
    <div className="docentes-container">
      <div className="docentes-card">
        <div className="docentes-header">
          <div className="docentes-header-left">
            <h2>Facultades</h2>
            <button
              className="docentes-btn-agregar"
              onClick={() => setModalNuevaFacultadVisible(true)}
            >
              Agregar
            </button>
          </div>
        </div>

        <div className="docentes-table-wrapper">
          {cargandoFacultades ? (
            <PageSkeleton topBlocks={["sm"]} xlRows={3} showChip lastXL />
          ) : (
          <>
          <table className="docentes-table">
            <thead className="docentes-table-thead">
              <tr>
                <th>Nº</th>
                <th>Nombre</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {facultadesPagina.length > 0 ? (
                facultadesPagina.map((f, index) => (
                  <tr key={f.id_facultad}>
                    <td>{inicio + index + 1}</td>
                    <td>{(f.nombre_facultad || '').toUpperCase()}</td>
                    <td>
                      <span className="facultades-badge-activo">Activo</span>
                    </td>
                    <td>
                      <>
                        <button
                          onClick={() => {
                            setEditandoId(f.id_facultad);
                            setNombreEditado(f.nombre_facultad);
                            setNombreOriginal(f.nombre_facultad);
                            setModalEditarVisible(true);
                          }}
                          className="facultades-btn editar"
                        >
                          <EditIcon />
                        </button>

                        <button
                          onClick={() => eliminarFacultad(f.id_facultad)}
                          className="facultades-btn eliminar"
                        >
                          <DeleteIcon />
                        </button>
                      </>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '1rem' }}>
                    No hay facultades registradas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <TablePagination
            totalItems={facultades.length}
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

      <FacultadEditarModal
        isOpen={modalEditarVisible}
        nombre={nombreEditado}
        originalNombre={nombreOriginal}
        onChangeNombre={setNombreEditado}
        onCancelar={() => {
          cancelarEdicion();
          setModalEditarVisible(false);
        }}
        onGuardar={async () => {
          await guardarEdicionFacultad(editandoId);
          setModalEditarVisible(false);
        }}
      />

      <FacultadNuevoModal
        isOpen={modalNuevaFacultadVisible}
        nombreFacultad={nuevaFacultad}
        onChangeNombre={setNuevaFacultad}
        onClose={() => {
          setModalNuevaFacultadVisible(false);
          setNuevaFacultad('');
        }}
        onGuardar={async () => {
          await crearFacultad();
          setModalNuevaFacultadVisible(false);
          setNuevaFacultad('');
        }}
      />
    </div>
  );
}

export default React.memo(FacultadesSection);

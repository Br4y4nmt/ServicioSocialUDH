import React from 'react';
import EditIcon from "../../../hooks/componentes/Icons/EditIcon";
import DeleteIcon from "../../../hooks/componentes/Icons/DeleteIcon";
import FacultadEditarModal from "../../modals/FacultadEditarModal";
import FacultadNuevoModal from "../../modals/FacultadNuevoModal";

function FacultadesSection({
  facultades,
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
  return (
    <div className="facultades-container">
      <div className="facultades-card">
        <div className="facultades-header">
          <div className="facultades-header-left">
            <h2>Facultades</h2>
            <button
              className="docentes-btn-agregar"
              onClick={() => setModalNuevaFacultadVisible(true)}
            >
              Agregar
            </button>
          </div>
        </div>
        <div className="facultades-table-wrapper">
          <table className="facultades-table">
            <thead>
              <tr>
                <th>Nº</th>
                <th>Nombre</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {facultades
                .map((f, index) => (
                  <tr key={f.id_facultad}>
                    <td>{index + 1}</td>
                    <td>
                      {(f.nombre_facultad || '').toUpperCase()}
                    </td>
                    <td>
                      <span className="facultades-badge-activo">Activo</span>
                    </td>
                    <td>
                      <>
                        <button
                          onClick={() => {
                            setEditandoId(f.id_facultad);
                            setNombreEditado(f.nombre_facultad);
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
                ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <FacultadEditarModal
        isOpen={modalEditarVisible}
        nombre={nombreEditado}
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
          setNuevaFacultad("");
        }}
        onGuardar={async () => {
          await crearFacultad();
          setModalNuevaFacultadVisible(false);
          setNuevaFacultad("");
        }}
      />
    </div>
  );
}

export default React.memo(FacultadesSection);

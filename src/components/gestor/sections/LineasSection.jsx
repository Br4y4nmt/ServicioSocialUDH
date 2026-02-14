import React from 'react';
import SearchInput from '../SearchInput';
import { buscarSinTildes } from '../../../utils/textUtils';
import EditIcon from "../../../hooks/componentes/Icons/EditIcon";
import DeleteIcon from "../../../hooks/componentes/Icons/DeleteIcon";
import LineaEditarModal from "../../modals/LineaEditarModal";
import LineaNuevoModal from "../../modals/LineaNuevoModal";

function LineasSection({
  lineas,
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
  return (
    <>
      <div className="labores-container">
        <div className="labores-card">
          <div className="labores-header">
            <div className="labores-header-title">
              <h2>Líneas de Acción</h2>
              <button className="docentes-btn-agregar" onClick={() => setModalLineaVisible(true)}>Agregar</button>
            </div>
            <div className="labores-header-right">
              <SearchInput
                value={busquedaLinea}
                onChange={setBusquedaLinea}
                placeholder="Nombre de la línea"
                label="Buscar:"
                className="labores-search-label"
              />
            </div>
          </div>
          <div className="labores-table-wrapper">
            <table className="labores-table">
              <thead className="labores-table-thead">
                <tr>
                  <th>Nº</th>
                  <th>Nombre</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {lineas
                  .filter((l) => buscarSinTildes(l.nombre_linea || '', busquedaLinea))
                  .map((l, index) => (
                    <tr key={l.id_linea}>
                      <td>{index + 1}</td>
                      <td>{(l.nombre_linea || 'SIN NOMBRE').toUpperCase()}</td>
                      <td className="labores-acciones-cell">
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
                  ))}
              </tbody>
            </table>
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

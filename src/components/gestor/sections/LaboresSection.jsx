import React from 'react';
import SearchInput from '../SearchInput';
import { buscarSinTildes } from '../../../utils/textUtils';
import EditIcon from "../../../hooks/componentes/Icons/EditIcon";
import DeleteIcon from "../../../hooks/componentes/Icons/DeleteIcon";
import LaborEditarModal from "../../modals/LaborEditarModal";
import LaborNuevoModal from "../../modals/LaborNuevoModal";

function LaboresSection({
  labores,
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
  return (
    <>
      <div className="labores-container">
        <div className="labores-card">
          <div className="labores-header">
            <div className="labores-header-title">
              <h2>Servicios Sociales</h2>
              <button className="docentes-btn-agregar" onClick={() => setModalLaborVisible(true)}>
                Agregar
              </button>
            </div>
            <div className="labores-header-right">
              <SearchInput
                value={busquedaLabor}
                onChange={setBusquedaLabor}
                placeholder="Nombre de la labor"
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
                  <th>Linea de Accion</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {labores
                  .filter((labor) =>
                    buscarSinTildes(labor.nombre_labores || '', busquedaLabor)
                  )
                  .map((labor, index) => (
                    <tr key={labor.id_labores}>
                      <td>{index + 1}</td>
                      <td>
                        {editandoLaborId === labor.id_labores ? (
                          <input
                            type="text"
                            className="labores-input-edit"
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
                            className="labores-select-edit"
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
                  ))}
              </tbody>
            </table>
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

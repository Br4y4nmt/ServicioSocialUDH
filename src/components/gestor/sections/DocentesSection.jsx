import React from 'react';
import { toastWarning } from '../../../hooks/alerts/alertas';
import SearchInput from '../SearchInput';
import { buscarSinTildes } from '../../../utils/textUtils';
import EditIcon from "../../../hooks/componentes/Icons/EditIcon";
import DeleteIcon from "../../../hooks/componentes/Icons/DeleteIcon";
import DocenteEditarModal from "../../modals/DocenteEditarModal";
import DocenteNuevoModal from "../../modals/DocenteNuevoModal";

function DocentesSection({
  docentes,
  busquedaDocente,
  setBusquedaDocente,
  modalDocenteVisible,
  setModalDocenteVisible,
  modalEditarDocenteVisible,
  setModalEditarDocenteVisible,
  editandoDocenteId,
  setEditandoDocenteId,
  nombreDocenteEditado,
  setNombreDocenteEditado,
  emailDocenteEditado,
  setEmailDocenteEditado,
  facultadDocenteEditada,
  setFacultadDocenteEditada,
  programaDocenteEditado,
  setProgramaDocenteEditado,
  nuevoDocenteEmail,
  setNuevoDocenteEmail,
  nuevoDocenteWhatsapp,
  setNuevoDocenteWhatsapp,
  nuevaFacultadDocente,
  setNuevaFacultadDocente,
  nuevoProgramaDocente,
  setNuevoProgramaDocente,
  setNuevoDocenteDni,
  facultades,
  programas,
  eliminarDocente,
  guardarEdicionDocente,
  crearDocente
}) {
  return (
    <>
      <div className="docentes-container">
        <div className="docentes-card">
          <div className="docentes-header">
            <div className="docentes-header-left">
              <h2>Docentes</h2>
              <button className="docentes-btn-agregar" onClick={() => setModalDocenteVisible(true)}>
                Agregar
              </button>
            </div>
            <div className="docentes-header-right">
              <SearchInput
                value={busquedaDocente}
                onChange={setBusquedaDocente}
                placeholder="Nombre del docente"
                label="Buscar:"
                className="docentes-search-label"
              />
            </div>
          </div>
          
          <div className="docentes-table-wrapper">
            <table className="docentes-table">
              <thead className="docentes-table-thead">
                <tr>
                  <th>Nº</th>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>Facultad</th>
                  <th>Programa Academico</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {docentes
                  .filter((doc) =>
                    buscarSinTildes(doc.nombre_docente || '', busquedaDocente)
                  )
                  .map((doc, index) => (
                    <tr key={doc.id_docente}>
                      <td>{index + 1}</td>
                      <td>
                        {editandoDocenteId === doc.id_docente ? (
                          <input
                            type="text"
                            className="docentes-input-edit"
                            value={nombreDocenteEditado}
                            onChange={(e) => setNombreDocenteEditado(e.target.value)}
                          />
                        ) : (
                          (doc.nombre_docente || 'SIN NOMBRE').toUpperCase()
                        )}
                      </td>
                      <td>{doc.email || 'SIN CORREO'}</td>
                      <td>
                        {(doc.Facultade?.nombre_facultad || 'SIN FACULTAD').toUpperCase()}
                      </td>
                      <td>
                        {editandoDocenteId === doc.id_docente ? (
                          <select
                            className="docentes-select-edit"
                            value={programaDocenteEditado}
                            onChange={(e) => setProgramaDocenteEditado(e.target.value)}
                          >
                            {programas.map((prog) => (
                              <option key={prog.id_programa} value={prog.id_programa}>
                                {prog.nombre_programa}
                              </option>
                            ))}
                          </select>
                        ) : (
                          (doc.ProgramaDelDocente?.nombre_programa || 'SIN PROGRAMA').toUpperCase()
                        )}
                      </td>
                      <td className="docentes-acciones-cell">
                        <button
                          onClick={() => {
                            setEditandoDocenteId(doc.id_docente);
                            setNombreDocenteEditado(doc.nombre_docente);
                            setEmailDocenteEditado(doc.email || '');
                            setProgramaDocenteEditado(doc.programa_academico_id);
                            setFacultadDocenteEditada(doc.facultad_id);
                            setModalEditarDocenteVisible(true);
                          }}
                          className="facultades-btn editar"
                        >
                          <EditIcon />
                        </button>
                        <button
                          onClick={() => eliminarDocente(doc.id_docente)}
                          className="facultades-btn eliminar"
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

      <DocenteEditarModal
        isOpen={modalEditarDocenteVisible}
        nombre={nombreDocenteEditado}
        onChangeNombre={setNombreDocenteEditado}
        email={emailDocenteEditado}
        onChangeEmail={setEmailDocenteEditado}
        facultad={facultadDocenteEditada}
        onChangeFacultad={setFacultadDocenteEditada}
        programa={programaDocenteEditado}
        onChangePrograma={setProgramaDocenteEditado}
        facultades={facultades}
        programas={programas}
        onClose={() => {
          setModalEditarDocenteVisible(false);
          setEditandoDocenteId(null);
          setNombreDocenteEditado("");
          setEmailDocenteEditado("");
          setFacultadDocenteEditada("");
          setProgramaDocenteEditado("");
        }}
        onGuardar={async () => {
          const success = await guardarEdicionDocente(editandoDocenteId);
          if (success) {
            setModalEditarDocenteVisible(false);
            setEditandoDocenteId(null);
            setNombreDocenteEditado("");
            setEmailDocenteEditado("");
            setFacultadDocenteEditada("");
            setProgramaDocenteEditado("");
          }
        }}
      />

      <DocenteNuevoModal
        isOpen={modalDocenteVisible}
        email={nuevoDocenteEmail}
        onChangeEmail={setNuevoDocenteEmail}
        whatsapp={nuevoDocenteWhatsapp}
        onChangeWhatsapp={(value) => {
          if (/^\d{0,9}$/.test(value)) {
            setNuevoDocenteWhatsapp(value);
          }
        }}
        facultad={nuevaFacultadDocente}
        onChangeFacultad={(value) => {
          setNuevaFacultadDocente(value);
          setNuevoProgramaDocente(""); 
        }}
        programa={nuevoProgramaDocente}
        onChangePrograma={setNuevoProgramaDocente}
        facultades={facultades}
        programas={programas.filter(
          (prog) => prog.id_facultad === parseInt(nuevaFacultadDocente || 0, 10)
        )}
        onClose={() => {
          setModalDocenteVisible(false);
          setNuevoDocenteEmail("");
          setNuevoDocenteDni("");
          setNuevoDocenteWhatsapp("");
          setNuevaFacultadDocente("");
          setNuevoProgramaDocente("");
        }}
        onGuardar={async () => {
          if (nuevoDocenteEmail && !nuevoDocenteEmail.endsWith('@udh.edu.pe')) {
            toastWarning('Correo inválido', { text: 'El correo del docente debe ser @udh.edu.pe' });
            return;
          }

          if (nuevoDocenteWhatsapp.length !== 9) {
            toastWarning('Número inválido', { text: 'El número de WhatsApp debe tener exactamente 9 dígitos.' });
            return;
          }

          const success = await crearDocente();
          if (success) {
            setModalDocenteVisible(false);
          }
        }}
      />
    </>
  );
}

export default React.memo(DocentesSection);

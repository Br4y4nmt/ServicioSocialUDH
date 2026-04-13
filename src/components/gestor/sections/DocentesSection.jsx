import React, { useEffect, useMemo, useState } from 'react';
import { showTopWarningToast } from '../../../hooks/alerts/useWelcomeToast';
import SearchInput from '../SearchInput';
import { buscarSinTildes } from '../../../utils/textUtils';
import EditIcon from "../../../hooks/componentes/Icons/EditIcon";
import DeleteIcon from "../../../hooks/componentes/Icons/DeleteIcon";
import ChangeIcon from "../../../hooks/componentes/Icons/ChangeIcon";
import DocenteEditarModal from "../../modals/DocenteEditarModal";
import DocenteCambiarModal from "../../modals/DocenteCambiarModal";
import DocenteNuevoModal from "../../modals/DocenteNuevoModal";
import TablePagination from '../../ui/TablePagination';
import PageSkeleton from '../../loaders/PageSkeleton';

function DocentesSection({
  docentes,
  cargandoDocentes,
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
  reiniciarDatosDocente,
  crearDocente
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [modalCambiarDocenteVisible, setModalCambiarDocenteVisible] = useState(false);
  const ITEMS_PER_PAGE = 30;

  const docentesFiltrados = useMemo(
    () =>
      docentes.filter((doc) =>
        buscarSinTildes(doc.nombre_docente || '', busquedaDocente)
      ),
    [docentes, busquedaDocente]
  );

  const programasEdicionFiltrados = useMemo(() => {
    const idFacultad = parseInt(facultadDocenteEditada || 0, 10);
    if (!idFacultad) return [];
    return programas.filter((prog) => prog.id_facultad === idFacultad);
  }, [programas, facultadDocenteEditada]);

  const totalPages = Math.max(1, Math.ceil(docentesFiltrados.length / ITEMS_PER_PAGE));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    setCurrentPage(1);
  }, [busquedaDocente]);

  const inicio = (currentPage - 1) * ITEMS_PER_PAGE;
  const docentesPagina = docentesFiltrados.slice(inicio, inicio + ITEMS_PER_PAGE);

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
            {cargandoDocentes ? (
              <PageSkeleton topBlocks={["sm"]} xlRows={3} showChip lastXL />
            ) : (
            <>
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
                {docentesPagina.length > 0 ? (
                  docentesPagina.map((doc, index) => (
                    <tr key={doc.id_docente}>
                      <td>{inicio + index + 1}</td>
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
                          title="Editar docente"
                        >
                          <EditIcon />
                        </button>
                        <button
                          onClick={() => eliminarDocente(doc.id_docente)}
                          className="facultades-btn eliminar"
                          title="Eliminar docente"
                        >
                          <DeleteIcon />
                        </button>
                        <button
                          onClick={() => {
                            setEditandoDocenteId(doc.id_docente);
                            setNombreDocenteEditado(doc.nombre_docente);
                            setEmailDocenteEditado(doc.email || '');
                            setProgramaDocenteEditado(doc.programa_academico_id);
                            setFacultadDocenteEditada(doc.facultad_id);
                            setModalCambiarDocenteVisible(true);
                          }}
                          className="facultades-btn editar"
                          title="Cambiar"
                        >
                          <ChangeIcon />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '1rem' }}>
                      No se encontraron docentes.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <TablePagination
              totalItems={docentesFiltrados.length}
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

      <DocenteEditarModal
        isOpen={modalEditarDocenteVisible}
        nombre={nombreDocenteEditado}
        onChangeNombre={setNombreDocenteEditado}
        email={emailDocenteEditado}
        onChangeEmail={setEmailDocenteEditado}
        facultad={facultadDocenteEditada}
        onChangeFacultad={(value) => {
          setFacultadDocenteEditada(value);
          setProgramaDocenteEditado("");
        }}
        programa={programaDocenteEditado}
        onChangePrograma={setProgramaDocenteEditado}
        facultades={facultades}
        programas={programasEdicionFiltrados}
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
              showTopWarningToast('Correo inválido', 'El correo del docente debe ser @udh.edu.pe');
              return;
            }

            if (nuevoDocenteWhatsapp.length !== 9) {
              showTopWarningToast('Número inválido', 'El número de WhatsApp debe tener exactamente 9 dígitos.');
              return;
            }

          const success = await crearDocente();
          if (success) {
            setModalDocenteVisible(false);
          }
        }}
      />

      <DocenteCambiarModal
        isOpen={modalCambiarDocenteVisible}
        email={emailDocenteEditado}
        onChangeEmail={setEmailDocenteEditado}
        facultad={facultadDocenteEditada}
        onChangeFacultad={(value) => {
          setFacultadDocenteEditada(value);
          setProgramaDocenteEditado("");
        }}
        programa={programaDocenteEditado}
        onChangePrograma={setProgramaDocenteEditado}
        facultades={facultades}
        programas={programasEdicionFiltrados}
        onClose={() => {
          setModalCambiarDocenteVisible(false);
          setEditandoDocenteId(null);
          setNombreDocenteEditado('');
          setEmailDocenteEditado('');
          setFacultadDocenteEditada('');
          setProgramaDocenteEditado('');
        }}
        onGuardar={async () => {
          const success = await reiniciarDatosDocente(editandoDocenteId);
          if (success) {
            setModalCambiarDocenteVisible(false);
            setEditandoDocenteId(null);
            setNombreDocenteEditado('');
            setEmailDocenteEditado('');
            setFacultadDocenteEditada('');
            setProgramaDocenteEditado('');
          }
        }}
      />
    </>
  );
}

export default React.memo(DocentesSection);

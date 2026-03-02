import React, { useState } from 'react';
import { toastWarning } from '../../../hooks/alerts/alertas';
import EditIcon from "../../../hooks/componentes/Icons/EditIcon";
import DeleteIcon from "../../../hooks/componentes/Icons/DeleteIcon";
import ProgramaEditarModal from "../../modals/ProgramaEditarModal";
import ProgramaNuevoModal from "../../modals/ProgramaNuevoModal";

function ProgramasSection({
  programas,
  modalProgramaVisible,
  setModalProgramaVisible,
  modalEditarProgramaVisible,
  setModalEditarProgramaVisible,
  idEditandoPrograma,
  setIdEditandoPrograma,
  programaEditado,
  setProgramaEditado,
  facultadEditada,
  setFacultadEditada,
  emailEditado,
  setEmailEditado,
  nuevoPrograma,
  setNuevoPrograma,
  facultadPrograma,
  setFacultadPrograma,
  emailPrograma,
  setEmailPrograma,
  whatsappPrograma,
  setWhatsappPrograma,
  facultades,
  eliminarPrograma,
  guardarEdicionPrograma,
  crearPrograma
}) {
  const [originalNombreProgram, setOriginalNombreProgram] = useState('');
  const [originalFacultadProgram, setOriginalFacultadProgram] = useState('');
  const [originalEmailProgram, setOriginalEmailProgram] = useState('');
  return (
    <>
      <div className="programas-container">
        <div className="programas-card">
          <div className="programas-header">
            <div className="programas-header-left">
              <h2>Programas Académicos</h2>
              <button
                className="docentes-btn-agregar"
                onClick={() => setModalProgramaVisible(true)}
              >
                Agregar
              </button>
            </div>
          </div>
          <div className="programas-table-wrapper">
            <table className="programas-table">
              <thead className="programas-table-thead">
                <tr>
                  <th>Nº</th>
                  <th>Nombre</th>
                  <th>Facultad</th>
                  <th>Email</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {programas
                  .map((prog, index) => (
                    <tr key={prog.id_programa}>
                      <td>{index + 1}</td>
                      <td>{(prog.nombre_programa || '').toUpperCase()}</td>
                      <td>{(prog.Facultade?.nombre_facultad || 'SIN FACULTAD').toUpperCase()}</td>
                      <td>{prog.email || 'SIN CORREO'}</td>
                      <td>
                        <button
                          onClick={() => {
                            setIdEditandoPrograma(prog.id_programa);
                            setProgramaEditado(prog.nombre_programa);
                            setFacultadEditada(prog.Facultade?.id_facultad || '');
                            setEmailEditado(prog.email);
                            setOriginalNombreProgram(prog.nombre_programa || '');
                            setOriginalFacultadProgram(prog.Facultade?.id_facultad || '');
                            setOriginalEmailProgram(prog.email || '');
                            setModalEditarProgramaVisible(true);
                          }}
                          className="facultades-btn editar"
                        >
                          <EditIcon />
                        </button>

                        <button
                          onClick={() => eliminarPrograma(prog.id_programa)}
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

      <ProgramaEditarModal
        isOpen={modalEditarProgramaVisible}
        nombre={programaEditado}
        onChangeNombre={setProgramaEditado}
        facultad={facultadEditada}
        onChangeFacultad={setFacultadEditada}
        email={emailEditado}
        onChangeEmail={setEmailEditado}
        facultades={facultades}
        onClose={() => {
          setModalEditarProgramaVisible(false);
          setIdEditandoPrograma(null);
          setProgramaEditado("");
          setFacultadEditada("");
          setEmailEditado("");
        }}
        originalNombre={originalNombreProgram}
        originalFacultad={originalFacultadProgram}
        originalEmail={originalEmailProgram}
        onGuardar={guardarEdicionPrograma}
      />

      <ProgramaNuevoModal
        isOpen={modalProgramaVisible}
        nombrePrograma={nuevoPrograma}
        onChangeNombrePrograma={setNuevoPrograma}
        facultadPrograma={facultadPrograma}
        onChangeFacultadPrograma={setFacultadPrograma}
        emailPrograma={emailPrograma}
        onChangeEmailPrograma={setEmailPrograma}
        whatsappPrograma={whatsappPrograma}
        onChangeWhatsappPrograma={(value) => {
          if (/^\d{0,9}$/.test(value)) {
            setWhatsappPrograma(value);
          }
        }}
        facultades={facultades}
        onClose={() => {
          setModalProgramaVisible(false);
          setNuevoPrograma("");
          setFacultadPrograma("");
          setEmailPrograma("");
          setWhatsappPrograma("");
        }}
        onGuardar={async () => {
          if (whatsappPrograma.length !== 9) {
            toastWarning('Número inválido', { text: 'El número de WhatsApp debe tener exactamente 9 dígitos.' });
            return;
          }

          const ok = await crearPrograma();
          if (ok) {
            setModalProgramaVisible(false);
            setNuevoPrograma('');
            setFacultadPrograma('');
            setEmailPrograma('');
            setWhatsappPrograma('');
          }
        }}
      />
    </>
  );
}

export default React.memo(ProgramasSection);

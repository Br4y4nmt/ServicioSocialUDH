import React from "react";
import Swal from "sweetalert2";
import PerfilIcon from '../../hooks/componentes/Icons/PerfilIcon';
import UsersIcon from '../../hooks/componentes/Icons/UsersIcon';
import { showTopWarningToast } from "../../hooks/alerts/useWelcomeToast";


function GrupoModalAlumno({
  visible,
  solicitudEnviada,
  integrantesGrupoAlumno = [],
  codigosGrupo = [],
  setCodigosGrupo,
  onClose,
  onGuardar,
  loadingGrupo = false,
  mensajeGrupo = "",
}) {
  if (!visible) return null;

  const MAX_INTEGRANTES = 10;

  const handleAgregarOtro = () => {
    if (codigosGrupo.length >= MAX_INTEGRANTES) {
      Swal.fire({
        icon: "warning",
        title: "Límite alcanzado",
        text: `Solo se permiten hasta ${MAX_INTEGRANTES} integrantes en el grupo.`,
        confirmButtonColor: "#011b4b",
        confirmButtonText: "Entendido",
      });
      return;
    }

    setCodigosGrupo([...codigosGrupo, ""]);
  };

  const handleEliminarIntegrante = (indexAEliminar) => {
    if (codigosGrupo.length <= 1) return;
    setCodigosGrupo(codigosGrupo.filter((_, index) => index !== indexAEliminar));
  };

  const handleCerrar = () => {
    if (!solicitudEnviada) {
      const filtrados = codigosGrupo.filter(
        (codigo) => String(codigo).trim().length === 10
      );
      setCodigosGrupo(filtrados);
    }
    onClose?.();
  };

  const handleGuardar = async () => {
    if (typeof onGuardar === "function") {
      const resultado = await onGuardar();
      if (resultado === false) return;
    }

    handleCerrar();
  };

  return (
    <div className="grupo-alumno-modal-overlay">
      <div className="grupo-alumno-modal-container">
        <div className="grupo-alumno-modal-header">
          <div className="grupo-alumno-header-blur grupo-alumno-header-blur-right"></div>
          <div className="grupo-alumno-header-blur grupo-alumno-header-blur-left"></div>

          <div className="grupo-alumno-modal-header-content">
            <h3 className="grupo-alumno-modal-title">
              <span className="grupo-alumno-modal-title-icon">
                <UsersIcon />
              </span>
              Integrantes del grupo
            </h3>

            <p className="grupo-alumno-modal-subtitle">
              Ingresa los códigos universitarios de los miembros del equipo
            </p>
          </div>
        </div>

        <div className="grupo-alumno-modal-body">
          {solicitudEnviada ? (
            <ul className="grupo-alumno-lista">
              {loadingGrupo ? (
                <li className="grupo-alumno-lista-item">Cargando integrantes...</li>
              ) : integrantesGrupoAlumno.length > 0 ? (
                integrantesGrupoAlumno.map((integrante, index) => (
                  <li className="grupo-alumno-lista-item" key={index}>
                    <span className="grupo-alumno-lista-nombre">
                      {integrante.nombre_completo || "Sin nombre"}
                    </span>
                    <span className="grupo-alumno-lista-codigo">
                      {integrante.codigo || "Sin código"}
                    </span>
                  </li>
                ))
              ) : (
                <li className="grupo-alumno-lista-item">
                  {mensajeGrupo || "No hay integrantes registrados."}
                </li>
              )}
            </ul>
          ) : (
            <>
              {codigosGrupo.slice(0, MAX_INTEGRANTES).map((codigo, index) => (
                <div className="grupo-alumno-field" key={index}>
                  <label className="grupo-alumno-label">
                    <PerfilIcon className="grupo-alumno-label-icon" />
                    <span>Código universitario N°{index + 1}</span>
                  </label>

                  <div className="grupo-alumno-input-wrapper">
                    <input
                      type="text"
                      className="grupo-alumno-input"
                      placeholder="Ingresa el código universitario"
                      value={codigo}
                      onChange={(e) => {
                        const input = e.target.value.replace(/\D/g, "").slice(0, 10);
                        const nuevos = [...codigosGrupo];

                        const existe = codigosGrupo.some(
                          (c, i) =>
                            String(c).trim() === input && i !== index && input !== ""
                        );

                        if (existe) {
                          showTopWarningToast("Este integrante ya fue agregado al grupo");
                          nuevos[index] = "";
                          setCodigosGrupo(nuevos);
                          return;
                        }

                        nuevos[index] = input;
                        setCodigosGrupo(nuevos);
                      }}
                      onBlur={() => {
                        if (codigo.length > 0 && codigo.length < 10) {
                          Swal.fire({
                            icon: "warning",
                            title: "Código incompleto",
                            text: "El código debe tener exactamente 10 dígitos.",
                            confirmButtonColor: "#011b4b",
                            confirmButtonText: "Entendido",
                          });
                        }
                      }}
                    />

                    {codigosGrupo.length > 1 && (
              <button
                type="button"
                className="grupo-alumno-btn-remove"
                onClick={() => handleEliminarIntegrante(index)}
                aria-label={`Eliminar integrante ${index + 1}`}
              >
                <span className="icon-x"></span>
              </button>
                    )}
                  </div>
                </div>
              ))}

              {codigosGrupo.length < MAX_INTEGRANTES && (
                <button
                  type="button"
                  onClick={handleAgregarOtro}
                  className="grupo-alumno-btn-add"
                >
                  <span style={{ fontSize: '1.5em', color: '#39B49E', lineHeight: '1' }}>+</span>
                  Agregar otro integrante
                </button>
              )}
            </>
          )}
        </div>

        <div className="grupo-alumno-modal-footer">
          <button
            type="button"
            onClick={handleCerrar}
            className="grupo-alumno-btn grupo-alumno-btn-cancel"
          >
            Cancelar
          </button>

          {!solicitudEnviada && (
            <button
              type="button"
              onClick={handleGuardar}
              className="grupo-alumno-btn grupo-alumno-btn-save"
            >
              Guardar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default GrupoModalAlumno;
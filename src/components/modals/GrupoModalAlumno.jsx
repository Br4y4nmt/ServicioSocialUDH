import React from "react";
import Swal from "sweetalert2";
import { showTopWarningToast } from "../../hooks/alerts/useWelcomeToast";

function GrupoModalAlumno({
  visible,
  solicitudEnviada,
  integrantesGrupoAlumno = [],
  codigosGrupo = [],
  setCodigosGrupo,
  onClose,
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
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Entendido",
      });
      return;
    }

    setCodigosGrupo([...codigosGrupo, ""]);
  };

  const handleCerrar = () => {
    if (!solicitudEnviada) {
      const filtrados = codigosGrupo.filter((codigo) => String(codigo).trim().length === 10);
      setCodigosGrupo(filtrados);
    }
    onClose?.();
  };

  return (
    <div className="modal-grupo-elegante-overlay">
      <div className="modal-grupo-elegante-content">
        <h3 className="modal-grupo-elegante-title">Integrantes del grupo</h3>

        {solicitudEnviada ? (
          <ul className="lista-integrantes">
            {loadingGrupo ? (
              <li>Cargando integrantes...</li>
            ) : integrantesGrupoAlumno.length > 0 ? (
              integrantesGrupoAlumno.map((integrante, index) => (
                <li key={index}>
                  {integrante.nombre_completo || "Sin nombre"} -{" "}
                  {integrante.codigo || "Sin código"}
                </li>
              ))
            ) : (
              <li>{mensajeGrupo || "No hay integrantes registrados."}</li>
            )}
          </ul>
        ) : (
          <>
            {codigosGrupo.slice(0, MAX_INTEGRANTES).map((codigo, index) => (
              <div className="modal-grupo-elegante-field" key={index}>
                <label className="modal-grupo-elegante-label">
                  Código universitario N°{index + 1}
                </label>

                <input
                  type="text"
                  className="modal-grupo-elegante-input"
                  placeholder="Ingrese el código universitario"
                  value={codigo}
                  onChange={(e) => {
                    const input = e.target.value.replace(/\D/g, "").slice(0, 10);
                    const nuevos = [...codigosGrupo];

                    const existe = codigosGrupo.some(
                      (c, i) => String(c).trim() === input && i !== index && input !== ""
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
                        confirmButtonColor: "#3085d6",
                        confirmButtonText: "Entendido",
                      });
                    }
                  }}
                />
              </div>
            ))}
          </>
        )}

        <div
          className="modal-grupo-elegante-actions"
          style={{
            justifyContent:
              solicitudEnviada || codigosGrupo.length >= MAX_INTEGRANTES
                ? "center"
                : "space-between",
            display: "flex",
            gap: "10px",
          }}
        >
          {!solicitudEnviada && codigosGrupo.length < MAX_INTEGRANTES && (
            <button onClick={handleAgregarOtro} className="modal-grupo-elegante-btn agregar">
              + Agregar otro
            </button>
          )}

          <button onClick={handleCerrar} className="modal-grupo-elegante-btn aceptar">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

export default GrupoModalAlumno;
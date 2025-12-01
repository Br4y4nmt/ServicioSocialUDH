// src/components/modals/GrupoModalAlumno.jsx
import React from "react";
import Swal from "sweetalert2";

function GrupoModalAlumno({
  visible,
  solicitudEnviada,
  integrantesGrupoAlumno,
  correosGrupo,
  setCorreosGrupo,
  onClose,
}) {
  if (!visible) return null;

  const handleAgregarOtro = () => {
    if (correosGrupo.length >= 10) {
      Swal.fire({
        icon: "warning",
        title: "Límite alcanzado",
        text: "Solo se permiten hasta 4 integrantes en el grupo.",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Entendido",
      });
    } else {
      setCorreosGrupo([...correosGrupo, ""]);
    }
  };

  const handleCerrar = () => {
    if (!solicitudEnviada) {
      const filtrados = correosGrupo.filter((correo) => {
        const codigo = correo.replace("@udh.edu.pe", "");
        return codigo.length === 10;
      });
      setCorreosGrupo(filtrados);
    }
    onClose();
  };

  return (
    <div className="modal-grupo-elegante-overlay">
      <div className="modal-grupo-elegante-content">
        <h3 className="modal-grupo-elegante-title">Integrantes del Grupo</h3>

        {solicitudEnviada ? (
          <ul className="lista-integrantes">
            {integrantesGrupoAlumno.length > 0 ? (
              integrantesGrupoAlumno.map((integrante, index) => (
                <li key={index}>{integrante.correo_institucional}</li>
              ))
            ) : (
              <li>No hay integrantes registrados.</li>
            )}
          </ul>
        ) : (
          correosGrupo.map((correo, index) => (
            <div className="modal-grupo-elegante-field" key={index}>
              <label className="modal-grupo-elegante-label">
                Correo institucional #{index + 1}
              </label>
              <div style={{ display: "flex", alignItems: "center" }}>
                <input
                  type="text"
                  className="modal-grupo-elegante-input"
                  placeholder="Ingrese el Código Universitario"
                  value={correo.replace("@udh.edu.pe", "")}
                  onChange={(e) => {
                    const input = e.target.value.replace(/\D/g, "");
                    if (input.length <= 10) {
                      const nuevos = [...correosGrupo];
                      nuevos[index] =
                        input.length === 10 ? `${input}@udh.edu.pe` : input;
                      setCorreosGrupo(nuevos);
                    }
                  }}
                  onBlur={() => {
                    const codigo = correo.replace("@udh.edu.pe", "");
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
                <span
                  style={{ marginLeft: "6px", fontSize: "14px", color: "#555" }}
                >
                  @udh.edu.pe
                </span>
              </div>
            </div>
          ))
        )}

        <div
          className="modal-grupo-elegante-actions"
          style={{
            justifyContent:
              solicitudEnviada || correosGrupo.length >= 10
                ? "center"
                : "space-between",
            display: "flex",
            gap: "10px",
          }}
        >
          {!solicitudEnviada && correosGrupo.length < 10 && (
            <button
              onClick={handleAgregarOtro}
              className="modal-grupo-elegante-btn agregar"
            >
              + Agregar otro
            </button>
          )}

          <button
            onClick={handleCerrar}
            className="modal-grupo-elegante-btn aceptar"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

export default GrupoModalAlumno;

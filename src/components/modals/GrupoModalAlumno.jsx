import React from "react";
import Swal from "sweetalert2";

function GrupoModalAlumno({
  visible,
  solicitudEnviada,
  integrantesGrupoAlumno = [],
  correosGrupo = [],
  setCorreosGrupo,
  onClose,
  loadingGrupo = false,
  mensajeGrupo = "",
}) {
  if (!visible) return null;

  const MAX_INTEGRANTES = 10; 

  const toastWarning = (title) => {
    Swal.fire({
      toast: true,
      position: "bottom-start",
      icon: "warning",
      title,
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      background: "#ffffff",
      color: "#1f2937",
      iconColor: "#f59e0b",
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
    });
  };

  const handleAgregarOtro = () => {
    if (correosGrupo.length >= MAX_INTEGRANTES) {
      Swal.fire({
        icon: "warning",
        title: "Límite alcanzado",
        text: `Solo se permiten hasta ${MAX_INTEGRANTES} integrantes en el grupo.`,
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Entendido",
      });
      return;
    }
    setCorreosGrupo([...correosGrupo, ""]);
  };

  const handleCerrar = () => {
    if (!solicitudEnviada) {
      const filtrados = correosGrupo.filter((correo) => {
        const codigo = String(correo).replace("@udh.edu.pe", "");
        return codigo.length === 10;
      });
      setCorreosGrupo(filtrados);
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
                <li key={index}>{integrante.correo_institucional}</li>
              ))
            ) : (
              <li>{mensajeGrupo || "No hay integrantes registrados."}</li>
            )}
          </ul>
        ) : (
          <>
            {correosGrupo.slice(0, MAX_INTEGRANTES).map((correo, index) => (
              <div className="modal-grupo-elegante-field" key={index}>
                <label className="modal-grupo-elegante-label">
                  Correo institucional N°{index + 1}
                </label>

                <div style={{ display: "flex", alignItems: "center" }}>
                  <input
                    type="text"
                    className="modal-grupo-elegante-input"
                    placeholder="Ingrese el Código Universitario"
                    value={String(correo).replace("@udh.edu.pe", "")}
                    onChange={(e) => {
                      const input = e.target.value.replace(/\D/g, "");
                      if (input.length > 10) return;

                      const nuevos = [...correosGrupo];

                      if (input.length === 10) {
                        const correoCompleto = `${input}@udh.edu.pe`;

                        const existe = correosGrupo.some(
                          (c, i) => String(c).trim() === correoCompleto && i !== index
                        );

                        if (existe) {
                          toastWarning("Este integrante ya fue agregado al grupo");
                          nuevos[index] = "";
                          setCorreosGrupo(nuevos);
                          return;
                        }

                        nuevos[index] = correoCompleto;
                      } else {
                        nuevos[index] = input;
                      }

                      setCorreosGrupo(nuevos);
                    }}
                    onBlur={() => {
                      const codigo = String(correo).replace("@udh.edu.pe", "");
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

                  <span style={{ marginLeft: "6px", fontSize: "14px", color: "#555" }}>
                    @udh.edu.pe
                  </span>
                </div>
              </div>
            ))}
          </>
        )}

        <div
          className="modal-grupo-elegante-actions"
          style={{
            justifyContent:
              solicitudEnviada || correosGrupo.length >= MAX_INTEGRANTES
                ? "center"
                : "space-between",
            display: "flex",
            gap: "10px",
          }}
        >
          {!solicitudEnviada && correosGrupo.length < MAX_INTEGRANTES && (
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

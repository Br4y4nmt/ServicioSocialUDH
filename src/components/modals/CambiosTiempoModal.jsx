import React from "react";

function CambiosTiempoModal({
  visible,
  nombreEstudiante,
  cronogramas,
  editando,
  nuevaFecha,
  setNuevaFecha,
  iniciarEdicion,
  guardarFecha,
  guardando,
  onClose,
}) {
  if (!visible) return null;

  return (
    <div className="modal-tiempo-overlay">
      <div className="modal-tiempo-content">
        <h3>Fechas de {nombreEstudiante}</h3>

        {cronogramas.length > 0 ? (
          <table className="modal-tiempo-table">
            <thead>
              <tr>
                <th>Nº</th>
                <th>Actividad</th>
                <th>Fecha Fin</th>
                <th>Acción</th>
              </tr>
            </thead>

            <tbody>
              {cronogramas.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>{item.actividad || "—"}</td>

                  <td>
                    {editando === item.id ? (
                      <input
                        type="date"
                        className="modal-tiempo-input-fecha"
                        value={
                          nuevaFecha ||
                          new Date(item.fecha_fin_primero)
                            .toISOString()
                            .split("T")[0]
                        }
                        onChange={(e) => setNuevaFecha(e.target.value)}
                      />
                    ) : (
                      (() => {
                        const fechaISO = new Date(item.fecha_fin_primero)
                          .toISOString()
                          .split("T")[0];
                        const [yyyy, mm, dd] = fechaISO.split("-");
                        return `${dd}/${mm}/${yyyy}`;
                      })()
                    )}
                  </td>

                  <td className="modal-tiempo-acciones">
                    {editando === item.id ? (
                      <button
                        className="btn-guardar-fecha"
                        onClick={() => guardarFecha(item.id)}
                        disabled={guardando}
                        title="Guardar fecha"
                        aria-label="Guardar fecha"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "6px",
                          padding: "6px 10px",
                          borderRadius: "10px",
                          border: "1px solid rgba(0,0,0,0.15)",
                          background: guardando ? "#9ca3af" : "#2E9E7F",
                          color: "#fff",
                          cursor: guardando ? "not-allowed" : "pointer",
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                          <path d="M17 21v-8H7v8" />
                          <path d="M7 3v5h8" />
                        </svg>
                        <span style={{ fontSize: "12px", fontWeight: 600 }}>
                          {guardando ? "Guardando..." : "Guardar"}
                        </span>
                      </button>
                    ) : (
                      <button
                        className="btn-editar-icono"
                        onClick={() =>
                          iniciarEdicion(item.id, item.fecha_fin_primero)
                        }
                        title="Editar fecha"
                        aria-label="Editar fecha"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "40px",
                          height: "34px",
                          borderRadius: "10px",
                          border: "1px solid rgba(0,0,0,0.15)",
                          background: "#03A9F4",
                          color: "#ffffff",
                          cursor: "pointer",
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d="M12 20h9" />
                          <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                        </svg>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="modal-tiempo-empty">No hay fechas registradas.</p>
        )}

        <div className="modal-tiempo-footer">
          <button className="seguimiento-btn-cerrar" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

export default CambiosTiempoModal;

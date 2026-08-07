import React from "react";

function ObservacionEstudianteModal({
  visible,
  observacionSeleccionada,
  actividadSeleccionada,
  onVolverASubir,
  onClose,
}) {
  if (!visible) return null;

  const ahora = new Date();

  const fechaLimite = actividadSeleccionada?.fecha_limite_reenvio
    ? new Date(actividadSeleccionada.fecha_limite_reenvio)
    : null;

  const plazoVencido =
    fechaLimite && ahora > fechaLimite;

  const yaEnModoReenvio =
    actividadSeleccionada?.correccion_habilitada === true;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 999999,
        padding: "20px",
        boxSizing: "border-box"
      }}
    >
      <div
        style={{
          background: "#fff",
          width: "100%",
          maxWidth: "800px",
          maxHeight: "90vh",
          overflowY: "auto",
          borderRadius: "10px",
          padding: "30px",
          boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
          boxSizing: "border-box"
        }}
      >
        <h3>Observación del Docente</h3>

        <textarea
          className="motivo-rechazo-textarea"
          readOnly
          value={
            observacionSeleccionada ||
            "No hay observación disponible."
          }
        />

        {fechaLimite && (
          <div
            style={{
              marginTop: "15px",
              marginBottom: "15px",
              padding: "10px",
              borderRadius: "6px",
              background: plazoVencido
                ? "#FEE2E2"
                : "#EFF6FF",
              color: plazoVencido
                ? "#991B1B"
                : "#1E40AF",
              fontSize: "14px",
              textAlign: "center"
            }}
          >
            {plazoVencido ? (
              <strong>
                El plazo para corregir la evidencia ha finalizado.
              </strong>
            ) : (
              <>
                <strong>
                  Puedes volver a subir tu evidencia hasta:
                </strong>

                <br />

                {fechaLimite.toLocaleString()}
              </>
            )}
          </div>
        )}

        <div className="motivo-rechazo-footer">

          {!yaEnModoReenvio && (
            <button
              className="grupo-alumno-btn grupo-alumno-btn-save"
              style={{ fontSize: "14px" }}
              onClick={async () => {
                const ok = await onVolverASubir(
                  actividadSeleccionada
                );

                if (ok) {
                  onClose();
                }
              }}
              disabled={
                !actividadSeleccionada ||
                plazoVencido
              }
            >
              Corregir evidencia
            </button>
          )}

          <button
            className="grupo-alumno-btn grupo-alumno-btn-cancel"
            onClick={onClose}
          >
            Cerrar
          </button>

        </div>
      </div>
    </div>
  );
}

export default ObservacionEstudianteModal;
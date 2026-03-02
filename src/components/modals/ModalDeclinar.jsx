import React from "react";

function ModalDeclinar({
  visible,
  observacion,
  setObservacion,
  onCancel,
  onSubmit,
}) {
  if (!visible) return null;

  return (
    <div className="modal-declinar-overlay">
      <div className="modal-declinar-content">
        <h3 style={{ fontWeight: "bold", fontSize: "15px" }}>
          ESCRIBA EL MOTIVO DE SU DECISIÓN
        </h3>

        <textarea
          maxLength={300}
          rows={5}
          placeholder="Escriba aquí su observación..."
          value={observacion}
          onChange={(e) => setObservacion(e.target.value)}
          className="textarea-declinar"
        />

        <div className="modal-declinar-char-count">
          {observacion.length}/300 caracteres
        </div>

        <div className="modal-declinar-actions">
          <button className="btn-cancelar" onClick={onCancel}>
            Cancelar
          </button>

          <button className="btn-enviar" onClick={onSubmit}>
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalDeclinar;

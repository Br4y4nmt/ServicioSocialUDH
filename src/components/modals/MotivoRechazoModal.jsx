import React from "react";
import { createPortal } from "react-dom";

function MotivoRechazoModal({
  visible,
  motivo,
  onChange,
  onClose,
  title = "MOTIVO DEL RECHAZO",
  readOnly = true,
  primaryActionLabel,
  onPrimaryAction,
  primaryActionDisabled = false,
  secondaryActionLabel = "Cerrar",
  textareaRef,
  placeholder,
}) {
  if (!visible) return null;

  return createPortal(
    <div className="motivo-rechazo-modal-overlay">
      <div className="motivo-rechazo-modal">
        <h3 className="motivo-rechazo-title">{title}</h3>

        <textarea
          ref={textareaRef}
          className="motivo-rechazo-textarea"
          readOnly={readOnly}
          placeholder={placeholder}
          onChange={onChange}
          value={
            readOnly
              ? (motivo || "Ocurrió un error al cargar el motivo de rechazo. Inténtelo más tarde.")
              : (motivo || "")
          }
        />

        <div className="motivo-rechazo-footer">
          {primaryActionLabel && onPrimaryAction && (
            <button
              className="grupo-alumno-btn grupo-alumno-btn-save"
              onClick={onPrimaryAction}
              disabled={primaryActionDisabled}
            >
              {primaryActionLabel}
            </button>
          )}

          <button
            className="grupo-alumno-btn grupo-alumno-btn-cancel"
            onClick={onClose}
          >
            {secondaryActionLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default MotivoRechazoModal;

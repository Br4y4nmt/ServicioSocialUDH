import React, {
  useEffect,
  useState
} from "react";

import EvidenciaSkeleton from "../loaders/EvidenciaSkeleton";

function EvidenciaModal({
  visible,
  imagen,
  onClose
}) {
  const [imagenCargada, setImagenCargada] = useState(false);
  const [errorImagen, setErrorImagen] = useState(false);

  useEffect(() => {
    if (visible && imagen) {
      setImagenCargada(false);
      setErrorImagen(false);
    }
  }, [visible, imagen]);

  if (!visible) return null;

  return (
    <div className="evidencia-light-overlay">

      <button
        className="evidencia-light-close"
        onClick={onClose}
        title="Cerrar"
      >
        ×
      </button>

      <div className="evidencia-light-content">

        {!imagenCargada && !errorImagen && (
          <EvidenciaSkeleton />
        )}

        <div
          className="evidencia-light-img-wrapper"
          style={{
            display:
              imagenCargada || errorImagen
                ? "flex"
                : "none"
          }}
        >

          {!errorImagen && (
            <img
              src={imagen}
              alt="Evidencia"
              className="evidencia-light-img"
              onLoad={() => {
                setImagenCargada(true);
                setErrorImagen(false);
              }}
              onError={() => {
                setImagenCargada(false);
                setErrorImagen(true);
              }}
            />
          )}

          {errorImagen && (
            <div
              style={{
                textAlign: "center",
                color: "#64748b",
                fontSize: "15px"
              }}
            >
              No se pudo cargar la evidencia.
            </div>
          )}

          <div className="evidencia-light-caption">
            Servicio Social UDH
          </div>

        </div>

      </div>

    </div>
  );
}

export default EvidenciaModal;
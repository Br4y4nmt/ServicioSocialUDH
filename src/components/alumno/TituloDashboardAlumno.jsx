import React from 'react';

const TITULOS = {
  seguimiento: 'Seguimiento del Servicio Social',
  conformidad: 'Conformidad De Servicio Social',
  'informe-final': 'Informe Final',
};

function TituloDashboardAlumno({ activeSection }) {
  const width = window.innerWidth;
  const titulo = TITULOS[activeSection] || 'Servicio Social UDH';

  let partes = [titulo];

  if (activeSection === 'conformidad') {
    if (width <= 400) {
      partes = ['Conformidad De', 'Servicio Social'];
    } else if (width <= 420) {
      partes = ['Conformidad De Servicio', 'Social'];
    }
  }

  const delayFactor = width < 768 ? 0.02 : 0.05;

  return (
    <h1
      className="dashboard-title-animada"
      style={{ marginBottom: '40px' }}
      key={activeSection}
    >
      {partes.map((linea, i) =>
        Array.from(linea)
          .map((letra, index) => (
            <span
              key={`${i}-${index}`}
              style={{ animationDelay: `${(i * 100 + index) * delayFactor}s` }}
            >
              {letra === ' ' ? (
                <span style={{ width: '0.4em', display: 'inline-block' }}>{'\u00A0'}</span>
              ) : (
                letra
              )}
            </span>
          ))
          .concat(
            i < partes.length - 1
              ? [<br key={`br-${i}`} className="mobile-line-break" />]
              : []
          )
      )}
    </h1>
  );
}

export default React.memo(TituloDashboardAlumno);

import React from 'react';

function NavegacionAlumno({ activeSection, setActiveSection, handleGoToNextSection }) {
  const handleAnterior = () => {
    if (activeSection === 'conformidad') setActiveSection('designacion');
    else if (activeSection === 'seguimiento') setActiveSection('conformidad');
    else if (activeSection === 'informe-final') setActiveSection('seguimiento');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
      {activeSection !== 'designacion' && (
        <button className="boton-anterior" onClick={handleAnterior}>
          Anterior
        </button>
      )}

      {activeSection !== 'informe-final' && (
        <button className="boton-siguiente" onClick={handleGoToNextSection}>
          Siguiente
        </button>
      )}
    </div>
  );
}

export default React.memo(NavegacionAlumno);

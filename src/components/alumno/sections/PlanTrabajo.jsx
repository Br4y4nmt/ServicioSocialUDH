import React from 'react';
import './Reglamento.css'; 
import InfoTooltipIcon from '../../../hooks/componentes/Icons/InfoTooltipIcon';
import PdfIcon from '../../../hooks/componentes/PdfIcon';
import { VerBotonInline } from '../../../hooks/componentes/VerBoton';

function PlanTrabajo() {
  return (
      <div style={{ border: '1px solid #e2e2e2', borderRadius: '10px', padding: '20px', backgroundColor: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
          <span className="check-circle-plan">
          <i className="fas fa-check"></i>
        </span>
          <h3 className="titulo-reglamento">PLAN DE TRABAJO</h3>
          <div className="info-tooltip">
          <InfoTooltipIcon
          />
          <div className="tooltip-text">
            Aquí podrás visualizar el plan servicio social Universitario.
          </div>
        </div>
              </div>
  
        <div className="reglamento-box" style={{
          border: '1px solid #dcdcdc',
          borderRadius: '10px',
          padding: '15px 20px',
          backgroundColor: '#f9f9f9'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '32px' }}>
                <PdfIcon />
              </div>
            <strong>PLAN DE TRABAJO SERVICIO SOCIAL</strong>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <VerBotonInline
              onClick={() =>
                window.open('https://drive.google.com/file/d/13NCxoOYne46Wx46xydWWPR2tRf5HV8gq/view?usp=sharing', '_blank')
              }
            />
            <span className="etiqueta-vigente">
            Vigente
          </span>
          </div>
        </div>
      </div>
    );
  }
export default PlanTrabajo;

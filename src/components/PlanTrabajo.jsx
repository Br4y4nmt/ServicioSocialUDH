// src/components/PlanTrabajo.jsx

import React from 'react';
import './Reglamento.css'; 
import { HiOutlineInformationCircle } from 'react-icons/hi';

function PlanTrabajo() {
  return (
      <div style={{ border: '1px solid #e2e2e2', borderRadius: '10px', padding: '20px', backgroundColor: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
          <span className="check-circle-plan">
          <i className="fas fa-check"></i>
        </span>
          <h3 className="titulo-reglamento">PLAN DE TRABAJO</h3>
          <div className="info-tooltip">
          <HiOutlineInformationCircle
            style={{
              marginLeft: '10px',
              color: '#888',
              fontSize: '22px' 
            }}
          />
          <div className="tooltip-text">
            Aquí podrás visualizar el plan servicio social.
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
              <svg
                viewBox="0 0 512 512"
                xmlns="http://www.w3.org/2000/svg"
                style={{ width: '100%' }}
              >
                <path style={{ fill: "#E2E5E7" }} d="M128,0c-17.6,0-32,14.4-32,32v448c0,17.6,14.4,32,32,32h320c17.6,0,32-14.4,32-32V128L352,0H128z" />
                <path style={{ fill: "#B0B7BD" }} d="M384,128h96L352,0v96C352,113.6,366.4,128,384,128z" />
                <polygon style={{ fill: "#CAD1D8" }} points="480,224 384,128 480,128" />
                <path style={{ fill: "#F15642" }} d="M416,416c0,8.8-7.2,16-16,16H48c-8.8,0-16-7.2-16-16V256c0-8.8,7.2-16,16-16h352c8.8,0,16,7.2,16,16V416z" />
                <g>
                  <path style={{ fill: "#FFFFFF" }} d="M101.744,303.152c0-4.224,3.328-8.832,8.688-8.832h29.552c16.64,0,31.616,11.136,31.616,32.48
                      c0,20.224-14.976,31.488-31.616,31.488h-21.36v16.896c0,5.632-3.584,8.816-8.192,8.816c-4.224,0-8.688-3.184-8.688-8.816V303.152z
                      M118.624,310.432v31.872h21.36c8.576,0,15.36-7.568,15.36-15.504c0-8.944-6.784-16.368-15.36-16.368H118.624z" />
                  <path style={{ fill: "#FFFFFF" }} d="M196.656,384c-4.224,0-8.832-2.304-8.832-7.92v-72.672c0-4.592,4.608-7.936,8.832-7.936h29.296
                      c58.464,0,57.184,88.528,1.152,88.528H196.656z M204.72,311.088V368.4h21.232c34.544,0,36.08-57.312,0-57.312H204.72z" />
                  <path style={{ fill: "#FFFFFF" }} d="M303.872,312.112v20.336h32.624c4.608,0,9.216,4.608,9.216,9.072c0,4.224-4.608,7.68-9.216,7.68
                      h-32.624v26.864c0,4.48-3.184,7.92-7.664,7.92c-5.632,0-9.072-3.44-9.072-7.92v-72.672c0-4.592,3.456-7.936,9.072-7.936h44.912
                      c5.632,0,8.96,3.344,8.96,7.936c0,4.096-3.328,8.704-8.96,8.704h-37.248V312.112z" />
                </g>
                <path style={{ fill: "#CAD1D8" }} d="M400,432H96v16h304c8.8,0,16-7.2,16-16v-16C416,424.8,408.8,432,400,432z" />
              </svg>
            </div>
            <strong>PLAN DE TRABAJO SERVICIO SOCIAL</strong>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              className="btn-ver-documento-inline"
              onClick={() =>
                window.open('https://drive.google.com/file/d/13NCxoOYne46Wx46xydWWPR2tRf5HV8gq/view?usp=sharing', '_blank') // ← pon aquí tu URL de Drive
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 5c-7.633 0-12 7-12 7s4.367 7 12 7 12-7 12-7-4.367-7-12-7zm0 12
                          c-2.761 0-5-2.239-5-5s2.239-5 5-5 5 2.239 5 5-2.239 5-5 5zm0-8
                          c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3z" />
              </svg>
              Ver
            </button>
  
            <span className="etiqueta-vigente">
            Vigente
          </span>
          </div>
        </div>
      </div>
    );
  }
export default PlanTrabajo;

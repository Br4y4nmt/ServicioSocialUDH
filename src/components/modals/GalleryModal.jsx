import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import '../landing/LandingPage.css';

function GalleryModal({ open, onClose, item }) {
  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') onClose();
    }

    if (open) document.addEventListener('keydown', handleKey);

    // prevent body scrolling when modal is open
    const previousBodyOverflow = document.body.style.overflow;
    if (open) document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = previousBodyOverflow || '';
    };  
  }, [open, onClose]);

  if (!open || !item) return null;

  const modalNode = (
    <div className="gallery-modal-overlay" onMouseDown={onClose}>
      <div className="gallery-modal-content" onMouseDown={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <button className="gallery-modal-close" onClick={onClose} aria-label="Cerrar">
          ×
        </button>

        <div className="gallery-modal-body">
          <div className="gallery-modal-image-wrapper">
            <img src={item.image} alt={item.alt} className="gallery-modal-image" />
            <div className="gallery-modal-image-overlay" aria-hidden="true" />
            {item.badge && <span className="gallery-modal-badge">{item.badge}</span>}
          </div>
          <div className="gallery-modal-info">
            
            <h3 className="gallery-modal-title">{item.title}</h3>
            <div className="gallery-modal-title-underline" aria-hidden="true" />

            

            {/* show paragraph description first (if any) */}
            {item.description && typeof item.description === 'string' && (
              <p className="landing-hero-description-a" style={{ marginTop: '12px', fontSize: '17px', color: '#64748b' }}>
                {item.description}
              </p>
            )}

            {/* show bullets below paragraph if provided */}
            {Array.isArray(item.bullets) && item.bullets.length > 0 ? (
              <ul className="gallery-modal-list">
                {item.bullets.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            ) : /* backward compatibility: if description is an array, render it as bullets */ Array.isArray(item.description) ? (
              <ul className="gallery-modal-list">
                {item.description.map((d, i) => (
                  <li  key={i}>{d}</li>
                ))}
              </ul>
            ) : null}
{/* light separator under bullets */}
            {((Array.isArray(item.bullets) && item.bullets.length > 0) || Array.isArray(item.description)) && (
              <div className="gallery-modal-separator" aria-hidden="true" />
            )}
            {/* stats (if any) - placed below bullets */}
            {Array.isArray(item.stats) && item.stats.length > 0 && (
              <div className="gallery-stats">
                {item.stats.map((s, idx) => (
                  <div className="gallery-stat" key={idx}>
                    <div className="gallery-stat-value">{s.value}</div>
                    <div className="landing-hero-description-a" style={{ color: '#0F2F54', fontSize: '20px', fontWeight: 600 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );

  try {
    return ReactDOM.createPortal(modalNode, document.body);
  } catch (err) {
    // Fallback: render inline if portal fails (useful during SSR or build edge cases)
    // eslint-disable-next-line no-console
    console.warn('Portal failed, rendering modal inline', err);
    return modalNode;
  }
}

export default GalleryModal;

import React from "react";

/**
 * Skeleton shimmer tipo "vista" (como tu ejemplo actual)
 * Mantiene EXACTO el estilo: sm/md/lg/xl + chip
 */
function PageSkeleton({
  topBlocks = ["sm", "md", "lg"], // bloques superiores
  xlRows = 3,                     // filas grandes (tipo tabla)
  showChip = true,                // chip/botón pequeño
  lastXL = true,                  // una XL extra al final
  className = "",
}) {
  return (
    <div className={`skeleton-wrapper ${className}`}>
      <div className="skeleton-card">
        {/* header/inputs simulados */}
        {topBlocks.map((size, i) => (
          <div key={i} className={`skeleton-row ${size}`} />
        ))}

        {/* filas tipo tabla */}
        {Array.from({ length: xlRows }).map((_, i) => (
          <div key={i} className="skeleton-row xl" />
        ))}

        {/* chip */}
        {showChip && <div className="skeleton-chip" />}

        {/* fila extra grande */}
        {lastXL && <div className="skeleton-row xl" style={{ marginTop: "14px" }} />}
      </div>
    </div>
  );
}

export default PageSkeleton;

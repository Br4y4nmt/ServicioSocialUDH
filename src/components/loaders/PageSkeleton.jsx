import React from "react";

function PageSkeleton({
  topBlocks = ["sm", "md", "lg"], 
  xlRows = 3,                     
  showChip = true,                
  lastXL = true,                
  className = "",
}) {
  return (
    <div className={`skeleton-wrapper ${className}`}>
      <div className="skeleton-card">
        {topBlocks.map((size, i) => (
          <div key={i} className={`skeleton-row ${size}`} />
        ))}

        {Array.from({ length: xlRows }).map((_, i) => (
          <div key={i} className="skeleton-row xl" />
        ))}

        {showChip && <div className="skeleton-chip" />}

        {lastXL && <div className="skeleton-row xl" style={{ marginTop: "14px" }} />}
      </div>
    </div>
  );
}

export default PageSkeleton;

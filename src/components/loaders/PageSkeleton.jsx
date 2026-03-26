import React from "react";

function PageSkeleton({
  xlRows = 5,
  className = "",
}) {
  return (
    <div className={`skeleton-wrapper ${className}`}>
      <div className="skeleton-card">
        {Array.from({ length: xlRows }).map((_, i) => (
          <div key={i} className="skeleton-row xl" />
        ))}
      </div>
    </div>
  );
}

export default PageSkeleton;
import React from "react";

function DashboardIcon({ size = 20, color = "#2e9e7f", className = "" }) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			width={size}
			height={size}
			fill="none"
			stroke={color}
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
			className={className}
		>
			<rect x="3" y="4" width="18" height="12" rx="2" />
			<path d="M8 20h8" />
			<path d="M12 16v4" />
		</svg>
	);
}

export default DashboardIcon;

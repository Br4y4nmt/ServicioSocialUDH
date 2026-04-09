import React from 'react';

function InstagramIcon({ className = '', ariaHidden = true, ...props }) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden={ariaHidden}
			className={className}
			{...props}
		>
			<rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
			<path d="M16.5 7.5h.01" />
			<circle cx="12" cy="12" r="4" />
		</svg>
	);
}

export default InstagramIcon;

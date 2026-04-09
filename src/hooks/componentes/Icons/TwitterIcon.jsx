import React from 'react';

function TwitterIcon({ className = '', ariaHidden = true, ...props }) {
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
			<path d="M22 5.92c-.74.33-1.53.55-2.36.65a4.1 4.1 0 0 0 1.8-2.27 8.18 8.18 0 0 1-2.6 1 4.08 4.08 0 0 0-6.95 3.72 11.57 11.57 0 0 1-8.4-4.26 4.08 4.08 0 0 0 1.26 5.45 4.06 4.06 0 0 1-1.85-.51v.05a4.08 4.08 0 0 0 3.27 4 4.1 4.1 0 0 1-1.84.07 4.08 4.08 0 0 0 3.8 2.84A8.2 8.2 0 0 1 2 18.36 11.56 11.56 0 0 0 8.26 20.2c7.52 0 11.64-6.23 11.64-11.63 0-.18 0-.36-.02-.53A8.3 8.3 0 0 0 22 5.92Z" />
		</svg>
	);
}

export default TwitterIcon;

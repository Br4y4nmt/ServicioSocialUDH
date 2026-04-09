import React from 'react';

function WhatsappIcon({ className = '', ariaHidden = true, ...props }) {
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
			<path d="M21 11.5A8.5 8.5 0 0 1 8.16 18.86L3 20l1.14-5.16A8.5 8.5 0 1 1 21 11.5Z" />
			<path d="M8.5 9.5c.2-.5.4-.5.7-.5h.6c.2 0 .4.1.5.4l.7 1.7c.1.2 0 .4-.1.5l-.5.6c-.1.1-.1.3 0 .4.4.8 1.1 1.5 1.9 1.9.1.1.3.1.4 0l.6-.5c.2-.1.4-.2.6-.1l1.7.7c.3.1.4.3.4.5v.6c0 .3 0 .5-.5.7-.4.2-1.3.2-2.8-.4-1.2-.5-2.4-1.5-3.2-2.4-.9-.8-1.9-2-2.4-3.2-.6-1.5-.6-2.4-.4-2.8Z" />
		</svg>
	);
}

export default WhatsappIcon;

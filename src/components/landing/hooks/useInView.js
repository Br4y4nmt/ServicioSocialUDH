import { useEffect, useState, useRef } from 'react';

export default function useInView(offset = '0px') {
	const ref = useRef(null);
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		if (!ref.current || isVisible) {
			return undefined;
		}

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setIsVisible(true);
					observer.disconnect();
				}
			},
			{
				rootMargin: offset,
				threshold: 0.2,
			}
		);

		observer.observe(ref.current);

		return () => observer.disconnect();
	}, [offset, isVisible]);

	return [ref, isVisible];
}
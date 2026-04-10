import { motion } from 'framer-motion';

function AnimatedSection({ children }) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 60 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: '-100px' }}
			transition={{ duration: 0.6, ease: 'easeOut' }}
		>
			{children}
		</motion.div>
	);
}

export default AnimatedSection;

import { motion } from "framer-motion";

const LoadingSpinner = () => {
	return (
		<div className='min-h-screen bg-black flex items-center justify-center relative overflow-hidden'>
			{/* Dark-Themed Loading Spinner */}
			<motion.div
				className='w-16 h-16 border-4 border-t-4 border-t-cyan-500 border-gray-800 rounded-full shadow-lg'
				animate={{ rotate: 360 }}
				transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
			/>
		</div>
	);
};

export default LoadingSpinner;

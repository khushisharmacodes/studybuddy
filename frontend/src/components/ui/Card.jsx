import { motion } from 'framer-motion';

export default function Card({ children, className = '', hover = true, ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hover ? { y: -4, boxShadow: '0 20px 48px rgba(139, 92, 246, 0.12)' } : {}}
      transition={{ duration: 0.3 }}
      className={`glass-card rounded-3xl p-6 ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}

import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const variants = {
  primary: 'bg-violet-500 text-white hover:bg-violet-600 shadow-lg shadow-violet-200',
  secondary: 'bg-white text-stone-700 hover:bg-stone-50 border border-stone-200 shadow-sm',
  ghost: 'bg-transparent text-stone-600 hover:bg-stone-100',
  danger: 'bg-rose-500 text-white hover:bg-rose-600 shadow-lg shadow-rose-200',
  cozy: 'bg-gradient-to-r from-violet-500 to-rose-400 text-white hover:opacity-90 shadow-lg shadow-violet-200',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-base',
  lg: 'px-8 py-3.5 text-lg',
  icon: 'p-2.5',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className = '',
  disabled = false,
  ...props
}) {
  return (
    <motion.button
      whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
      className={`
        inline-flex items-center justify-center gap-2 rounded-2xl font-medium
        transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]} ${sizes[size]} ${className}
      `}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </motion.button>
  );
}

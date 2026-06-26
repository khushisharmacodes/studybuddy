export default function Input({ label, error, className = '', ...props }) {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-stone-600 mb-1.5 ml-1">
          {label}
        </label>
      )}
      <input
        className={`
          w-full px-4 py-3 rounded-2xl bg-white/80 border border-stone-200
          text-stone-800 placeholder:text-stone-400
          focus:outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100
          transition-all duration-200
          ${error ? 'border-rose-400 focus:border-rose-400 focus:ring-rose-100' : ''}
        `}
        {...props}
      />
      {error && <p className="mt-1.5 ml-1 text-sm text-rose-500">{error}</p>}
    </div>
  );
}

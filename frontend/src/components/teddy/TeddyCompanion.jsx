import { motion } from 'framer-motion';

const expressions = {
  idle: { eyeScaleY: 1, mouthD: 'M 46 68 Q 50 72 54 68', blushOpacity: 0.4, tilt: 0, browY: 0, sparkle: true },
  studying: { eyeScaleY: 1, mouthD: 'M 48 70 Q 50 70 52 70', blushOpacity: 0.25, tilt: 0, browY: -1, sparkle: false },
  sleepy: { eyeScaleY: 0.15, mouthD: 'M 48 72 Q 50 74 52 72', blushOpacity: 0.2, tilt: -4, browY: 2, sparkle: false },
  happy: { eyeScaleY: 1, mouthD: 'M 45 67 Q 50 75 55 67', blushOpacity: 0.55, tilt: 3, browY: -1, sparkle: true },
  excited: { eyeScaleY: 1.15, mouthD: 'M 46 65 Q 50 78 54 65', blushOpacity: 0.65, tilt: -3, browY: -2, sparkle: true },
  sad: { eyeScaleY: 1, mouthD: 'M 46 74 Q 50 70 54 74', blushOpacity: 0.15, tilt: 5, browY: 3, sparkle: false },
  celebrating: { eyeScaleY: 1.15, mouthD: 'M 45 66 Q 50 77 55 66', blushOpacity: 0.65, tilt: -6, browY: -2, sparkle: true },
  motivational: { eyeScaleY: 1, mouthD: 'M 47 69 Q 50 73 53 69', blushOpacity: 0.4, tilt: 0, browY: -1, sparkle: true },
  worried: { eyeScaleY: 1, mouthD: 'M 47 72 Q 50 70 53 72', blushOpacity: 0.25, tilt: 2, browY: 2, sparkle: false },
};

const Sparkle = ({ cx, cy, delay }) => (
  <motion.path
    d={`M ${cx} ${cy - 5} L ${cx + 1} ${cy - 1} L ${cx + 5} ${cy} L ${cx + 1} ${cy + 1} L ${cx} ${cy + 5} L ${cx - 1} ${cy + 1} L ${cx - 5} ${cy} L ${cx - 1} ${cy - 1} Z`}
    fill="#fbbf24"
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: [0, 1, 0], scale: [0, 1, 0], rotate: [0, 180] }}
    transition={{ duration: 2, repeat: Infinity, delay, ease: 'easeInOut' }}
  />
);

export default function TeddyCompanion({ state = 'idle', message, compact = false, className = '' }) {
  const expr = expressions[state] || expressions.idle;
  const displayMessage = message;
  const size = compact ? 100 : 160;
  const scale = size / 160;

  return (
    <motion.div
      animate={{ rotate: expr.tilt, y: state === 'celebrating' ? [0, -12, 0] : [0, -4, 0] }}
      transition={{
        rotate: { duration: 0.6 },
        y: {
          duration: state === 'celebrating' ? 0.5 : 2.5,
          repeat: Infinity,
          ease: 'easeInOut',
        },
      }}
      className={`flex flex-col items-center ${className}`}
    >
      <div className="relative">
        <motion.svg
          width={size}
          height={size * 1.12}
          viewBox="0 0 160 180"
          className="drop-shadow-2xl"
          style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}
        >
          {/* Outer ears */}
          <circle cx="42" cy="42" r="28" fill="#d4a373" />
          <circle cx="118" cy="42" r="28" fill="#d4a373" />

          {/* Inner ears */}
          <circle cx="42" cy="42" r="18" fill="#fae1dd" />
          <circle cx="118" cy="42" r="18" fill="#fae1dd" />

          {/* Head fluff */}
          <ellipse cx="80" cy="80" rx="62" ry="56" fill="#e6b8a2" />
          <ellipse cx="80" cy="82" rx="58" ry="52" fill="#f5d0c5" />

          {/* Snout area */}
          <ellipse cx="80" cy="92" rx="26" ry="20" fill="#fff1f0" />

          {/* Heart nose */}
          <path
            d="M 80 82 C 80 78, 74 74, 70 78 C 66 82, 80 92, 80 92 C 80 92, 94 82, 90 78 C 86 74, 80 78, 80 82 Z"
            fill="#f472b6"
          />

          {/* Eyes with shine */}
          <motion.ellipse
            cx="56"
            cy="68"
            rx="8"
            ry="10"
            fill="#4a3b32"
            animate={{ scaleY: expr.eyeScaleY }}
            transition={{ duration: 0.15 }}
          />
          <circle cx="58" cy="64" r="3" fill="white" />
          <motion.ellipse
            cx="104"
            cy="68"
            rx="8"
            ry="10"
            fill="#4a3b32"
            animate={{ scaleY: expr.eyeScaleY }}
            transition={{ duration: 0.15 }}
          />
          <circle cx="106" cy="64" r="3" fill="white" />

          {/* Animated blink */}
          <motion.ellipse
            cx="56"
            cy="68"
            rx="8"
            ry="0.5"
            fill="#f5d0c5"
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 3.5 }}
          />
          <motion.ellipse
            cx="104"
            cy="68"
            rx="8"
            ry="0.5"
            fill="#f5d0c5"
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 3.5 }}
          />

          {/* Mouth */}
          <motion.path
            d={expr.mouthD}
            stroke="#4a3b32"
            strokeWidth="3"
            fill="transparent"
            strokeLinecap="round"
            animate={{ d: expr.mouthD }}
          />

          {/* Cheeks */}
          <motion.circle
            cx="40"
            cy="84"
            r="9"
            fill="#fda4af"
            opacity={expr.blushOpacity}
            animate={{ opacity: expr.blushOpacity }}
          />
          <motion.circle
            cx="120"
            cy="84"
            r="9"
            fill="#fda4af"
            opacity={expr.blushOpacity}
            animate={{ opacity: expr.blushOpacity }}
          />

          {/* Body */}
          <ellipse cx="80" cy="158" rx="48" ry="42" fill="#e6b8a2" />
          <ellipse cx="80" cy="156" rx="34" ry="30" fill="#fff1f0" />

          {/* Paws */}
          <ellipse cx="38" cy="140" rx="14" ry="12" fill="#f5d0c5" />
          <ellipse cx="122" cy="140" rx="14" ry="12" fill="#f5d0c5" />
          <circle cx="34" cy="142" r="2.5" fill="#fda4af" />
          <circle cx="40" cy="144" r="2.5" fill="#fda4af" />
          <circle cx="46" cy="142" r="2.5" fill="#fda4af" />
          <circle cx="118" cy="142" r="2.5" fill="#fda4af" />
          <circle cx="124" cy="144" r="2.5" fill="#fda4af" />
          <circle cx="130" cy="142" r="2.5" fill="#fda4af" />

          {/* Bow tie */}
          <path d="M 80 138 L 68 130 L 68 146 Z" fill="#f472b6" />
          <path d="M 80 138 L 92 130 L 92 146 Z" fill="#f472b6" />
          <circle cx="80" cy="138" r="5" fill="#ec4899" />

          {/* Sparkles */}
          {expr.sparkle && (
            <>
              <Sparkle cx="18" cy="28" delay={0} />
              <Sparkle cx="142" cy="34" delay={0.6} />
              <Sparkle cx="148" cy="110" delay={1.2} />
            </>
          )}
        </motion.svg>

        {/* Speech bubble */}
        {displayMessage && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            key={displayMessage}
            className={`absolute -top-2 ${compact ? '-right-24 max-w-[110px]' : '-right-36 max-w-[160px]'} bg-white/95 backdrop-blur-sm rounded-2xl rounded-bl-none px-3 py-2 shadow-lg border border-pink-100`}
          >
            <p className={`text-stone-600 leading-snug ${compact ? 'text-[10px]' : 'text-xs'}`}>{displayMessage}</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

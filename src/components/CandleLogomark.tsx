interface Props {
  size?: number;
  className?: string;
}

/** Tiny candle-flame logomark — single SVG, no deps. */
const CandleLogomark = ({ size = 22, className = "" }: Props) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    aria-hidden="true"
  >
    <defs>
      <radialGradient id="flame" cx="50%" cy="40%" r="55%">
        <stop offset="0%" stopColor="hsl(45 100% 80%)" />
        <stop offset="55%" stopColor="hsl(35 100% 60%)" />
        <stop offset="100%" stopColor="hsl(15 90% 45%)" />
      </radialGradient>
    </defs>
    <path
      d="M12 2.5c-1.4 2.4-3.6 4.2-3.6 7.1 0 2 1.6 3.6 3.6 3.6s3.6-1.6 3.6-3.6c0-2.9-2.2-4.7-3.6-7.1Z"
      fill="url(#flame)"
    >
      <animate
        attributeName="opacity"
        values="1;0.85;1;0.92;1"
        dur="2.4s"
        repeatCount="indefinite"
      />
    </path>
    <rect x="9.5" y="14" width="5" height="7" rx="0.6" fill="hsl(42 30% 88%)" />
    <rect x="9.5" y="14" width="5" height="1.2" fill="hsl(42 50% 65%)" />
  </svg>
);

export default CandleLogomark;

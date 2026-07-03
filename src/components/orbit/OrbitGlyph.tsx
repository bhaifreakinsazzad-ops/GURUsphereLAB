interface Props {
  size?: number;
  className?: string;
  title?: string;
}

/** Orbit brand mark — a filled disc with one thin elliptical ring. Restrained by design. */
const OrbitGlyph = ({ size = 24, className, title = "GURUsphere" }: Props) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    role="img"
    aria-label={title}
  >
    <ellipse
      cx="16"
      cy="16"
      rx="14"
      ry="6"
      transform="rotate(-22 16 16)"
      stroke="hsl(var(--orbit-accent))"
      strokeWidth="1.25"
      opacity="0.85"
    />
    <circle cx="16" cy="16" r="5.5" fill="hsl(var(--orbit-primary))" />
    <circle cx="16" cy="16" r="5.5" fill="url(#orbit-shine)" opacity="0.55" />
    <defs>
      <radialGradient id="orbit-shine" cx="0.35" cy="0.3" r="0.65">
        <stop offset="0%" stopColor="white" stopOpacity="0.5" />
        <stop offset="100%" stopColor="white" stopOpacity="0" />
      </radialGradient>
    </defs>
  </svg>
);

export default OrbitGlyph;

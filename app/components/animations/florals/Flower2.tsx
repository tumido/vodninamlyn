interface FloralProps {
  className?: string;
  color?: string;
}

export const Flower2 = ({ className = '', color = '#8fb8d4' }: FloralProps) => (
  <svg viewBox="0 0 100 100" fill="none" className={className}>
    {/* Daisy-style flower */}
    <circle cx="50" cy="50" r="10" stroke={color} strokeWidth="2" />
    <path d="M50 40 Q45 25 50 15 Q55 25 50 40" stroke={color} strokeWidth="1.5" />
    <path d="M60 50 Q75 45 85 50 Q75 55 60 50" stroke={color} strokeWidth="1.5" />
    <path d="M50 60 Q55 75 50 85 Q45 75 50 60" stroke={color} strokeWidth="1.5" />
    <path d="M40 50 Q25 55 15 50 Q25 45 40 50" stroke={color} strokeWidth="1.5" />
    <path d="M57 43 Q68 28 78 22 Q68 32 57 43" stroke={color} strokeWidth="1.5" />
    <path d="M57 57 Q68 72 78 78 Q68 68 57 57" stroke={color} strokeWidth="1.5" />
    <path d="M43 57 Q32 72 22 78 Q32 68 43 57" stroke={color} strokeWidth="1.5" />
    <path d="M43 43 Q32 28 22 22 Q32 32 43 43" stroke={color} strokeWidth="1.5" />
  </svg>
);

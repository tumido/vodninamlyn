interface FloralProps {
  className?: string;
  color?: string;
}

export const Branch2 = ({ className = '', color = '#8fb8d4' }: FloralProps) => (
  <svg viewBox="0 0 100 100" fill="none" className={className}>
    {/* Alternate branch design */}
    <path d="M80 20 Q65 35 55 50 Q50 60 45 80" stroke={color} strokeWidth="2" strokeLinecap="round" />
    {/* Leaves */}
    <path d="M72 28 Q78 23 83 28 Q78 33 72 28" stroke={color} strokeWidth="1.5" />
    <path d="M60 40 Q54 35 49 40 Q54 45 60 40" stroke={color} strokeWidth="1.5" />
    <path d="M58 55 Q64 50 69 55 Q64 60 58 55" stroke={color} strokeWidth="1.5" />
    <path d="M48 68 Q42 63 37 68 Q42 73 48 68" stroke={color} strokeWidth="1.5" />
  </svg>
);

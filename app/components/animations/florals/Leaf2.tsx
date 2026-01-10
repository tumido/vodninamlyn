interface FloralProps {
  className?: string;
  color?: string;
}

export const Leaf2 = ({ className = '', color = '#8fb8d4' }: FloralProps) => (
  <svg viewBox="0 0 100 100" fill="none" className={className}>
    {/* Alternate leaf design */}
    <path d="M50 20 Q55 35 58 50 Q60 65 58 80" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path d="M56 35 Q66 30 71 35 Q66 40 56 35" stroke={color} strokeWidth="1.5" />
    <path d="M52 50 Q42 45 37 50 Q42 55 52 50" stroke={color} strokeWidth="1.5" />
    <path d="M60 50 Q70 45 75 50 Q70 55 60 50" stroke={color} strokeWidth="1.5" />
    <path d="M54 65 Q44 60 39 65 Q44 70 54 65" stroke={color} strokeWidth="1.5" />
    <path d="M60 70 Q70 65 75 70 Q70 75 60 70" stroke={color} strokeWidth="1.5" />
  </svg>
);

interface FloralProps {
  className?: string;
  color?: string;
}

export const Branch1 = ({ className = '', color = '#8fb8d4' }: FloralProps) => (
  <svg viewBox="0 0 100 100" fill="none" className={className}>
    {/* Curved branch with leaves */}
    <path d="M20 80 Q30 60 40 40 Q45 30 50 20" stroke={color} strokeWidth="2" strokeLinecap="round" />
    {/* Leaves along the branch */}
    <path d="M28 65 Q20 60 15 65 Q20 70 28 65" stroke={color} strokeWidth="1.5" />
    <path d="M48 65 Q56 60 61 65 Q56 70 48 65" stroke={color} strokeWidth="1.5" transform="rotate(180 48 45)" />
    <path d="M38 45 Q30 40 25 45 Q30 50 38 45" stroke={color} strokeWidth="1.5" />
    <path d="M42 35 Q50 30 55 35 Q50 40 42 35" stroke={color} strokeWidth="1.5" />
  </svg>
);

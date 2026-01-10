interface FloralProps {
  className?: string;
  color?: string;
}

export const Leaf1 = ({ className = '', color = '#8fb8d4' }: FloralProps) => (
  <svg viewBox="0 0 100 100" fill="none" className={className}>
    {/* Decorative leaf spray */}
    <path d="M50 80 Q40 60 35 40 Q33 25 35 15" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path d="M35 30 Q25 25 20 30 Q25 35 35 30" stroke={color} strokeWidth="1.5" />
    <path d="M35 45 Q25 40 20 45 Q25 50 35 45" stroke={color} strokeWidth="1.5" />
    <path d="M37 60 Q27 55 22 60 Q27 65 37 60" stroke={color} strokeWidth="1.5" />
    <path d="M38 30 Q48 25 53 30 Q48 35 38 30" stroke={color} strokeWidth="1.5" />
    <path d="M40 50 Q50 45 55 50 Q50 55 40 50" stroke={color} strokeWidth="1.5" />
  </svg>
);

interface FloralProps {
  className?: string;
  color?: string;
}

export const Flower1 = ({ className = '', color = '#8fb8d4' }: FloralProps) => (
  <svg viewBox="0 0 100 100" fill="none" className={className}>
    {/* Five-petal flower */}
    <circle cx="50" cy="50" r="8" stroke={color} strokeWidth="2" />
    <ellipse cx="50" cy="25" rx="12" ry="18" stroke={color} strokeWidth="2" />
    <ellipse cx="73" cy="35" rx="12" ry="18" stroke={color} strokeWidth="2" transform="rotate(72 50 50)" />
    <ellipse cx="63" cy="68" rx="12" ry="18" stroke={color} strokeWidth="2" transform="rotate(144 50 50)" />
    <ellipse cx="37" cy="68" rx="12" ry="18" stroke={color} strokeWidth="2" transform="rotate(216 50 50)" />
    <ellipse cx="27" cy="35" rx="12" ry="18" stroke={color} strokeWidth="2" transform="rotate(288 50 50)" />
  </svg>
);

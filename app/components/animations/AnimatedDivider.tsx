interface AnimatedDividerProps {
  className?: string;
}

export const AnimatedDivider = ({ className = '' }: AnimatedDividerProps) => {
  return (
    <div className={`flex items-center justify-center my-12 ${className}`}>
      <svg width="200" height="40" viewBox="0 0 200 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M10 20 Q 50 10, 100 20 T 190 20"
          stroke="#b8d4e8"
          strokeWidth="2"
          fill="none"
          className="animate-draw"
        />
        <circle cx="100" cy="20" r="4" fill="#ffd4a3" className="animate-float" />
      </svg>
    </div>
  );
};

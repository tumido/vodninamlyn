interface RotatingTextProps {
  texts: readonly string[];
  duration?: number;
  className?: string;
  delay?: number;
  direction?: "right" | "left";
}

export const RotatingText = ({
  texts,
  duration = 3000,
  className = "",
  direction = "right",
  delay = 0,
}: RotatingTextProps) => {
  // Total cycle duration includes slide-in (400ms) + display time + slide-out (400ms)
  const cycleDuration = duration + 800;
  const totalDuration = cycleDuration * texts.length;

  return (
    <span className={`relative inline-block ${className}`}>
      {texts.map((text, index) => (
        <span
          key={index}
          className="absolute animate-text-rotation"
          style={{
            [direction]: 0,
            animationDuration: `${totalDuration}ms`,
            animationDelay: `${delay + index * cycleDuration}ms`,
          }}
        >
          {text}
        </span>
      ))}
    </span>
  );
};

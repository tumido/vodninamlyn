"use client";

import * as React from "react";

export interface SpacerProps {
  delay?: number;
  animate?: boolean;
}

const Spacer = ({ delay = 0.1, animate = true }: SpacerProps) => {
  const pathRef = React.useRef<SVGPathElement>(null);
  const [pathLength, setPathLength] = React.useState(0);
  const [isVisible, setIsVisible] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  React.useEffect(() => {
    if (pathRef.current) {
      const length = pathRef.current.getTotalLength();
      setPathLength(length);
    }
  }, []);

  return (
    <div className="h-10 mx-auto pt-8 pb-32 w-lg" ref={ref}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlSpace="preserve"
        style={{
          fillRule: "evenodd",
          clipRule: "evenodd",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeMiterlimit: 1.5,
        }}
        viewBox="0 0 200 40"
      >
        <path
          ref={pathRef}
          d="M 1.47e-6,33.284039 C 1.760863,32.793913 30.740329,26.945653 46.367932,25.708885 c 12.121986,-0.959333 17.759453,3.393378 19.368381,3.969465 5.36027,1.919359 9.470532,6.139149 9.010472,8.765822 -0.3084,1.760927 -9.332547,-9.211166 -0.586064,-18.819162 C 82.907203,10.017078 93.117739,7.4040798 98.840522,9.0758596 108.40834,12.540344 106.03876,21.472022 99.688557,29.123868 93.755441,36.273131 84.388643,42.478831 76.895685,37.272044 69.744208,32.302613 89.253429,9.8910744 101.70572,15.196971 c 0,0 -2.169605,5.174554 -9.181664,11.395687 -7.080889,6.282214 -14.444391,7.047483 -14.204235,7.376591 0.5621,0.770088 9.708734,1.482155 19.283455,-10.502265 0,0 -4.593373,-4.357255 -3.907092,-7.228121 0,0 11.273006,-4.41228 10.939856,5.79552 0,0 8.29593,10.090197 10.67939,8.204895 2.38346,-1.885237 -11.23309,-28.7113351 -22.59602,-22.5960191 0,0 -0.90651,-1.2744933 0.325592,-3.1256738 1.232101,-1.8511805 4.293373,-3.77197235 7.293238,-3.71173801 2.99987,0.0602995 18.82034,7.24869851 22.33555,22.79137291 0,0 1.65602,5.638586 -1.17213,8.204895 -2.82815,2.566374 -8.76843,9.910731 -19.53546,-3.255911 0,0 15.60095,12.352013 14.97719,0.455828 -0.62377,-11.896185 -5.33703,-24.2360861 -4.42804,-14.19577 0.90898,10.040381 10.85169,17.518036 14.91207,13.349233 4.06038,-4.168737 7.40205,-10.687314 9.96474,-15.42368 1.90393,-3.5188575 6.08564,-6.6392825 19.02984,-6.8485072 3.38436,-0.054704 22.53297,2.559354 22.38471,6.6292372 -0.12095,3.320618 -5.05664,5.679626 -5.04582,2.838598 C 173.81189,1.9735661 198.00015,6.1044648 200,8.1523863"
          className="stroke-palette-dark-green"
          style={{
            fill: "none",
            strokeWidth: ".03em",
            strokeDasharray: pathLength,
            strokeDashoffset: pathLength,
            animation:
              animate && isVisible
                ? `draw-line 1s cubic-bezier(0.52, 0, 0.51, 0.98) ${delay}s forwards`
                : "",
          }}
        />
      </svg>
    </div>
  );
};
export default Spacer;

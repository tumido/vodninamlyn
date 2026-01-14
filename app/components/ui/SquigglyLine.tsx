"use client";

import * as React from "react";

const SquigglyLine = () => {
  const pathRef = React.useRef<SVGPathElement>(null);
  const [pathLength, setPathLength] = React.useState(0);

  React.useEffect(() => {
    if (pathRef.current) {
      const length = pathRef.current.getTotalLength();
      setPathLength(length);
    }
  }, []);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlSpace="preserve"
      className="w-full h-full"
      style={{
        fillRule: "evenodd",
        clipRule: "evenodd",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeMiterlimit: 1.5,
      }}
      viewBox="0 0 10 100"
      preserveAspectRatio="none"
    >
      <path
        d="M 5,0 C 9,5 9,10 5,15 C 1,20 1,25 5,30 C 9,35 9,40 5,45 C 1,50 1,55 5,60 C 9,65 9,70 5,75 C 1,80 1,85 5,90 C 9,95 9,100 8,100"
        fill="none"
        ref={pathRef}
        className="stroke-palette-green"
        style={{
          fill: "none",
          strokeWidth: ".1em",
          strokeDasharray: pathLength,
          strokeDashoffset: pathLength,
          animation: `draw-line 2s cubic-bezier(0.52, 0, 0.51, 0.98) .5s forwards`,
        }}
      />
    </svg>
  );
};
export default SquigglyLine;

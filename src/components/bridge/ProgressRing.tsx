import React from "react";

export const ProgressRing = ({
  radius,
  stroke,
  progress,
  totalProgress,
}: {
  radius: number;
  stroke: number;
  progress: number;
  totalProgress: number;
}) => {
  const normalizedRadius = radius - stroke;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / totalProgress) * circumference;

  return (
    <svg height={radius * 2} width={radius * 2}>
      <circle
        stroke="#d6d6d6"
        fill="transparent"
        strokeWidth={stroke}
        style={{ strokeDashoffset }}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <circle
        stroke="#00cf52"
        fill="transparent"
        strokeWidth={stroke}
        strokeDasharray={`${circumference} ${circumference}`}
        strokeLinecap={"round"}
        style={{ strokeDashoffset}}
        transform={`rotate(-90 ${radius} ${radius})`}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
    </svg>
  );
};

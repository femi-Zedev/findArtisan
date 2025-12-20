"use client";

interface GradientBlurAccentProps {
  position?: "left" | "right" | "center";
  top?: string;
  bottom?: string;
  gradientFrom: string;
  gradientTo: string;
  className?: string;
}

export function GradientBlurAccent({
  position = "right",
  top,
  bottom,
  gradientFrom,
  gradientTo,
  className,
}: GradientBlurAccentProps) {
  const positionClasses = {
    left: "left-0 md:left-1/4",
    right: "right-0 md:right-1/4",
    center: "left-1/2 -translate-x-1/2",
  };

  const style: React.CSSProperties = {};
  if (top) style.top = top;
  if (bottom) style.bottom = bottom;

  return (
    <div
      className={`pointer-events-none absolute ${positionClasses[position]} -z-10 ${className || ""}`}
      style={style}
      aria-hidden="true"
    >
      <div
        className={`h-60 w-60 md:h-80 md:w-80 rounded-full bg-gradient-to-tr ${gradientFrom} ${gradientTo} opacity-50 blur-[120px] md:blur-[160px] will-change-[filter]`}
      />
    </div>
  );
}



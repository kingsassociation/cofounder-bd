"use client";

import React, { useRef, useState } from "react";

interface ImageMagnifierProps {
  src: string;
  alt: string;
  zoomLevel?: number;
  lensSize?: number;
  className?: string;
  containerClassName?: string;
}

export default function ImageMagnifier({
  src,
  alt,
  zoomLevel = 2.0,
  lensSize = 160,
  className = "w-full h-full object-contain",
  containerClassName = "relative w-full h-full overflow-hidden flex items-center justify-center cursor-none",
}: ImageMagnifierProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lensRef = useRef<HTMLDivElement>(null);
  const [showLens, setShowLens] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    const container = containerRef.current;
    const lens = lensRef.current;
    if (!container || !lens) return;

    // Skip zoom on touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if mouse is within container bounds
    if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
      setShowLens(false);
      return;
    }

    setShowLens(true);

    const half = lensSize / 2;
    const lx = Math.max(0, Math.min(x - half, rect.width - lensSize));
    const ly = Math.max(0, Math.min(y - half, rect.height - lensSize));

    lens.style.transform = `translate3d(${lx}px, ${ly}px, 0)`;

    const bgX = half - x * zoomLevel;
    const bgY = half - y * zoomLevel;

    lens.style.backgroundPosition = `${bgX}px ${bgY}px`;
    lens.style.backgroundSize = `${rect.width * zoomLevel}px ${rect.height * zoomLevel}px`;
  };

  const handleMouseLeave = () => {
    setShowLens(false);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={containerClassName}
    >
      <img
        src={src}
        alt={alt}
        className={className}
        draggable={false}
      />

      <div
        ref={lensRef}
        className={`absolute top-0 left-0 rounded-full pointer-events-none transition-opacity duration-200 z-20 ${
          showLens ? "opacity-100" : "opacity-0"
        }`}
        style={{
          width: lensSize,
          height: lensSize,
          backgroundImage: `url("${src}")`,
          backgroundRepeat: "no-repeat",
          border: "2px solid rgba(255,255,255,0.9)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
          willChange: "transform",
        }}
      />
    </div>
  );
}

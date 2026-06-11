"use client";

import { useEffect, useState } from "react";

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  opacity: number;
}

const BRIGHT_STARS = [
  { x: 12, y: 8 },
  { x: 78, y: 12 },
  { x: 43, y: 6 },
  { x: 91, y: 28 },
  { x: 6, y: 32 },
  { x: 55, y: 18 },
  { x: 30, y: 22 },
  { x: 66, y: 40 },
];

export default function StarField() {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    setStars(
      Array.from({ length: 180 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 0.5,
        delay: Math.random() * 6,
        duration: Math.random() * 3 + 2,
        opacity: Math.random() * 0.5 + 0.25,
      }))
    );
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Regular stars */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            animation: `twinkle ${star.duration}s ease-in-out ${star.delay}s infinite`,
          }}
        />
      ))}

      {/* Bright stars with glow */}
      {BRIGHT_STARS.map((s, i) => (
        <div
          key={`bright-${i}`}
          className="absolute rounded-full bg-white"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: "4px",
            height: "4px",
            boxShadow: "0 0 8px 3px rgba(255,255,255,0.55)",
            animation: `twinkle ${3 + i * 0.4}s ease-in-out ${i * 0.6}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

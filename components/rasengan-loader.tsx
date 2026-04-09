"use client";

import { useEffect, useState } from "react";

export function RasenganLoader() {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => prev + 10);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="relative w-20 h-20">
        {/* Outer sphere */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(circle at 30% 30%, #60A5FA, #3B82F6, #2563EB, #1E40AF)",
            boxShadow:
              "0 0 30px rgba(59, 130, 246, 0.8), 0 0 60px rgba(59, 130, 246, 0.5), inset 0 0 20px rgba(255, 255, 255, 0.3)",
            transform: `rotate(${rotation}deg)`,
          }}
        />
        {/* Inner chakra */}
        <div
          className="absolute inset-2 rounded-full"
          style={{
            background:
              "radial-gradient(circle at 40% 40%, #93C5FD, #60A5FA, #3B82F6)",
            boxShadow: "0 0 20px rgba(96, 165, 250, 0.9)",
            transform: `rotate(${-rotation * 2}deg)`,
          }}
        />
        {/* Core */}
        <div
          className="absolute inset-6 rounded-full"
          style={{
            background:
              "radial-gradient(circle, #FFFFFF, #DBEAFE, #93C5FD)",
            boxShadow: "0 0 15px rgba(255, 255, 255, 1)",
          }}
        />
        {/* Rotating chakra arms */}
        {[0, 120, 240].map((angle) => (
          <div
            key={angle}
            className="absolute inset-0"
            style={{ transform: `rotate(${rotation + angle}deg)` }}
          >
            <div
              className="absolute top-1 left-1/2 -translate-x-1/2 w-1 h-4 rounded-full"
              style={{
                background:
                  "linear-gradient(to top, #3B82F6, #60A5FA, transparent)",
                boxShadow: "0 0 10px rgba(96, 165, 250, 0.8)",
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

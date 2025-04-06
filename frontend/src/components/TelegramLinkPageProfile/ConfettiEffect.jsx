// ConfettiEffect.jsx
import React from "react";

const ConfettiEffect = ({ showConfetti }) => {
  if (!showConfetti) return null;
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {Array.from({ length: 50 }).map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${Math.random() * 100}%`,
            top: `-20px`,
            width: `${Math.random() * 10 + 5}px`,
            height: `${Math.random() * 10 + 5}px`,
            borderRadius: "50%",
            background: `hsl(${Math.random() * 360}, 80%, 60%)`,
            animation: `fall${i % 3} ${Math.random() * 2 + 2}s linear forwards`,
          }}
        />
      ))}
      <style jsx="true">{`
        @keyframes fall0 {
          to {
            transform: translateY(100vh) rotate(360deg);
          }
        }
        @keyframes fall1 {
          to {
            transform: translateY(100vh) translateX(100px) rotate(360deg);
          }
        }
        @keyframes fall2 {
          to {
            transform: translateY(100vh) translateX(-100px) rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default ConfettiEffect;

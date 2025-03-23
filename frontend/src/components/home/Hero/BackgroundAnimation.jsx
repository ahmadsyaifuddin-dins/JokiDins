// BackgroundAnimation.jsx
import React from "react";

const BackgroundAnimation = () => {
  return (
    <>
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px), radial-gradient(circle, rgba(59, 130, 246, 0.1) 2px, transparent 2px)",
            backgroundSize: "50px 50px, 100px 100px",
          }}
        />
      </div>
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-900 rounded-full filter blur-xl opacity-20 animate-pulse duration-4000"></div>
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-blue-950 rounded-full filter blur-xl opacity-20 animate-pulse duration-5000"></div>
      <div className="absolute top-2/3 left-1/3 w-64 h-64 bg-slate-950 rounded-full filter blur-xl opacity-10 animate-pulse duration-3000"></div>
    </>
  );
};

export default BackgroundAnimation;

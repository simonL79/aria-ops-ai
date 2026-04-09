
import React from 'react';

const particles = [
  { size: 3, top: '15%', left: '10%', delay: '0s', duration: '8s' },
  { size: 2, top: '60%', left: '85%', delay: '2s', duration: '10s' },
  { size: 4, top: '30%', left: '70%', delay: '4s', duration: '12s' },
  { size: 2, top: '80%', left: '25%', delay: '1s', duration: '9s' },
  { size: 3, top: '45%', left: '50%', delay: '3s', duration: '11s' },
];

const AmbientGrid = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {particles.map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-primary/10 animate-drift"
          style={{
            width: p.size,
            height: p.size,
            top: p.top,
            left: p.left,
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        />
      ))}
    </div>
  );
};

export default AmbientGrid;

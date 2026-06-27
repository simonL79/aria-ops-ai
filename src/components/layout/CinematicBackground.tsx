import React from 'react';

/**
 * Site-wide cinematic ambient backdrop.
 * Charcoal base with a soft violet vignette and a subtle grain layer,
 * fixed behind all content so every page shares the same documentary-grade
 * atmosphere. Purely decorative and pointer-events-none.
 */
const CinematicBackground = () => {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-background"
    >
      {/* Top violet vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 80% at 50% -10%, hsl(258 60% 18% / 0.55) 0%, hsl(240 12% 5% / 0) 55%)',
        }}
      />
      {/* Lower-left ambient glow */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(70% 60% at 0% 100%, hsl(258 50% 20% / 0.30) 0%, hsl(240 12% 5% / 0) 60%)',
        }}
      />
      {/* Right info-blue whisper */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(60% 50% at 100% 30%, hsl(199 80% 30% / 0.12) 0%, hsl(240 12% 5% / 0) 55%)',
        }}
      />
      {/* Fine grain for filmic texture */}
      <div
        className="absolute inset-0 opacity-[0.05] mix-blend-soft-light"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
};

export default CinematicBackground;

import React, { useMemo } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

/*
  Active Digital Footprint — a living constellation, not a dashboard.
  Central ARIA core, breathing source nodes, pulsing filaments, and
  intelligence packets travelling inward. Nothing numerical.
*/

const SOURCES = [
  'Google',
  'AI Search',
  'News',
  'Social',
  'Reviews',
  'Forums',
  'Dark Web',
  'Corporate Records',
];

const VB = 1000; // viewBox size
const CX = 500;
const CY = 500;
const RADIUS = 360;

const ActiveFootprintSection = () => {
  const { ref, visible } = useScrollReveal();

  const nodes = useMemo(
    () =>
      SOURCES.map((label, i) => {
        const angle = (i / SOURCES.length) * Math.PI * 2 - Math.PI / 2;
        return {
          label,
          x: CX + Math.cos(angle) * RADIUS,
          y: CY + Math.sin(angle) * RADIUS,
          delay: (i % SOURCES.length) * 0.4,
        };
      }),
    []
  );

  return (
    <section
      id="active-footprint"
      ref={ref as React.RefObject<HTMLElement>}
      className="relative py-28 md:py-36 bg-background overflow-hidden"
    >
      {/* ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-primary/[0.06] rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div
          className={`max-w-2xl mx-auto text-center mb-16 transition-all duration-700 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <span className="text-[11px] font-medium tracking-[0.25em] uppercase text-primary/80">
            The ARIA Intelligence Engine
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-semibold text-foreground mt-4 leading-tight">
            Your active digital footprint
          </h2>
          <p className="text-muted-foreground text-lg mt-5 leading-relaxed">
            Everything written, searched, indexed and inferred about you — watched
            in real time across every surface that shapes your reputation.
          </p>
        </div>

        <div
          className={`relative max-w-3xl mx-auto aspect-square transition-all duration-1000 ${
            visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          <svg viewBox={`0 0 ${VB} ${VB}`} className="w-full h-full">
            <defs>
              <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="hsl(258 90% 66%)" stopOpacity="0.9" />
                <stop offset="60%" stopColor="hsl(258 90% 66%)" stopOpacity="0.25" />
                <stop offset="100%" stopColor="hsl(258 90% 66%)" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="filamentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(258 90% 66%)" stopOpacity="0.05" />
                <stop offset="100%" stopColor="hsl(258 90% 66%)" stopOpacity="0.5" />
              </linearGradient>
            </defs>

            {/* filaments */}
            {nodes.map((n, i) => (
              <line
                key={`l-${i}`}
                x1={n.x}
                y1={n.y}
                x2={CX}
                y2={CY}
                stroke="url(#filamentGrad)"
                strokeWidth="1.5"
                strokeDasharray="4 6"
                className="animate-filament"
                style={{ animationDelay: `${n.delay}s` }}
              />
            ))}

            {/* intelligence packets travelling inward */}
            {nodes.map((n, i) => (
              <circle key={`p-${i}`} r="3.5" fill="hsl(258 90% 76%)">
                <animate
                  attributeName="cx"
                  values={`${n.x};${CX}`}
                  dur="3.4s"
                  begin={`${n.delay}s`}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="cy"
                  values={`${n.y};${CY}`}
                  dur="3.4s"
                  begin={`${n.delay}s`}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0;0.9;0"
                  dur="3.4s"
                  begin={`${n.delay}s`}
                  repeatCount="indefinite"
                />
              </circle>
            ))}

            {/* concentric rings */}
            {[170, 250, 340].map((r) => (
              <circle
                key={`r-${r}`}
                cx={CX}
                cy={CY}
                r={r}
                fill="none"
                stroke="hsl(0 0% 100% / 0.04)"
                strokeWidth="1"
              />
            ))}

            {/* core */}
            <circle cx={CX} cy={CY} r="120" fill="url(#coreGlow)" className="animate-breathe" style={{ transformOrigin: 'center', transformBox: 'fill-box' }} />
            <circle cx={CX} cy={CY} r="46" fill="hsl(240 11% 9%)" stroke="hsl(258 90% 66% / 0.5)" strokeWidth="1.5" />
            <text
              x={CX}
              y={CY + 6}
              textAnchor="middle"
              className="font-display"
              fill="hsl(210 40% 98%)"
              fontSize="26"
              fontWeight="600"
              letterSpacing="2"
            >
              ARIA
            </text>

            {/* source nodes */}
            {nodes.map((n, i) => {
              const labelBelow = n.y > CY + 40;
              const labelAbove = n.y < CY - 40;
              const dy = labelBelow ? 34 : labelAbove ? -24 : 5;
              const anchor =
                Math.abs(n.x - CX) < 60 ? 'middle' : n.x > CX ? 'start' : 'end';
              const dx = anchor === 'middle' ? 0 : n.x > CX ? 16 : -16;
              return (
                <g key={`n-${i}`}>
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r="7"
                    fill="hsl(258 90% 66%)"
                    className="animate-breathe"
                    style={{ animationDelay: `${n.delay}s`, transformOrigin: 'center', transformBox: 'fill-box' }}
                  />
                  <circle cx={n.x} cy={n.y} r="14" fill="none" stroke="hsl(258 90% 66% / 0.25)" strokeWidth="1" />
                  <text
                    x={n.x + dx}
                    y={n.y + dy}
                    textAnchor={anchor}
                    fill="hsl(220 9% 72%)"
                    fontSize="20"
                    className="font-sans"
                  >
                    {n.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </section>
  );
};

export default ActiveFootprintSection;

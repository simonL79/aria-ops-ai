
import React from 'react';
import CinematicImage from '@/components/ui/CinematicImage';

interface SectionDividerProps {
  glow?: boolean;
}

const SectionDivider = ({ glow = false }: SectionDividerProps) => {
  return (
    <div className="relative py-6 overflow-hidden">
      {/* Cinematic streak backdrop */}
      <CinematicImage
        variant="divider"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[120px] w-[140%] max-w-none -translate-x-1/2 -translate-y-1/2 object-cover opacity-40"
      />
      <div className="relative h-px w-full bg-gradient-to-r from-transparent via-primary/25 to-transparent" />
      {glow && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary/40 blur-sm" />
      )}
    </div>
  );
};

export default SectionDivider;


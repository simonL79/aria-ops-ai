
import React from 'react';

interface SectionDividerProps {
  glow?: boolean;
}

const SectionDivider = ({ glow = false }: SectionDividerProps) => {
  return (
    <div className="relative py-2">
      <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      {glow && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary/30 blur-sm" />
      )}
    </div>
  );
};

export default SectionDivider;

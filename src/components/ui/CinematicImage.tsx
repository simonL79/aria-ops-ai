import React from 'react';

// Responsive, multi-format variants generated at build time by vite-imagetools.
// Each background is emitted at 640 / 1280 / 1920 widths in AVIF + WebP, with a
// JPEG fallback for the <img>. Quality is kept high (AVIF 60 ≈ visually lossless
// for these dark cinematic plates) while cutting bytes dramatically vs the
// original JPEGs.
import heroAvif from '@/assets/cinematic-hero-bg.jpg?w=640;1280;1920&format=avif&quality=60&as=srcset';
import heroWebp from '@/assets/cinematic-hero-bg.jpg?w=640;1280;1920&format=webp&quality=72&as=srcset';
import heroFallback from '@/assets/cinematic-hero-bg.jpg?w=1280&quality=72';

import dividerAvif from '@/assets/cinematic-divider-bg.jpg?w=640;1280;1920&format=avif&quality=60&as=srcset';
import dividerWebp from '@/assets/cinematic-divider-bg.jpg?w=640;1280;1920&format=webp&quality=72&as=srcset';
import dividerFallback from '@/assets/cinematic-divider-bg.jpg?w=1280&quality=72';

import ctaAvif from '@/assets/cinematic-cta-bg.jpg?w=640;1280;1920&format=avif&quality=60&as=srcset';
import ctaWebp from '@/assets/cinematic-cta-bg.jpg?w=640;1280;1920&format=webp&quality=72&as=srcset';
import ctaFallback from '@/assets/cinematic-cta-bg.jpg?w=1280&quality=72';

type CinematicVariant = 'hero' | 'divider' | 'cta';

export const CINEMATIC_VARIANTS: Record<
  CinematicVariant,
  { avif: string; webp: string; fallback: string; width: number; height: number }
> = {
  hero: { avif: heroAvif, webp: heroWebp, fallback: heroFallback, width: 1920, height: 1088 },
  divider: { avif: dividerAvif, webp: dividerWebp, fallback: dividerFallback, width: 1920, height: 640 },
  cta: { avif: ctaAvif, webp: ctaWebp, fallback: ctaFallback, width: 1920, height: 1088 },
};

const VARIANTS = CINEMATIC_VARIANTS;

interface CinematicImageProps {
  variant: CinematicVariant;
  className?: string;
  /** Eager-load above-the-fold heroes; lazy-load everything below. */
  priority?: boolean;
  /** Hint for the browser to pick the right candidate. Defaults to full-bleed. */
  sizes?: string;
}

const CinematicImage = ({
  variant,
  className,
  priority = false,
  sizes = '100vw',
}: CinematicImageProps) => {
  const v = VARIANTS[variant];
  return (
    <picture>
      <source type="image/avif" srcSet={v.avif} sizes={sizes} />
      <source type="image/webp" srcSet={v.webp} sizes={sizes} />
      <img
        src={v.fallback}
        alt=""
        aria-hidden="true"
        width={v.width}
        height={v.height}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        // @ts-expect-error fetchpriority is a valid DOM attribute
        fetchpriority={priority ? 'high' : 'auto'}
        className={className}
      />
    </picture>
  );
};

export default CinematicImage;

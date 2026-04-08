

# Make ARIA Logo 3x Bigger on Homepage

## Change

**File: `src/components/ui/logo.tsx`**
- Add a new size option `'3xl'` with `logo: 'h-96'` (384px — exactly 3× the current `xl` at 128px)

**File: `src/components/sections/HeroSection.tsx`**
- Change `<Logo variant="light" size="xl" />` to `<Logo variant="light" size="3xl" />`

Two lines changed across two files.


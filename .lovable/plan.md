## Fix the giant logo

I broke the logo height in the previous turn. While adding explicit `width={512}` / `height={512}` attributes to `src/components/ui/logo.tsx` (to satisfy the Lighthouse aspect-ratio finding), I also appended `h-auto` to the className. `h-auto` overrides the size token (`h-6` / `h-10` / `h-16` etc.) that was constraining the rendered height, so the image now renders at its intrinsic 512px.

### Change

In `src/components/ui/logo.tsx`, swap `h-auto` for `w-auto`:

```tsx
className={cn(logoSize.logo, 'max-w-full w-auto')}
```

That lets the size token (`h-10` etc.) win for height and the browser scales width proportionally — the explicit `width`/`height` attrs still give the browser the aspect ratio for layout reservation, which is what the Lighthouse fix needed.

No other files change.

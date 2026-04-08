

# Fix Blank Screen — CSS Compilation Error

## Problem
`src/index.css` line 143-145 uses `@apply` inside `@layer utilities` for `.glass-card`. When Tailwind compiles this, it produces malformed CSS with mismatched braces, causing a PostCSS parse error that kills the entire app.

Error: `[postcss] /dev-server/src/index.css:169:3: Unexpected }`

## Fix

**File: `src/index.css`** — Replace `@apply` in `.glass-card` with equivalent plain CSS:

```css
.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
}
```

This produces the exact same visual result without the `@apply` compilation issue.

One file changed. Instant fix.


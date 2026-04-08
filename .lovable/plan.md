

# Add Reading Progress Bar to Blog Post Pages

A thin, fixed progress bar at the top of the screen that fills left-to-right as the reader scrolls through the article content. Orange-themed to match the brand.

---

## Implementation

### New Component: `ReadingProgressBar.tsx`

Create `src/components/blog/ReadingProgressBar.tsx`:
- Fixed to top of viewport (`fixed top-0 left-0 z-50`)
- Thin orange bar (3px height, `bg-orange-500`)
- Width driven by scroll percentage of the article content area
- Uses `useEffect` with a `scroll` event listener on `window`
- Calculates progress based on article container's top/bottom position relative to viewport
- Smooth CSS transition on width for fluid animation
- Only renders when scroll progress > 0

### Edit: `BlogPostPage.tsx`

- Import and render `<ReadingProgressBar />` inside the article view (not in loading/error states)
- Pass a ref to the article content container so progress is scoped to the article, not the full page

---

## Files

| File | Change |
|------|--------|
| `src/components/blog/ReadingProgressBar.tsx` | **New** — fixed progress bar component |
| `src/pages/BlogPostPage.tsx` | Import and add progress bar |

No new dependencies. Pure CSS + scroll event listener.


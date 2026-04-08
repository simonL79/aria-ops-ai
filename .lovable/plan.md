

# Restyle Blog Pages to Match the Dark AI Aesthetic

The blog page and blog post page use generic theme tokens (`bg-background`, `bg-card`, `border-border`) which render as a light, plain design. The rest of the site uses an explicit dark theme with black backgrounds, orange accents, glassmorphism, and scroll animations. Here's how to bring the blog in line.

---

## 1. Blog Listing Page (`BlogPage.tsx`)

- Change outer wrapper from `bg-background` to `bg-black`
- Heading: white text, add scroll-reveal animation
- Subheading: `text-gray-400`
- Skeleton cards: dark-themed (`bg-gray-900`, `border-gray-800`)
- Post cards: `bg-black/50 border-gray-800 backdrop-blur` with `hover:border-orange-500/50` glow effect (matching the glassmorphism style from other sections)
- Card text: white title, `text-gray-400` summary, orange hover on title
- "Load More" button: orange outline style
- Add scroll-reveal entrance animation using existing `useScrollReveal` hook

## 2. Blog Post Page (`BlogPostPage.tsx`)

- Change outer wrapper from `bg-background` to `bg-black`
- Back link: orange colored
- Title: white text
- Meta row: `text-gray-400`, badges with dark background
- `blog-prose` content: ensure text renders white/light gray (may need a global CSS tweak or inline prose class override)
- Related articles cards: dark-themed matching the listing cards
- CTA section at bottom: dark card with orange button
- FAQ accordion: dark borders, orange accent on triggers

## 3. Blog Prose Styles

Check if there's a `blog-prose` CSS class defined. If so, update it for dark backgrounds (light text, orange links). If not, add one in the global stylesheet.

---

## Files Changed

| File | Change |
|------|--------|
| `src/pages/BlogPage.tsx` | Dark theme, glassmorphism cards, scroll animation |
| `src/pages/BlogPostPage.tsx` | Dark theme, dark prose, dark related cards |
| Global CSS (if `blog-prose` exists) | Light text for dark background |

No new dependencies. Purely visual changes using existing patterns from the homepage sections.


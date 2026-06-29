import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import type { BlogPost } from '@/types/blog';

// Mutable mock state for the blog hook
let mockState: any;
vi.mock('@/hooks/useBlogPosts', () => ({
  useBlogPosts: () => mockState,
  syncBlogPosts: vi.fn(),
}));

// Keep layout/SEO/scroll-reveal inert so the test focuses on list stability
vi.mock('@/components/layout/PublicLayout', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));
vi.mock('@/components/seo/SEO', () => ({ default: () => null }));
vi.mock('@/hooks/useScrollReveal', () => ({
  useScrollReveal: () => ({ ref: { current: null }, visible: true }),
}));

import BlogPage from '@/pages/BlogPage';

const renderPage = () =>
  render(
    <HelmetProvider>
      <MemoryRouter>
        <BlogPage />
      </MemoryRouter>
    </HelmetProvider>
  );

const makePost = (i: number): BlogPost =>
  ({
    id: `id-${i}`,
    title: `Post ${i}`,
    slug: `post-${i}`,
    summary: 'Summary',
    image_url: null,
    published_at: '2026-01-01',
    reading_time: 3,
  } as unknown as BlogPost);

const baseState = {
  blogPosts: [],
  loading: false,
  syncing: false,
  error: null,
  hasMore: false,
  loadMore: vi.fn(),
  refetch: vi.fn(),
};

describe('Blog list loading stability', () => {
  beforeEach(() => {
    mockState = { ...baseState };
  });

  it('does NOT mount the SoroEmbed block while loading (prevents layout shift)', () => {
    mockState = { ...baseState, loading: true };
    const { container } = renderPage();
    // SoroEmbed renders a #soro-blog node — it must be absent during loading
    expect(container.querySelector('#soro-blog')).toBeNull();
  });

  it('mounts the SoroEmbed block only after loading completes', () => {
    mockState = { ...baseState, loading: false, blogPosts: [makePost(1)] };
    const { container } = renderPage();
    expect(container.querySelector('#soro-blog')).not.toBeNull();
  });

  it('shows a fixed 6-card skeleton grid while loading so the grid box is reserved', () => {
    mockState = { ...baseState, loading: true };
    const { container } = renderPage();
    const skeletons = container.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBe(6);
  });

  it('keeps SoroEmbed below the posts grid (mount order is stable, not reordered)', () => {
    mockState = { ...baseState, loading: false, blogPosts: [makePost(1), makePost(2)] };
    const { container } = renderPage();
    const grid = container.querySelector('.grid');
    const soro = container.querySelector('#soro-blog');
    expect(grid).not.toBeNull();
    expect(soro).not.toBeNull();
    // DOCUMENT_POSITION_FOLLOWING (4) means soro comes after the grid
    expect(grid!.compareDocumentPosition(soro!) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it('renders neither skeletons nor a premature SoroEmbed shift between states', () => {
    // Loading state: skeletons present, no soro
    mockState = { ...baseState, loading: true };
    const { container, rerender } = renderPage();
    expect(container.querySelectorAll('.animate-pulse').length).toBe(6);
    expect(container.querySelector('#soro-blog')).toBeNull();

    // Loaded state: soro appears, skeletons gone
    mockState = { ...baseState, loading: false, blogPosts: [makePost(1)] };
    rerender(
      <HelmetProvider>
        <MemoryRouter>
          <BlogPage />
        </MemoryRouter>
      </HelmetProvider>
    );
    expect(container.querySelectorAll('.animate-pulse').length).toBe(0);
    expect(container.querySelector('#soro-blog')).not.toBeNull();
  });
});

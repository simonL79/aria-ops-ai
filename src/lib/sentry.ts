import * as Sentry from '@sentry/react';

/**
 * Sentry is optional: when VITE_SENTRY_DSN is not configured every helper here
 * becomes a no-op so local/preview builds behave exactly as before.
 */
const dsn = import.meta.env.VITE_SENTRY_DSN as string | undefined;

export const isSentryEnabled = Boolean(dsn);

/** Release identifier — set VITE_SENTRY_RELEASE in CI (e.g. the git SHA). */
export const sentryRelease =
  (import.meta.env.VITE_SENTRY_RELEASE as string | undefined) || 'aria-web@dev';

export const sentryEnvironment =
  (import.meta.env.VITE_SENTRY_ENVIRONMENT as string | undefined) ||
  (import.meta.env.PROD ? 'production' : 'development');

export function initSentry() {
  if (!dsn) {
    console.info('[sentry] VITE_SENTRY_DSN not set — error reporting disabled');
    return;
  }

  Sentry.init({
    dsn,
    release: sentryRelease,
    environment: sentryEnvironment,
    integrations: [Sentry.browserTracingIntegration()],
    // Keep volume low but capture enough to spot regressions on the
    // resurfacing routes.
    tracesSampleRate: 0.1,
    sendDefaultPii: false,
    ignoreErrors: [
      'ResizeObserver loop limit exceeded',
      'ResizeObserver loop completed with undelivered notifications.',
      'Non-Error promise rejection captured',
    ],
  });
}

/** Attach the signed-in user (id only — no PII) to subsequent events. */
export function setSentryUser(userId: string | null) {
  if (!isSentryEnabled) return;
  Sentry.setUser(userId ? { id: userId } : null);
}

interface ReportOptions {
  section: string;
  error: unknown;
  componentStack?: string | null;
  context?: Record<string, unknown>;
}

/**
 * Report an error (crash or handled failure) to Sentry, tagged with the
 * section and current route so resurfacing issues are easy to filter.
 */
export function reportToSentry({ section, error, componentStack, context }: ReportOptions) {
  if (!isSentryEnabled) return;

  try {
    Sentry.withScope((scope) => {
      scope.setTag('section', section);
      scope.setTag(
        'route',
        typeof window !== 'undefined' ? window.location.pathname : 'unknown',
      );
      if (context) scope.setContext('details', context);
      if (componentStack) scope.setContext('react', { componentStack });

      if (error instanceof Error) {
        Sentry.captureException(error);
      } else {
        const anyErr = error as any;
        const message = anyErr?.message || anyErr?.error_description || String(error);
        Sentry.captureException(new Error(`[${section}] ${message}`));
      }
    });
  } catch (err) {
    console.error('[sentry] failed to report error:', err);
  }
}

export { Sentry };
